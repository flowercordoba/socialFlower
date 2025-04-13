import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token inválido" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: {
      verificationToken: token,
      verificationTokenExpires: { gte: new Date() },
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Token inválido o expirado" },
      { status: 400 },
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      verified: true,
      verificationToken: null,
      verificationTokenExpires: null,
    },
  });

  return NextResponse.json({ message: "Cuenta verificada exitosamente." });
}
