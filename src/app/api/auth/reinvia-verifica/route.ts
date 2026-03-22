import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";
import { resendVerifyLimiter } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email mancante" }, { status: 400 });
    }

    const { allowed } = resendVerifyLimiter(email);
    if (!allowed) {
      return NextResponse.json(
        { error: "Troppi tentativi. Riprova tra un'ora." },
        { status: 429 }
      );
    }

    const user = await db.user.findUnique({ where: { email } });

    if (user && !user.emailVerified) {
      const token = await createToken(
        user.id,
        "EMAIL_VERIFICATION",
        24 * 60 * 60 * 1000
      );
      await sendVerificationEmail(email, user.name ?? "utente", token);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
