"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Post } from "@/lib/posts";

interface PostNavigationProps {
  nextPost: Post | null;
  previousPost: Post | null;
}

export default function PostNavigation({
  nextPost,
  previousPost,
}: PostNavigationProps) {
  if (!nextPost && !previousPost) {
    return null;
  }

  return (
    <nav className="flex items-center justify-between border-t border-border pt-8 mt-12">
      {/* Previous Post */}
      <div className="flex-1">
        {previousPost ? (
          <Link
            href={`/posts/${previousPost.slug}`}
            className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wide">이전 글</span>
              <span className="font-medium line-clamp-2">
                {previousPost.title}
              </span>
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground/24">
            <ChevronLeft className="w-4 h-4" />
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wide">이전 글</span>
              <span className="font-medium">첫 번째 글</span>
            </div>
          </div>
        )}
      </div>

      {/* Next Post */}
      <div className="flex-1 text-right">
        {nextPost ? (
          <Link
            href={`/posts/${nextPost.slug}`}
            className="group flex items-center justify-end gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <div className="flex flex-col items-end">
              <span className="text-xs uppercase tracking-wide">다음 글</span>
              <span className="font-medium line-clamp-2">{nextPost.title}</span>
            </div>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground/24">
            <div className="flex flex-col items-end">
              <span className="text-xs uppercase tracking-wide">다음 글</span>
              <span className="font-medium">끝!</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </div>
        )}
      </div>
    </nav>
  );
}
