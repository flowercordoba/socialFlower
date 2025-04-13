import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { addHours } from "date-fns";
import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/resend";
import { validateRequest } from "@/auth";

export async function POST(
  req: Request,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = uuidv4();
    const tokenExpires = addHours(new Date(), 24);

    await prisma.user.update({
      where: { id: userId },
      data: {
        verificationToken: token,
        verificationTokenExpires: tokenExpires,
      },
    });

    await sendVerificationEmail(user.email, token);

    return NextResponse.json({ message: "Correo de verificación enviado." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
