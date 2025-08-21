import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { Calendar, Tag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatDateKorean } from "@/lib/utils";
import { MDXRemote } from "next-mdx-remote/rsc";
import CodeSandbox from "@/components/CodeSandbox";
import { TransitionIn } from "@/components/TransitionTunnel";

interface PostPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => {
    const [category, slug] = post.slug.split("/");
    return {
      category,
      slug,
    };
  });
}

export default async function PostPage({ params }: PostPageProps) {
  const { category, slug } = await params;
  const fullSlug = `${category}/${slug}`;
  const post = getPostBySlug(fullSlug);

  if (!post) {
    notFound();
  }

  const components = {
    CodeSandbox,
  };

  const categoryColors = {
    fundamentals: "bg-primary/10 text-primary border-primary/20",
    structures: "bg-secondary/10 text-secondary border-secondary/20",
    context: "bg-accent/10 text-accent-foreground border-accent/20",
    interaction: "bg-muted/10 text-muted-foreground border-muted/20",
    beyond: "bg-primary/10 text-primary border-primary/20",
  };

  return (
    <TransitionIn>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href="/posts"
            className="inline-flex items-center text-primary hover:text-primary/80 mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            모든 포스트로 돌아가기
          </Link>

          {/* Post Header */}
          <article className="mb-8">
            <header className="mb-8">
              <div className="flex items-center mb-4">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full border ${
                    categoryColors[post.category as keyof typeof categoryColors]
                  }`}
                >
                  {post.category}
                </span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">
                {post.description}
              </p>

              <div className="flex items-center text-sm text-muted-foreground mb-6">
                <div className="flex items-center mr-6">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDateKorean(post.date)}
                </div>
                {post.tags.length > 0 && (
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 mr-2" />
                    <div className="flex gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-muted rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {post.image && (
                <div className="w-full h-64 md:h-96 bg-muted rounded-lg overflow-hidden mb-8">
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
              <MDXRemote source={post.content} components={components} />
            </div>

            {/* CodeSandbox/CodePen Embed */}
            {(post.codesandbox || post.codepen) && (
              <div className="mt-12 p-6 bg-accent rounded-lg">
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
    </TransitionIn>
  );
}
