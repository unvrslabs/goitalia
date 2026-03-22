import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateToken, deleteTokens } from "@/lib/tokens";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token mancante" }, { status: 400 });
    }

    const userId = await validateToken(token, "EMAIL_VERIFICATION");

    if (!userId) {
      return NextResponse.json(
        { error: "Link non valido o scaduto" },
        { status: 400 }
      );
    }

    await db.user.update({
      where: { id: userId },
      data: { emailVerified: new Date() },
    });

    await deleteTokens(userId, "EMAIL_VERIFICATION");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
