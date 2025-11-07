import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PageLink {
  title: string;
  href: string;
  description: string;
}

const pages: PageLink[] = [
  {
    title: "Edge node graph",
    href: "/edge-node",
    description: "Visualize a graph with edges and nodes",
  },
  {
    title: "Shortest path algorithms",
    href: "/shortest-path",
    description: "Find the shortest path between two nodes in a graph",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-sans">
      <main className="flex min-h-screen w-full max-w-4xl flex-col gap-8 py-16 px-4 sm:px-8 md:px-16">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Pages
          </h1>
          <p className="text-lg text-muted-foreground">
            Browse all available pages
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <Link key={page.href} href={page.href}>
              <Card className="transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="text-lg">{page.title}</CardTitle>
                  <CardDescription>{page.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    {page.href}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {pages.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No pages available yet. Add pages to the pages array in page.tsx
                to see them listed here.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
