import { notFound } from "next/navigation";
import { getPostsByCategory } from "@/lib/posts";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PostCard from "@/components/PostCard";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

const categoryNames = {
  fundamentals: "Fundamentals",
  structures: "Structures",
  context: "Context",
  interaction: "Interaction",
  beyond: "Beyond",
};

const categoryDescriptions = {
  fundamentals: "점, 선, 면 등 기초적인 시각적 요소",
  structures: "네트워크, 계층, 분포 등 구조적 표현",
  context: "시간, 공간, 흐름 등 맥락적 표현",
  interaction: "사용자 상호작용을 통한 데이터 탐색",
  beyond: "혁신적이고 창의적인 데이터 표현",
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  if (!categoryNames[category as keyof typeof categoryNames]) {
    notFound();
  }

  const posts = getPostsByCategory(category);
  const categoryName = categoryNames[category as keyof typeof categoryNames];
  const categoryDescription =
    categoryDescriptions[category as keyof typeof categoryDescriptions];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center text-primary hover:text-primary/80 mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        홈으로 돌아가기
      </Link>

      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{categoryName}</h1>
        <p className="text-xl text-muted-foreground mb-4">
          {categoryDescription}
        </p>
        <p className="text-muted-foreground">총 {posts.length}개의 포스트</p>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            이 카테고리에 아직 포스트가 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}
