"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Loader2, Pin, Layers } from "lucide-react";
import UserMediaLoadingSkeleton from "@/components/posts/MediaLoadingSkeleton";
import Image from "next/image";
import Link from "next/link";

interface UserMediaProps {
  userId: string;
}

interface PinnedPost {
  post: { id: string; attachments: { url: string; type?: string }[] };
}

export default function UserMedia({ userId }: UserMediaProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "user-posts", userId],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/users/${userId}/posts`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const { data: pinnedPosts, isLoading: isPinnedLoading } = useQuery<
    PinnedPost[]
  >({
    queryKey: ["pinned-posts", userId],
    queryFn: async () => {
      return kyInstance.get(`/api/users/${userId}/pins`).json();
    },
  });

  if (status === "pending" || isPinnedLoading) {
    return <UserMediaLoadingSkeleton />;
  }

  const postsWithMedia =
    data?.pages
      .flatMap((page) => page.posts)
      .filter((post) => post.attachments.length > 0) || [];

  const pinnedPostIds = pinnedPosts?.map((pin) => pin.post.id) || [];

  const combinedMediaAttachments = [
    ...postsWithMedia.filter((post) => pinnedPostIds.includes(post.id)),
    ...postsWithMedia.filter((post) => !pinnedPostIds.includes(post.id)),
  ];

  if (
    status === "success" &&
    combinedMediaAttachments.length === 0 &&
    !hasNextPage
  ) {
    return (
      <p className="text-center text-muted-foreground">
        Este usuario no ha compartido contenido multimedia aún.
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      className="grid grid-cols-3 gap-2"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {combinedMediaAttachments.map((post) => {
        const firstAttachment = post.attachments[0];
        const hasMultipleAttachments = post.attachments.length > 1;
        const isPinned = pinnedPostIds.includes(post.id);

        return (
          <Link key={post.id} href={`/posts/${post.id}`}>
            <div className="relative aspect-square w-full overflow-hidden rounded-sm">
              {firstAttachment.type === "IMAGE" ? (
                <Image
                  src={firstAttachment.url}
                  alt="Media preview"
                  fill
                  className="object-cover"
                />
              ) : firstAttachment.type === "VIDEO" ? (
                <video
                  src={firstAttachment.url}
                  className="absolute inset-0 h-full w-full object-cover"
                  controls={false}
                  muted
                  autoPlay
                  loop
                />
              ) : null}

              {isPinned && (
                <div className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-black">
                  <Pin className="size-4" />
                </div>
              )}

              {hasMultipleAttachments && (
                <div className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-black">
                  <Layers className="size-4" />
                </div>
              )}
            </div>
          </Link>
        );
      })}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}
