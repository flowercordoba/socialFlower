import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import NotificationsButton from "./NotificationsButton";
import MessagesButton from "./MessagesButton";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import Link from "next/link";

export default async function Navbar() {
  const { user } = await validateRequest();
  if (!user) return null;

  const [unreadNotificationsCount, unreadMessagesCount] = await Promise.all([
    prisma.notification.count({ where: { recipientId: user.id, read: false } }),
    (await streamServerClient.getUnreadCount(user.id)).total_unread_count,
  ]);

  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-3">
        <Link href="/" className="text-2xl font-bold text-primary">
          Yebaam
        </Link>

        <div className="max-w-md flex-grow">
          <SearchField />
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center sm:flex">
            <NotificationsButton
              initialState={{ unreadCount: unreadNotificationsCount }}
              iconOnly
            />
            <MessagesButton
              initialState={{ unreadCount: unreadMessagesCount }}
              iconOnly
            />
          </div>

          <UserButton />
        </div>
      </div>
    </header>
  );
}
