import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                데이터 표현 100가지
              </span>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <nav className="hidden md:flex items-center space-x-4">
              <Link href="/posts">
                <Button variant="ghost" size="sm">
                  모든 포스트
                </Button>
              </Link>
              <Link href="/category/fundamentals">
                <Button variant="ghost" size="sm">
                  기본 요소
                </Button>
              </Link>
              <Link href="/category/structures">
                <Button variant="ghost" size="sm">
                  구조
                </Button>
              </Link>
              <Link href="/category/context">
                <Button variant="ghost" size="sm">
                  맥락
                </Button>
              </Link>
              <Link href="/category/interaction">
                <Button variant="ghost" size="sm">
                  상호작용
                </Button>
              </Link>
              <Link href="/category/beyond">
                <Button variant="ghost" size="sm">
                  혁신
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
