import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { Calendar, Tag, ArrowRight } from "lucide-react";

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">모든 포스트</h1>
        <p className="text-gray-600 dark:text-gray-300">
          데이터 시각화의 모든 방법들을 탐험해보세요
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="group block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {post.image && (
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center mb-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    post.category === "fundamentals"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : post.category === "structures"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : post.category === "context"
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                      : post.category === "interaction"
                      ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                      : "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
                  }`}
                >
                  {post.category}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                {post.description}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(post.date).toLocaleDateString("ko-KR")}
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">아직 포스트가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
