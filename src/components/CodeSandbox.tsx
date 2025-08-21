"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, ExternalLink } from "lucide-react";

interface CodeSandboxProps {
  id: string;
  title?: string;
  height?: number;
  width?: string;
}

export default function CodeSandbox({
  id,
  title = "CodeSandbox Example",
  height = 500,
  width = "100%",
}: CodeSandboxProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const sandboxUrl = `https://codesandbox.io/embed/${id}`;

  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-foreground">{title}</h4>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLoaded(!isLoaded)}
          >
            <Play className="w-4 h-4 mr-2" />
            {isLoaded ? "Hide" : "Show"} Example
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a
              href={`https://codesandbox.io/p/sandbox/${id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in CodeSandbox
            </a>
          </Button>
        </div>
      </div>

      {isLoaded && (
        <div className="border border-border rounded-lg overflow-hidden">
          <iframe
            src={sandboxUrl}
            style={{
              width,
              height: `${height}px`,
              border: 0,
              borderRadius: "4px",
              overflow: "hidden",
            }}
            title={title}
            allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            onLoad={() => setIsLoaded(true)}
          />
        </div>
      )}
    </div>
  );
}
