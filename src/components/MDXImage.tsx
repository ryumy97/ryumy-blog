"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface MDXImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
}

export default function MDXImage({
  src,
  alt,
  title,
  className = "",
}: MDXImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  return (
    <span className="relative inline-flex flex-col items-center justify-center w-full my-8">
      <span
        className="max-w-full relative"
        style={{
          width: width * 2,
          aspectRatio: width / height || 1,
        }}
      >
        <Image
          src={src}
          alt={alt}
          className={cn(
            "object-contain object-center",
            "transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={(e) => {
            setIsLoading(false);
            setWidth((e.target as HTMLImageElement).naturalWidth || 0);
            setHeight((e.target as HTMLImageElement).naturalHeight || 0);
          }}
          onError={() => setIsLoading(false)}
          fill
        />
      </span>
      {title && (
        <span className="mt-3 text-center text-sm text-muted-foreground">
          {title}
        </span>
      )}
    </span>
  );
}
