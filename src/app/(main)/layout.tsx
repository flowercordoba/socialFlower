import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import MenuBar from "./MenuBar";
import LeftMenu from "./LeftMenu";
import Navbar from "./Navbar";
import SessionProvider from "./SessionProvider";
import VerificationBanner from "@/components/VerificationBanner";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) redirect("/login");

  return (
    <SessionProvider value={session}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        {!session.user.verified && (
          <VerificationBanner userId={session.user.id} />
        )}
        <div className="mx-auto flex w-full max-w-[1408px] grow gap-5 p-5">
          <LeftMenu className="sticky top-[5.25rem] hidden h-fit flex-none space-y-3 rounded-2xl bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-72" />
          {children}
        </div>
        <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden" />
      </div>
    </SessionProvider>
  );
}
