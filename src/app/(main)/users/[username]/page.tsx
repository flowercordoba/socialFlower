import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import FollowerCount from "@/components/FollowerCount";
import Linkify from "@/components/Linkify";
import TrendsSidebar from "@/components/TrendsSidebar";
import UserAvatar from "@/components/UserAvatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import prisma from "@/lib/prisma";
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cache } from "react";
import EditProfileButton from "./EditProfileButton";
import UserPosts from "./UserPosts";
import UserMedia from "./UserMedia";
import coverPlaceholder from "@/assets/cover-placeholder.png";
import {
  BadgeCheck,
  Home,
  MapPin,
  Heart,
  Link as LinkIcon,
  School,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import SpaceIllustration from "@/assets/space.svg";

interface PageProps {
  params: { username: string };
}

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) notFound();

  return user;
});

export async function generateMetadata({
  params: { username },
}: PageProps): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);

  return { title: `${user.displayName} (@${user.username})` };
}

export default async function Page({ params: { username } }: PageProps) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return (
      <p className="text-destructive">No estas autorizado a ver esta pagina.</p>
    );
  }

  const user = await getUser(username, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <Tabs defaultValue="posts">
            <div className="no-scrollbar overflow-x-auto">
              <TabsList className="min-w-max">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="multimedia">Multimedia</TabsTrigger>
                <TabsTrigger value="about">Acerca de mí</TabsTrigger>
                <TabsTrigger value="stories">Historias</TabsTrigger>
                <TabsTrigger value="pets">Mascotas</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="posts">
              <UserPosts userId={user.id} />
            </TabsContent>
            <TabsContent value="multimedia">
              <UserMedia userId={user.id} />
            </TabsContent>
            <TabsContent value="about">
              <div className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
                <Image
                  src={SpaceIllustration}
                  alt="Coming soon illustration"
                  className="w-48 sm:w-56 md:w-64"
                  priority
                />
                <div>
                  <h2 className="text-lg font-semibold">Próximamente</h2>
                  <p className="text-muted-foreground">
                    Esta sección estará disponible muy pronto. ¡Gracias por tu
                    paciencia!
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="stories">
              <div className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
                <Image
                  src={SpaceIllustration}
                  alt="Coming soon illustration"
                  className="w-48 sm:w-56 md:w-64"
                  priority
                />
                <div>
                  <h2 className="text-lg font-semibold">Próximamente</h2>
                  <p className="text-muted-foreground">
                    Esta sección estará disponible muy pronto. ¡Gracias por tu
                    paciencia!
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="pets">
              <div className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
                <Image
                  src={SpaceIllustration}
                  alt="Coming soon illustration"
                  className="w-48 sm:w-56 md:w-64"
                  priority
                />
                <div>
                  <h2 className="text-lg font-semibold">Próximamente</h2>
                  <p className="text-muted-foreground">
                    Esta sección estará disponible muy pronto. ¡Gracias por tu
                    paciencia!
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <TrendsSidebar />
    </main>
  );
}

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }: { followerId: string }) => followerId === loggedInUserId,
    ),
  };

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <Image
        src={user.coverUrl || coverPlaceholder}
        alt="Cover"
        width={800}
        height={200}
        className="h-52 w-full rounded-sm object-cover"
      />
      <div className="relative flex justify-start">
        <UserAvatar
          avatarUrl={user.avatarUrl}
          size={140}
          className="-mt-28 ml-6 border-4 border-background"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{user.displayName}</h1>
              {(user.id === loggedInUserId || user.verified) && (
                <BadgeCheck
                  className={
                    user.verified
                      ? "fill-primary text-white dark:text-primary-foreground"
                      : "fill-gray-400 text-white dark:text-gray-400/50"
                  }
                  size={24}
                />
              )}
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={`ver-${i}`}
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-secondary dark:border-gray-500"
                  ></div>
                ))}
              </div>
            </div>
            <div className="text-muted-foreground">@{user.username}</div>
          </div>
        </div>
        <div className="mt-3 sm:mt-0">
          {user.id === loggedInUserId ? (
            <EditProfileButton user={user} />
          ) : (
            <FollowButton userId={user.id} initialState={followerInfo} />
          )}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Miembro desde {formatDate(user.createdAt, "MMM d, yyyy")}
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <span>
            Publicaciones:{" "}
            <span className="font-semibold">
              {formatNumber(user._count.posts)}
            </span>
          </span>
          <Link
            href={`/users/${user.username}/followers`}
            className="hover:underline"
          >
            <FollowerCount userId={user.id} initialState={followerInfo} />
          </Link>
        </div>

        {(user.residenceCity ||
          user.birthCity ||
          user.maritalStatus ||
          user.studyPlace ||
          user.workPlace ||
          (user.customLinkText && user.customLinkUrl)) && (
          <div className="grid gap-y-3 md:grid-cols-2">
            {user.residenceCity && (
              <div className="flex items-center gap-2 text-foreground">
                <Home size={16} />
                <span>Vive en {user.residenceCity}</span>
              </div>
            )}
            {user.birthCity && (
              <div className="flex items-center gap-2 text-foreground">
                <MapPin size={16} />
                <span>De {user.birthCity}</span>
              </div>
            )}
            {user.maritalStatus && (
              <div className="flex items-center gap-2 text-foreground">
                <Heart size={16} />
                <span>{user.maritalStatus}</span>
              </div>
            )}
            {user.studyPlace && (
              <div className="flex items-center gap-2 text-foreground">
                <School size={16} />
                <span>Estudia en {user.studyPlace}</span>
              </div>
            )}
            {user.workPlace && (
              <div className="flex items-center gap-2 text-foreground">
                <Briefcase size={16} />
                <span>Trabaja en {user.workPlace}</span>
              </div>
            )}
            {user.customLinkText && user.customLinkUrl && (
              <div className="flex items-center gap-2 text-foreground">
                <LinkIcon size={16} />
                <a
                  href={user.customLinkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  {user.customLinkText}
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      <hr />
      <div className="flex justify-center gap-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={`badge-${i}`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-secondary dark:border-gray-500"
          ></div>
        ))}
      </div>
    </div>
  );
}
