import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface PostMetadata {
  title: string;
  description: string;
  date: string;
  category: string | string[];
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

const postsDirectory = path.join(process.cwd(), "src", "content");

export function getPostSlugs(): string[] {
  const slugs: string[] = [];

  // Recursive function to find all MDX files in nested directories
  function findMdxFiles(dir: string, currentPath: string = ""): void {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    items.forEach((item) => {
      const fullPath = path.join(dir, item.name);
      const relativePath = currentPath
        ? `${currentPath}/${item.name}`
        : item.name;

      if (item.isDirectory()) {
        // Recursively search subdirectories
        findMdxFiles(fullPath, relativePath);
      } else if (item.isFile() && item.name.endsWith(".mdx")) {
        // Add MDX file to slugs
        const slug = relativePath.replace(/\.mdx$/, "");
        slugs.push(slug);
      }
    });
  }

  // Start searching from the posts directory
  findMdxFiles(postsDirectory);

  return slugs;
}

export function getPostBySlug(slug: string): Post | null {
  try {
    // Handle both old and new path structures
    let fullPath = path.join(postsDirectory, `${slug}.mdx`);

    // If the file doesn't exist at the direct path, try the data-visualization subdirectory
    if (!fs.existsSync(fullPath)) {
      const parts = slug.split("/");
      if (parts.length >= 2) {
        // Try data-visualization subdirectory structure
        const subcategory = parts[0];
        const postSlug = parts[1];
        const alternativePath = path.join(
          postsDirectory,
          "data-visualization",
          subcategory,
          `${postSlug}.mdx`
        );

        if (fs.existsSync(alternativePath)) {
          fullPath = alternativePath;
        }
      }
    }

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

// Function to get posts with hierarchical slugs for the new structure
export function getPostsWithHierarchicalSlugs(): Post[] {
  const posts = getAllPosts();

  return posts.map((post) => {
    // If the post belongs to data-visualization category, create hierarchical slug
    const categories = Array.isArray(post.category)
      ? post.category
      : [post.category];
    if (categories.includes("data-visualization")) {
      const parts = post.slug.split("/");
      if (parts.length >= 2) {
        return {
          ...post,
          slug: `data-visualization/${post.slug}`,
        };
      }
    }
    return post;
  });
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((post) => {
    if (Array.isArray(post.category)) {
      return post.category.includes(category);
    }
    return post.category === category;
  });
}

export function getFeaturedPosts(): Post[] {
  return getAllPosts().filter((post) => post.featured);
}

export function getCategories() {
  const posts = getAllPosts();
  const categories = posts.reduce((acc, post) => {
    const postCategories = Array.isArray(post.category)
      ? post.category
      : [post.category];

    postCategories.forEach((cat) => {
      if (!acc[cat]) {
        acc[cat] = 0;
      }
      acc[cat]++;
    });

    return acc;
  }, {} as Record<string, number>);

  return categories;
}

// Function to get all MDX files for static generation
export function getAllMdxFiles() {
  const mdxFiles: string[] = [];

  // Recursive function to find all MDX files in nested directories
  function findMdxFiles(dir: string, currentPath: string = ""): void {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    items.forEach((item) => {
      const fullPath = path.join(dir, item.name);
      const relativePath = currentPath
        ? `${currentPath}/${item.name}`
        : item.name;

      if (item.isDirectory()) {
        // Recursively search subdirectories
        findMdxFiles(fullPath, relativePath);
      } else if (item.isFile() && item.name.endsWith(".mdx")) {
        // Add MDX file to mdxFiles
        mdxFiles.push(relativePath);
      }
    });
  }

  // Start searching from the posts directory
  findMdxFiles(postsDirectory);

  return mdxFiles;
}
