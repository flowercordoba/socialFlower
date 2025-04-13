import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import SpaceIllustration from "@/assets/space.svg";

export const metadata: Metadata = {
  title: "Próximamente",
  description: "Esta funcionalidad estará disponible próximamente.",
};

export default function ComingSoonPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
        <Image
          src={SpaceIllustration}
          alt="Coming soon illustration"
          className="w-48 sm:w-56 md:w-64"
          priority
        />
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground">¡Próximamente!</h1>
          <p className="text-lg text-muted-foreground">
            Esta sección estará disponible muy pronto. ¡Gracias por tu
            paciencia!
          </p>
          <Button asChild>
            <a href="/">Ir al inicio</a>
          </Button>
        </div>
      </div>
    </main>
  );
}
