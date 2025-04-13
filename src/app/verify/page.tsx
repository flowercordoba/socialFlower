"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token inválido.");
      return;
    }

    async function verifyEmail() {
      try {
        const res = await fetch(`/api/verify?token=${token}`);
        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage("Tu cuenta ha sido verificada exitosamente.");
        } else {
          setStatus("error");
          setMessage(data.error || "Error al verificar el correo.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Ocurrió un error inesperado.");
      }
    }

    verifyEmail();
  }, [token]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      {status === "loading" && (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p>Verificando tu cuenta...</p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center gap-4">
          <CheckCircle className="size-10 text-green-600" />
          <h1 className="text-lg font-semibold">{message}</h1>
          <Button asChild>
            <a href="/">Ir al inicio</a>
          </Button>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center gap-4">
          <XCircle className="size-10 text-red-600" />
          <h1 className="text-lg font-semibold">{message}</h1>
          <Button asChild variant="destructive">
            <a href="/">Volver al inicio</a>
          </Button>
        </div>
      )}
    </div>
  );
}
