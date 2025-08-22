import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { Calendar, Tag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatDateKorean } from "@/lib/utils";
import { MDXRemote } from "next-mdx-remote/rsc";
import CodeSandbox from "@/components/CodeSandbox";
import { TransitionIn } from "@/components/TransitionTunnel";
import { getCategoryById } from "@/lib/categories";

interface PostPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts
    .filter((post) => {
      // Include posts that have hierarchical slugs (contain "/")
      return post.slug.includes("/");
    })
    .map((post) => {
      const parts = post.slug.split("/");
      return {
        slug: parts,
      };
    });
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const fullSlug = slug.join("/");
  const post = getPostBySlug(fullSlug);

  if (!post) {
    notFound();
  }

  const components = {
    CodeSandbox,
  };

  // Determine the main category and subcategory from the slug
  const mainCategory = slug[0];
  const subcategory = slug[1];

  // Check if the second part is actually a subcategory or just a post slug
  // If it's a known category, treat it as subcategory, otherwise it's just a post slug
  const isSubcategory = subcategory && getCategoryById(subcategory);

  // Get category data for styling
  const categoryData = getCategoryById(
    isSubcategory ? subcategory : mainCategory
  );
  const categoryColor = categoryData?.color || "bg-muted";

  const categoryBadgeStyle =
    {
      "bg-primary": "bg-primary/10 text-primary border-primary/20",
      "bg-secondary": "bg-secondary/10 text-secondary border-secondary/20",
      "bg-accent": "bg-accent/10 text-accent-foreground border-accent/20",
      "bg-muted": "bg-muted/10 text-muted-foreground border-muted/20",
    }[categoryColor] || "bg-muted/10 text-muted-foreground border-muted/20";

  // Generate breadcrumb items
  const generateBreadcrumbs = () => {
    const breadcrumbs = [{ name: "홈", href: "/" }];

    // Add main category if it's data-visualization
    if (mainCategory === "data-visualization") {
      breadcrumbs.push({
        name: "데이터 표현 100가지 방법",
        href: "/category/data-visualization",
      });
    }

    // Add subcategory only if it's actually a known category
    if (isSubcategory) {
      breadcrumbs.push({
        name: categoryData?.name || subcategory,
        href: `/category/${subcategory}`,
      });
    }

    // Add current post
    breadcrumbs.push({
      name: post.title,
      href: "#",
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <TransitionIn>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && <span className="mx-2">/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-foreground">{crumb.name}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-foreground">
                    {crumb.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Post Header */}
          <article className="mb-8">
            <header className="mb-8">
              <div className="flex items-center mb-4">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full border ${categoryBadgeStyle}`}
                >
                  {categoryData?.name || subcategory || mainCategory}
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
          </article>
        </div>
      </div>
    </TransitionIn>
  );
}
