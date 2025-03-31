import { PostData } from "@/lib/types";
import { MoreHorizontal, Trash2, Pin } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import DeletePostDialog from "./DeletePostDialog";

interface PostMoreButtonProps {
  post: PostData;
  className?: string;
}

export default function PostMoreButton({
  post,
  className,
}: PostMoreButtonProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isPinLoading, setIsPinLoading] = useState(false);

  useEffect(() => {
    async function fetchPinStatus() {
      try {
        const res = await fetch(`/api/posts/${post.id}/pin`);
        const data = await res.json();
        setIsPinned(data.isPinnedByUser);
      } catch (error) {
        console.error(error);
      }
    }
    fetchPinStatus();
  }, [post.id]);

  async function togglePin() {
    setIsPinLoading(true);
    try {
      if (isPinned) {
        const res = await fetch(`/api/posts/${post.id}/pin`, {
          method: "DELETE",
        });
        if (res.ok) setIsPinned(false);
      } else {
        const res = await fetch(`/api/posts/${post.id}/pin`, {
          method: "POST",
        });
        if (res.ok) setIsPinned(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsPinLoading(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className={className}>
            <MoreHorizontal className="size-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={togglePin} disabled={isPinLoading}>
            <span className="flex items-center gap-3">
              <Pin className="size-4" />
              {isPinned ? "Desfijar en el perfil" : "Fijar en el perfil"}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
            <span className="flex items-center gap-3 text-destructive">
              <Trash2 className="size-4" />
              Borrar
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeletePostDialog
        post={post}
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
    </>
  );
}
