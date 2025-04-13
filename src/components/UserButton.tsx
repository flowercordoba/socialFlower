"use client";

import { logout } from "@/app/(auth)/actions";
import { useSession } from "@/app/(main)/SessionProvider";
import { cn } from "@/lib/utils";
import {
  Check,
  LogOutIcon,
  Monitor,
  Moon,
  Sun,
  UserIcon,
  MessageSquare,
  Layers,
  Users,
  Globe,
  Briefcase,
  MessageCircle,
  History,
  TrendingUp,
  Settings,
  Box,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import { Button } from "./ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";

export default function UserButton({ className }: { className?: string }) {
  const { user } = useSession();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const menuItems = [
    { label: "Chat público", icon: MessageSquare },
    { label: "Perfiles", icon: Layers },
    { label: "Amigos", icon: Users },
    { label: "Portales", icon: Globe },
    { label: "Negocios", icon: Briefcase },
    { label: "Foros", icon: MessageCircle },
    { label: "Historial", icon: History },
    { label: "Widget 1", icon: TrendingUp },
    { label: "Widget 2", icon: Settings },
    { label: "Widget 3", icon: Box },
  ];

  return (
    <>
      <div className="hidden sm:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={cn("rounded-full", className)}>
              <UserAvatar avatarUrl={user.avatarUrl} size={40} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              Iniciaste sesión como @{user.username}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href={`/users/${user.username}`}>
              <DropdownMenuItem>
                <UserIcon className="mr-2 size-4" />
                Perfil
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Monitor className="mr-2 size-4" />
                Tema
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="mr-2 size-4" />
                    Predeterminado
                    {theme === "system" && <Check className="ms-2 size-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 size-4" />
                    Claro
                    {theme === "light" && <Check className="ms-2 size-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 size-4" />
                    Oscuro
                    {theme === "dark" && <Check className="ms-2 size-4" />}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout();
              }}
            >
              <LogOutIcon className="mr-2 size-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="block sm:hidden">
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button className={cn("rounded-full", className)}>
              <UserAvatar avatarUrl={user.avatarUrl} size={40} />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
            <Dialog.Content className="fixed right-0 top-0 z-50 flex h-full w-64 flex-col justify-between bg-card p-5 shadow-lg focus:outline-none">
              <div>
                <div className="flex items-start justify-between">
                  <div className="ml-5 flex flex-col items-start gap-1">
                    <UserAvatar avatarUrl={user.avatarUrl} size={40} />
                    <span className="text-lg font-semibold text-foreground">
                      {user.displayName}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                      @{user.username}
                    </span>
                  </div>
                  <button onClick={() => setOpen(false)}>
                    <X />
                  </button>
                </div>

                <div className="mt-4 flex flex-col space-y-2">
                  {menuItems.map((item, i) => (
                    <Link
                      key={i}
                      href="/coming-soon"
                      onClick={() => setOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className="flex w-full items-center justify-start gap-3"
                      >
                        <item.icon />
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex w-full items-center justify-start gap-3"
                    >
                      <Monitor />
                      Tema
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      <Monitor className="mr-2 size-4" />
                      Predeterminado
                      {theme === "system" && (
                        <Check className="ms-auto size-4" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      <Sun className="mr-2 size-4" />
                      Claro
                      {theme === "light" && (
                        <Check className="ms-auto size-4" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      <Moon className="mr-2 size-4" />
                      Oscuro
                      {theme === "dark" && <Check className="ms-auto size-4" />}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-start gap-3 text-destructive"
                  onClick={() => logout()}
                >
                  <LogOutIcon />
                  Cerrar sesión
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </>
  );
}
