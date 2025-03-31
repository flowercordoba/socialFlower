"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { PostData } from "@/lib/types";
import { cn, formatRelativeDate } from "@/lib/utils";
import { Media } from "@prisma/client";
import { MessageSquare, Layers } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Comments from "../comments/Comments";
import Linkify from "../Linkify";
import UserAvatar from "../UserAvatar";
import UserTooltip from "../UserTooltip";
import BookmarkButton from "./BookmarkButton";
import LikeButton from "./LikeButton";
import PostMoreButton from "./PostMoreButton";
import MediaDialog from "./MediaDialog";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const { user } = useSession();
  const [showComments, setShowComments] = useState(false);
  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  return (
    <>
      <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
        <div className="flex justify-between gap-3">
          <div className="flex flex-wrap gap-3">
            <UserTooltip user={post.user}>
              <Link href={`/users/${post.user.username}`}>
                <UserAvatar avatarUrl={post.user.avatarUrl} />
              </Link>
            </UserTooltip>
            <div>
              <UserTooltip user={post.user}>
                <Link
                  href={`/users/${post.user.username}`}
                  className="block font-medium hover:underline"
                >
                  {post.user.displayName}
                </Link>
              </UserTooltip>
              <Link
                href={`/posts/${post.id}`}
                className="block text-sm text-muted-foreground hover:underline"
                suppressHydrationWarning
              >
                {formatRelativeDate(post.createdAt)}
              </Link>
            </div>
          </div>
          {post.user.id === user.id && (
            <PostMoreButton
              post={post}
              className="opacity-0 transition-opacity group-hover/post:opacity-100"
            />
          )}
        </div>
        <Linkify>
          <div className="whitespace-pre-line break-words">{post.content}</div>
        </Linkify>
        {!!post.attachments.length && (
          <MediaPreviews
            attachments={post.attachments}
            onSelect={(index) => {
              setSelectedMediaIndex(index);
              setOpenMediaDialog(true);
            }}
          />
        )}
        <hr className="text-muted-foreground" />
        <div className="flex justify-between gap-5">
          <div className="flex items-center gap-5">
            <LikeButton
              postId={post.id}
              initialState={{
                likes: post._count.likes,
                isLikedByUser: post.likes.some(
                  (like) => like.userId === user.id,
                ),
              }}
            />
            <CommentButton
              post={post}
              onClick={() => setShowComments(!showComments)}
            />
          </div>
          <BookmarkButton
            postId={post.id}
            initialState={{
              isBookmarkedByUser: post.bookmarks.some(
                (bookmark) => bookmark.userId === user.id,
              ),
            }}
          />
        </div>
        {showComments && <Comments post={post} />}
      </article>
      {openMediaDialog && (
        <MediaDialog
          post={post}
          open={openMediaDialog}
          onClose={() => setOpenMediaDialog(false)}
          initialIndex={selectedMediaIndex}
        />
      )}
    </>
  );
}

interface MediaPreviewsProps {
  attachments: Media[];
}

interface MediaPreviewsProps {
  attachments: Media[];
  onSelect: (index: number) => void;
}

function MediaPreviews({ attachments, onSelect }: MediaPreviewsProps) {
  const count = attachments.length;

  if (count === 1) {
    return (
      <div
        className="aspect-square w-full cursor-pointer overflow-hidden rounded-xl bg-muted"
        onClick={() => onSelect(0)}
      >
        <MediaPreview media={attachments[0]} />
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {attachments.map((m, idx) => (
          <div
            key={m.id}
            className="aspect-square cursor-pointer overflow-hidden rounded-xl bg-muted"
            onClick={() => onSelect(idx)}
          >
            <MediaPreview media={m} />
          </div>
        ))}
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="grid gap-2">
        <div
          className="aspect-video cursor-pointer overflow-hidden rounded-xl bg-muted"
          onClick={() => onSelect(0)}
        >
          <MediaPreview media={attachments[0]} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {attachments.slice(1).map((m, idx) => (
            <div
              key={m.id}
              className="aspect-square cursor-pointer overflow-hidden rounded-xl bg-muted"
              onClick={() => onSelect(idx + 1)}
            >
              <MediaPreview media={m} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (count === 4) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {attachments.map((m, idx) => (
          <div
            key={m.id}
            className="aspect-square cursor-pointer overflow-hidden rounded-xl bg-muted"
            onClick={() => onSelect(idx)}
          >
            <MediaPreview media={m} />
          </div>
        ))}
      </div>
    );
  }

  if (count === 5) {
    return (
      <div className="grid gap-2">
        <div className="grid grid-cols-2 gap-2">
          {attachments.slice(0, 2).map((m, idx) => (
            <div
              key={m.id}
              className="aspect-square cursor-pointer overflow-hidden rounded-xl bg-muted"
              onClick={() => onSelect(idx)}
            >
              <MediaPreview media={m} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {attachments.slice(2, 5).map((m, idx) => (
            <div
              key={m.id}
              className="aspect-square cursor-pointer overflow-hidden rounded-xl bg-muted"
              onClick={() => onSelect(idx + 2)}
            >
              <MediaPreview media={m} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

interface MediaPreviewProps {
  media: Media;
}

function MediaPreview({ media }: MediaPreviewProps) {
  return (
    <div className="relative h-full w-full">
      {media.type === "IMAGE" ? (
        <Image src={media.url} alt="Attachment" fill className="object-cover" />
      ) : media.type === "VIDEO" ? (
        <video
          src={media.url}
          className="absolute inset-0 h-full w-full object-cover"
          controls
        />
      ) : (
        <p className="text-destructive">Tipo no soportado</p>
      )}
    </div>
  );
}

interface CommentButtonProps {
  post: PostData;
  onClick: () => void;
}

function CommentButton({ post, onClick }: CommentButtonProps) {
  return (
    <button onClick={onClick} className="flex items-center gap-2">
      <MessageSquare className="size-5" />
      <span className="text-sm font-medium tabular-nums">
        {post._count.comments}{" "}
        <span className="hidden sm:inline">comments</span>
      </span>
    </button>
  );
}
