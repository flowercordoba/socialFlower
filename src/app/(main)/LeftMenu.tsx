import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Layers,
  Users,
  Globe,
  Briefcase,
  MessageCircle,
  Bookmark,
  History,
  TrendingUp,
  Settings,
  Box,
} from "lucide-react";
import Link from "next/link";
import MessagesButton from "./MessagesButton";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";

interface LeftMenuProps {
  className?: string;
}

export default async function LeftMenu({ className }: LeftMenuProps) {
  const { user } = await validateRequest();
  if (!user) return null;

  const [unreadMessagesCount] = await Promise.all([
    prisma.notification.count({ where: { recipientId: user.id, read: false } }),
    (await streamServerClient.getUnreadCount(user.id)).total_unread_count,
  ]);

  const mainMenuItems = [
    { label: "Chat público", icon: MessageSquare },
    { label: "Perfiles", icon: Layers },
    { label: "Amigos", icon: Users },
    { label: "Portales", icon: Globe },
    { label: "Negocios", icon: Briefcase },
    { label: "Foros", icon: MessageCircle },
  ];

  const rightMenuItems = [
    { label: "Historial", icon: History },
    { label: "Widget 1", icon: TrendingUp },
    { label: "Widget 2", icon: Settings },
    { label: "Widget 3", icon: Box },
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      {mainMenuItems.map((item, i) => (
        <Button
          key={i}
          variant="ghost"
          className="flex items-center justify-start gap-3"
          title={item.label}
          asChild
        >
          <Link href="/coming-soon">
            <item.icon />
            <span className="hidden lg:inline">{item.label}</span>
          </Link>
        </Button>
      ))}

      <div className="block lg:hidden">
        <MessagesButton initialState={{ unreadCount: unreadMessagesCount }} />

        <Button
          variant="ghost"
          className="mt-3 flex w-fit items-center justify-start gap-3"
          title="Guardados"
          asChild
        >
          <Link href="/bookmarks">
            <Bookmark />
            <span className="hidden lg:inline">Guardados</span>
          </Link>
        </Button>

        <div className="mt-3 space-y-3">
          {rightMenuItems.map((item, i) => (
            <Button
              key={`right-${i}`}
              variant="ghost"
              className="flex items-center justify-start gap-3"
              title={item.label}
              asChild
            >
              <Link href="/coming-soon">
                <item.icon />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
