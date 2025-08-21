import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow .mdx extensions for files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Optionally, add any other Next.js config below
  experimental: {
    mdxRs: true,
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
  },
});

// Combine MDX and Next.js config
export default withMDX(nextConfig);
