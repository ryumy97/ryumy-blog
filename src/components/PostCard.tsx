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
  fundamentals: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  structures:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  context:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  interaction:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  beyond: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
};

export default function PostCard({ post }: PostCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <Link href={`/posts/${post.slug}`}>
        {post.image && (
          <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
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
              variant="secondary"
              className={
                categoryColors[post.category as keyof typeof categoryColors]
              }
            >
              {post.category}
            </Badge>
          </div>
          <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
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
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDateKorean(post.date)}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="group-hover:text-blue-600"
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
