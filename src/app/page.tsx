import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Network,
  Clock,
  MousePointer,
  Sparkles,
} from "lucide-react";

const categories = [
  {
    name: "Fundamentals",
    description: "점, 선, 면 등 기초적인 시각적 요소",
    icon: BarChart3,
    href: "/category/fundamentals",
    color: "bg-blue-500",
  },
  {
    name: "Structures",
    description: "네트워크, 계층, 분포 등 구조적 표현",
    icon: Network,
    href: "/category/structures",
    color: "bg-green-500",
  },
  {
    name: "Context",
    description: "시간, 공간, 흐름 등 맥락적 표현",
    icon: Clock,
    href: "/category/context",
    color: "bg-purple-500",
  },
  {
    name: "Interaction",
    description: "사용자 상호작용을 통한 데이터 탐색",
    icon: MousePointer,
    href: "/category/interaction",
    color: "bg-orange-500",
  },
  {
    name: "Beyond",
    description: "혁신적이고 창의적인 데이터 표현",
    icon: Sparkles,
    href: "/category/beyond",
    color: "bg-pink-500",
  },
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          데이터 표현 100가지 방법
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
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
            className="group block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center mb-4">
              <div
                className={`p-3 rounded-lg ${category.color} text-white mr-4`}
              >
                <category.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {category.description}
            </p>
            <div className="flex items-center text-blue-600 group-hover:text-blue-700">
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
          {/* Placeholder for featured posts */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">포스트 제목</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              포스트 설명이 여기에 들어갑니다...
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">카테고리</span>
              <span className="text-xs text-gray-500">2024.01.01</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-8">
        <h3 className="text-2xl font-bold mb-4">시작해보세요</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          데이터 시각화의 세계를 탐험하고 새로운 인사이트를 발견하세요.
        </p>
        <Link
          href="/posts"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          모든 포스트 보기
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
}
