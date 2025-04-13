import { Resend } from "resend";
import VerificationEmail from "@/components/emails/VerificationEmail";
import React from "react";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`;

  try {
    await resend.emails.send({
      from: "Yebaam <onboarding@resend.dev>",
      to: email,
      subject: "Verifica tu cuenta",
      react: React.createElement(VerificationEmail, { verificationLink }),
    });
  } catch (error) {
    console.error("Error al enviar correo de verificación:", error);
    throw error;
  }
}
