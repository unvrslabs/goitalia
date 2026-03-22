import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { validateToken, deleteTokens } from "@/lib/tokens";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password troppo corta (minimo 8 caratteri)" },
        { status: 400 }
      );
    }

    const userId = await validateToken(token, "PASSWORD_RESET");

    if (!userId) {
      return NextResponse.json(
        { error: "Link non valido o scaduto" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await db.user.update({
      where: { id: userId },
      data: {
        passwordHash,
        passwordChangedAt: new Date(),
      },
    });

    await deleteTokens(userId, "PASSWORD_RESET");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
