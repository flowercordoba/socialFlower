import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import UserAvatar from "@/components/UserAvatar";
import UserTooltip from "@/components/UserTooltip";
import FollowButton from "@/components/FollowButton";
import TrendsSidebar from "@/components/TrendsSidebar";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { BadgeCheck } from "lucide-react";
import Linkify from "@/components/Linkify";
import Link from "next/link";
import { UserData } from "@/lib/types";

interface PageProps {
  params: { username: string };
}

export const metadata: Metadata = { title: "Seguidores" };

export default async function UserFollowersPage({
  params: { username },
}: PageProps) {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) redirect("/login");

  const targetUser = await prisma.user.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
    select: getUserDataSelect(loggedInUser.id),
  });
  if (!targetUser) redirect("/not-found");

  const followers = (await prisma.follow.findMany({
    where: { followingId: targetUser.id },
    include: { follower: { select: getUserDataSelect(loggedInUser.id) } },
  })) as { follower: UserData }[];

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">
            Seguidores de @{targetUser.displayName}
          </h1>
        </div>
        {followers.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Este usuario no tiene seguidores aún.
          </p>
        ) : (
          <div className="space-y-4">
            {followers.map(({ follower }) => (
              <div
                key={follower.id}
                className="rounded-md bg-card p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <UserTooltip user={follower}>
                    <Link
                      href={`/users/${follower.username}`}
                      className="flex items-center gap-3"
                    >
                      <UserAvatar avatarUrl={follower.avatarUrl} size={48} />
                      <div>
                        <p className="flex items-center gap-1 break-all font-semibold hover:underline">
                          {follower.displayName}
                          {follower.verified && (
                            <BadgeCheck
                              size={20}
                              className="fill-primary text-white dark:text-primary-foreground"
                            />
                          )}
                        </p>
                        <p className="break-all text-muted-foreground">
                          @{follower.username}
                        </p>
                      </div>
                    </Link>
                  </UserTooltip>
                  <div className="ml-auto">
                    {follower.id !== loggedInUser.id && (
                      <FollowButton
                        userId={follower.id}
                        initialState={{
                          followers: follower._count.followers,
                          isFollowedByUser: follower.followers.length > 0,
                        }}
                      />
                    )}
                  </div>
                </div>
                {follower.bio && (
                  <div className="mt-2 pl-[calc(48px+0.75rem)]">
                    <Linkify>
                      <p className="line-clamp-2 break-all text-sm text-muted-foreground">
                        {follower.bio}
                      </p>
                    </Linkify>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <TrendsSidebar />
    </main>
  );
}
