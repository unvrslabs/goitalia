import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/email";
import { passwordResetLimiter } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";

    const byIp = passwordResetLimiter(ip);
    const byEmail = passwordResetLimiter(`email:${email}`);

    // Risposta identica anche in caso di rate limit (anti-enumerazione)
    if (!byIp.allowed || !byEmail.allowed) {
      return NextResponse.json({ ok: true });
    }

    const user = await db.user.findUnique({ where: { email } });

    if (user) {
      const token = await createToken(
        user.id,
        "PASSWORD_RESET",
        60 * 60 * 1000
      );
      await sendPasswordResetEmail(email, user.name ?? "utente", token);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
