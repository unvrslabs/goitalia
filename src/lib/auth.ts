import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { LRUCache } from "lru-cache";
import { db } from "./db";

// Cache per passwordChangedAt (TTL 5 minuti). Usa 0 come sentinel per "null" (nessun reset).
const passwordChangedCache = new LRUCache<string, number>({
  max: 5000,
  ttl: 5 * 60 * 1000,
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as NextAuthOptions["adapter"],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          emailVerified: profile.email_verified ? new Date() : null,
        };
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        // Dummy hash per prevenire timing attack su email inesistenti
        const dummyHash =
          "$2a$10$dummyhashtopreventtimingattacksxxxxxxxxxxxxxxxxxxxxxxxxx";
        const passwordToCheck = user?.passwordHash ?? dummyHash;
        const valid = await bcrypt.compare(credentials.password, passwordToCheck);

        if (!user || !valid) {
          throw new Error("INVALID_CREDENTIALS");
        }

        if (!user.emailVerified) {
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          passwordChangedAt: user.passwordChangedAt?.getTime() ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        const googleProfile = profile as { email_verified?: boolean; email?: string };

        // Blocca se Google non ha verificato l'email
        if (!googleProfile?.email_verified) return false;

        // Blocca se l'email ha già un account con password
        if (googleProfile.email) {
          const existing = await db.user.findUnique({
            where: { email: googleProfile.email },
          });
          if (existing?.passwordHash) {
            return "/login?errore=account-esiste";
          }
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // Al primo login aggiungi dati al token
      if (user) {
        token.id = user.id;
        token.passwordChangedAt =
          (user as { passwordChangedAt?: number | null }).passwordChangedAt ?? null;
      }

      // Controlla invalidazione sessione (con cache 5 min)
      if (token.id) {
        const userId = token.id as string;
        const cached = passwordChangedCache.get(userId);

        let dbValue: number;
        if (cached === undefined) {
          const dbUser = await db.user.findUnique({
            where: { id: userId },
            select: { passwordChangedAt: true },
          });
          // 0 = sentinel per "nessun reset password"
          dbValue = dbUser?.passwordChangedAt?.getTime() ?? 0;
          passwordChangedCache.set(userId, dbValue);
        } else {
          dbValue = cached;
        }

        const jwtValue = (token.passwordChangedAt as number | null) ?? 0;

        // Divergenza → sessione invalidata
        if (dbValue !== 0 && dbValue !== jwtValue) {
          return {};
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (!token.id) {
        // Sessione invalidata: forza reindirizzamento al login
        return { ...session, user: { id: "", name: null, email: null, image: null } };
      }
      session.user = {
        ...session.user,
        id: token.id as string,
      };
      return session;
    },
  },
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
