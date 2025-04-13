import { Button } from "@/components/ui/button";
import { Bookmark, History, TrendingUp, Settings, Box } from "lucide-react";
import MessagesButton from "./MessagesButton";
import Link from "next/link";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { validateRequest } from "@/auth";

export default async function RightMenu() {
  const { user } = await validateRequest();
  if (!user) return null;

  const [unreadMessagesCount] = await Promise.all([
    prisma.notification.count({ where: { recipientId: user.id, read: false } }),
    (await streamServerClient.getUnreadCount(user.id)).total_unread_count,
  ]);

  return (
    <aside className="flex-col space-y-3 rounded-2xl bg-card px-3 py-5 shadow-sm lg:px-5">
      <div>
        <MessagesButton initialState={{ unreadCount: unreadMessagesCount }} />
      </div>
      <div>
        <Button
          variant="ghost"
          className="flex items-center justify-start gap-3"
          title="Guardados"
          asChild
        >
          <Link href="/bookmarks">
            <Bookmark />
            <span className="hidden lg:inline">Guardados</span>
          </Link>
        </Button>
      </div>
      <div className="space-y-3">
        <Button
          variant="ghost"
          className="flex items-center justify-start gap-3"
          title="Historial"
          asChild
        >
          <Link href="/coming-soon">
            <History />
            <span className="hidden lg:inline">Historial</span>
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="flex items-center justify-start gap-3"
          title="Widget 1"
          asChild
        >
          <Link href="/coming-soon">
            <TrendingUp />
            <span className="hidden lg:inline">Widget 1</span>
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="flex items-center justify-start gap-3"
          title="Widget 2"
          asChild
        >
          <Link href="/coming-soon">
            <Settings />
            <span className="hidden lg:inline">Widget 2</span>
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="flex items-center justify-start gap-3"
          title="Widget 3"
          asChild
        >
          <Link href="/coming-soon">
            <Box />
            <span className="hidden lg:inline">Widget 3</span>
          </Link>
        </Button>
      </div>
    </aside>
  );
}
