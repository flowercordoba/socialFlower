"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function VerificationBanner({ userId }: { userId: string }) {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);

  async function resendVerification() {
    setIsSending(true);
    try {
      const res = await fetch(`/api/users/${userId}/resend-verification`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        toast({ variant: "default", description: data.message });
      } else {
        toast({ variant: "destructive", description: data.error });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Error al reenviar el correo.",
      });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="bg-yellow-100 p-4 text-yellow-900 shadow-md">
      <p className="text-center text-sm">
        Tu correo no está verificado. Por favor, revisa tu bandeja de entrada o
        <Button
          onClick={resendVerification}
          disabled={isSending}
          variant="link"
        >
          reenvía el correo de verificación.
        </Button>
      </p>
    </div>
  );
}
