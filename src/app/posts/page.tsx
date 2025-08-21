import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";

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
          <PostCard key={post.slug} post={post} />
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
