"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavStore } from "@/store/nav-store";
import Link from "next/link";
import { useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const { setHeaderHeight } = useNavStore();

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeaderHeight(entry.borderBoxSize[0].blockSize);
      }
    });

    resizeObserver.observe(header);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <header className="border-b border-border bg-background fixed left-0 right-0 top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center space-x-6 w-full">
            <div className="grow">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold text-primary">
                  Ryumy Blog
                </span>
              </Link>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <nav className="hidden md:flex justify-end items-center space-x-4">
              <Link href="/posts">
                <Button variant="ghost" size="sm">
                  모든 포스트
                </Button>
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
