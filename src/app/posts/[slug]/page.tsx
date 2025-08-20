import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { Calendar, Tag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/posts"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          모든 포스트로 돌아가기
        </Link>

        {/* Post Header */}
        <article className="mb-8">
          <header className="mb-8">
            <div className="flex items-center mb-4">
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
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

            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              {post.description}
            </p>

            <div className="flex items-center text-sm text-gray-500 mb-6">
              <div className="flex items-center mr-6">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(post.date).toLocaleDateString("ko-KR")}
              </div>
              {post.tags.length > 0 && (
                <div className="flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  <div className="flex gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {post.image && (
              <div className="w-full h-64 md:h-96 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-8">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </header>

          {/* Post Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <MDXRemote source={post.content} />
          </div>

          {/* CodeSandbox/CodePen Embed */}
          {(post.codesandbox || post.codepen) && (
            <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">실행 가능한 예제</h3>
              {post.codesandbox && (
                <iframe
                  src={`https://codesandbox.io/embed/${post.codesandbox}`}
                  style={{
                    width: "100%",
                    height: "500px",
                    border: 0,
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                  title={post.title}
                  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                />
              )}
              {post.codepen && (
                <iframe
                  src={`https://codepen.io/embed/${post.codepen}`}
                  style={{
                    width: "100%",
                    height: "500px",
                    border: 0,
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                  title={post.title}
                />
              )}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
