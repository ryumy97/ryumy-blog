import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateKorean } from "@/lib/utils";

interface PostCardProps {
  post: {
    slug: string;
    title: string;
    description: string;
    date: string;
    category: string;
    tags: string[];
    image?: string;
  };
}

const categoryColors = {
  fundamentals: "bg-primary/10 text-primary border-primary/20",
  structures: "bg-secondary/10 text-secondary border-secondary/20",
  context: "bg-accent/10 text-accent-foreground border-accent/20",
  interaction: "bg-muted/10 text-muted-foreground border-muted/20",
  beyond: "bg-primary/10 text-primary border-primary/20",
};

export default function PostCard({ post }: PostCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <Link href={`/posts/${post.slug}`}>
        {post.image && (
          <div className="w-full h-48 bg-muted relative overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className={
                categoryColors[post.category as keyof typeof categoryColors]
              }
            >
              {post.category}
            </Badge>
          </div>
          <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {post.description}
          </p>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDateKorean(post.date)}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="group-hover:text-primary"
            >
              <span className="text-sm font-medium">자세히 보기</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
