import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { Calendar, Tag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatDateKorean } from "@/lib/utils";
import { MDXRemote } from "next-mdx-remote/rsc";
import CodeRunner from "@/components/CodeRunner";
import MDXImage from "@/components/MDXImage";
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
    CodeRunner,
    MDXImage,
    img: MDXImage,
    Image: MDXImage,
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
        name: "데이터를 표현하는 100가지 방법",
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
            <div className="max-w-none [&>h1]:text-4xl [&>h1]:font-bold [&>h1]:mb-8 [&>h1]:mt-12 [&>h2]:text-3xl [&>h2]:font-semibold [&>h2]:mb-6 [&>h2]:mt-10 [&>h3]:text-2xl [&>h3]:font-semibold [&>h3]:mb-4 [&>h3]:mt-8 [&>h4]:text-xl [&>h4]:font-semibold [&>h4]:mb-3 [&>h4]:mt-6 [&>p]:text-base [&>p]:leading-7 [&>p]:mb-6 [&>p]:text-muted-foreground [&>strong]:text-foreground [&>strong]:font-semibold [&>code]:text-sm [&>code]:bg-muted [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>pre]:bg-muted [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-muted-foreground [&>ul]:my-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:my-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>li]:my-2 [&>hr]:my-8 [&>hr]:border-border">
              <MDXRemote source={post.content} components={components} />
            </div>
          </article>
        </div>
      </div>
    </TransitionIn>
  );
}
