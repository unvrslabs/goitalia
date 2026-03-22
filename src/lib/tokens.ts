import crypto from "crypto";
import { db } from "./db";

export type TokenType = "EMAIL_VERIFICATION" | "PASSWORD_RESET";

/** Genera token raw + salva hash SHA-256 su DB */
export async function createToken(
  userId: string,
  type: TokenType,
  expiresInMs: number
): Promise<string> {
  // Elimina token esistenti dello stesso tipo per questo utente
  await db.authToken.deleteMany({ where: { userId, type } });

  const raw = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");

  await db.authToken.create({
    data: {
      userId,
      token: hash,
      type,
      expiresAt: new Date(Date.now() + expiresInMs),
    },
  });

  return raw;
}

/** Valida token raw — ritorna userId se valido, null altrimenti */
export async function validateToken(
  raw: string,
  type: TokenType
): Promise<string | null> {
  const hash = crypto.createHash("sha256").update(raw).digest("hex");

  const token = await db.authToken.findFirst({
    where: { token: hash, type },
  });

  if (!token) return null;

  if (token.expiresAt < new Date()) {
    await db.authToken.delete({ where: { id: token.id } });
    return null;
  }

  return token.userId;
}

/** Elimina tutti i token di un tipo per un utente */
export async function deleteTokens(
  userId: string,
  type: TokenType
): Promise<void> {
  await db.authToken.deleteMany({ where: { userId, type } });
}
