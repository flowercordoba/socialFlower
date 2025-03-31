"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PostData } from "@/lib/types";
import LikeButton from "./LikeButton";
import BookmarkButton from "./BookmarkButton";
import Comments from "../comments/Comments";
import UserAvatar from "../UserAvatar";
import { formatRelativeDate } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";

interface MediaDialogProps {
  post: PostData;
  open: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export default function MediaDialog({
  post,
  open,
  onClose,
  initialIndex = 0,
}: MediaDialogProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showComments, setShowComments] = useState(false);
  const attachments = post.attachments;
  const attachment = attachments[currentIndex];

  const prevAttachment = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const nextAttachment = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, attachments.length - 1));
  };

  function CommentButton({ onClick }: { onClick: () => void }) {
    return (
      <button onClick={onClick} className="flex items-center gap-2">
        <MessageSquare className="size-5" />
        <span className="text-sm font-medium tabular-nums">
          {post._count.comments}{" "}
        </span>
      </button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="h-full max-w-7xl border-none p-0">
        <div className="flex h-full w-full flex-col sm:flex-row">
          {/* Panel Multimedia */}
          <div className="relative flex h-full w-full items-center justify-center rounded-none bg-black/70 sm:w-2/3">
            {attachment && attachment.type === "IMAGE" ? (
              <Image
                src={attachment.url}
                alt="Media"
                fill
                className="object-contain"
              />
            ) : attachment && attachment.type === "VIDEO" ? (
              <video
                src={attachment.url}
                className="absolute inset-0 h-full w-full object-contain"
                controls
                autoPlay
              />
            ) : null}
            {attachments.length > 1 && (
              <>
                {currentIndex > 0 && (
                  <button
                    onClick={prevAttachment}
                    className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white"
                  >
                    <ChevronLeft size={24} />
                  </button>
                )}
                {currentIndex < attachments.length - 1 && (
                  <button
                    onClick={nextAttachment}
                    className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white"
                  >
                    <ChevronRight size={24} />
                  </button>
                )}
              </>
            )}
          </div>
          <div className="hidden flex-col space-y-4 overflow-y-auto bg-card p-4 sm:flex sm:w-1/3">
            <div className="mb-4 flex items-center gap-3">
              <UserAvatar avatarUrl={post.user.avatarUrl} />
              <div>
                <p className="font-bold">{post.user.displayName}</p>
                <p className="text-sm text-muted-foreground">
                  @{post.user.username} · {formatRelativeDate(post.createdAt)}
                </p>
              </div>
            </div>
            <div className="mb-4">
              <p>{post.content}</p>
            </div>
            <hr className="my-2 border-border" />
            <div className="flex items-center gap-4">
              <LikeButton
                postId={post.id}
                initialState={{
                  likes: post._count.likes,
                  isLikedByUser: post.likes.some(
                    (like) => like.userId === post.user.id,
                  ),
                }}
              />
              <BookmarkButton
                postId={post.id}
                initialState={{
                  isBookmarkedByUser: post.bookmarks.some(
                    (bookmark) => bookmark.userId === post.user.id,
                  ),
                }}
              />
            </div>
            <hr className="my-2 border-border" />
            <div className="flex-1">
              <Comments post={post} />
            </div>
          </div>
          <div className="flex w-full flex-col sm:hidden">
            <div className="flex w-full items-center justify-around bg-card p-4">
              <LikeButton
                postId={post.id}
                initialState={{
                  likes: post._count.likes,
                  isLikedByUser: post.likes.some(
                    (like) => like.userId === post.user.id,
                  ),
                }}
              />
              <CommentButton onClick={() => setShowComments((prev) => !prev)} />
              <BookmarkButton
                postId={post.id}
                initialState={{
                  isBookmarkedByUser: post.bookmarks.some(
                    (bookmark) => bookmark.userId === post.user.id,
                  ),
                }}
              />
            </div>
            {showComments && (
              <div className="w-full bg-card p-4">
                <Comments post={post} />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
