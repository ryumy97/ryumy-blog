import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Network,
  Clock,
  MousePointer,
  Sparkles,
} from "lucide-react";
import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import { TransitionIn } from "@/components/TransitionTunnel";

const categories = [
  {
    name: "Fundamentals",
    description: "점, 선, 면 등 기초적인 시각적 요소",
    icon: BarChart3,
    href: "/category/fundamentals",
    color: "bg-primary",
  },
  {
    name: "Structures",
    description: "네트워크, 계층, 분포 등 구조적 표현",
    icon: Network,
    href: "/category/structures",
    color: "bg-secondary",
  },
  {
    name: "Context",
    description: "시간, 공간, 흐름 등 맥락적 표현",
    icon: Clock,
    href: "/category/context",
    color: "bg-accent",
  },
  {
    name: "Interaction",
    description: "사용자 상호작용을 통한 데이터 탐색",
    icon: MousePointer,
    href: "/category/interaction",
    color: "bg-muted",
  },
  {
    name: "Beyond",
    description: "혁신적이고 창의적인 데이터 표현",
    icon: Sparkles,
    href: "/category/beyond",
    color: "bg-primary",
  },
];

export default function Home() {
  const posts = getAllPosts();
  const featuredPosts = posts.slice(0, 3);

  return (
    <TransitionIn>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            데이터 표현 100가지 방법
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            프론트엔드 개발자를 위한 데이터 시각화 예제와 인사이트를 공유하는
            블로그입니다. 점, 선, 면 등 기초적인 시각적 요소에서 출발하여 구조,
            맥락, 상호작용까지 다룹니다.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group block p-6 bg-card text-card-foreground rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-border"
            >
              <div className="flex items-center mb-4">
                <div
                  className={`p-3 rounded-lg ${category.color} text-primary-foreground mr-4`}
                >
                  <category.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
              </div>
              <p className="text-muted-foreground mb-4">
                {category.description}
              </p>
              <div className="flex items-center text-primary group-hover:text-primary/80">
                <span className="text-sm font-medium">자세히 보기</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Featured Posts */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">최근 포스트</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.length > 0 ? (
              featuredPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg">
                  아직 포스트가 없습니다.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-accent rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">시작해보세요</h3>
          <p className="text-muted-foreground mb-6">
            데이터 시각화의 세계를 탐험하고 새로운 인사이트를 발견하세요.
          </p>
          <Link
            href="/posts"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            모든 포스트 보기
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </TransitionIn>
  );
}
