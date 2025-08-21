import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface PostMetadata {
  title: string;
  description: string;
  date: string;
  category:
    | "fundamentals"
    | "structures"
    | "context"
    | "interaction"
    | "beyond";
  tags: string[];
  image?: string;
  codesandbox?: string;
  codepen?: string;
  featured?: boolean;
  order?: number;
}

export interface Post extends PostMetadata {
  slug: string;
  content: string;
}

const postsDirectory = path.join(process.cwd(), "content");

export function getPostSlugs(): string[] {
  const categoryDirs = [
    "fundamentals",
    "structures",
    "context",
    "interaction",
    "beyond",
  ];
  const slugs: string[] = [];

  categoryDirs.forEach((category) => {
    const categoryPath = path.join(postsDirectory, category);
    if (fs.existsSync(categoryPath)) {
      const files = fs.readdirSync(categoryPath);
      files.forEach((file) => {
        if (file.endsWith(".mdx")) {
          slugs.push(`${category}/${file.replace(/\.mdx$/, "")}`);
        }
      });
    }
  });

  return slugs;
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      content,
      ...(data as PostMetadata),
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null)
    .sort((post1, post2) => {
      const order1 = post1.order || 0;
      const order2 = post2.order || 0;
      if (order1 !== order2) return order1 - order2;
      return new Date(post2.date).getTime() - new Date(post1.date).getTime();
    });

  return posts;
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getFeaturedPosts(): Post[] {
  return getAllPosts().filter((post) => post.featured);
}

export function getCategories() {
  const posts = getAllPosts();
  const categories = posts.reduce((acc, post) => {
    if (!acc[post.category]) {
      acc[post.category] = 0;
    }
    acc[post.category]++;
    return acc;
  }, {} as Record<string, number>);

  return categories;
}

// Function to get all MDX files for static generation
export function getAllMdxFiles() {
  const categoryDirs = [
    "fundamentals",
    "structures",
    "context",
    "interaction",
    "beyond",
  ];
  const mdxFiles: string[] = [];

  categoryDirs.forEach((category) => {
    const categoryPath = path.join(postsDirectory, category);
    if (fs.existsSync(categoryPath)) {
      const files = fs.readdirSync(categoryPath);
      files.forEach((file) => {
        if (file.endsWith(".mdx")) {
          mdxFiles.push(path.join(category, file));
        }
      });
    }
  });

  return mdxFiles;
}
