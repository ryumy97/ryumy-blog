"use client";

import { Button } from "@/components/ui/button";
import { Sandpack } from "@codesandbox/sandpack-react";
import { aquaBlue, atomDark } from "@codesandbox/sandpack-themes";
import beautify from "js-beautify";
import { Code, Eye } from "lucide-react";
import { useTheme } from "next-themes";
import { useMemo, useState } from "react";

// File type definitions
export interface CodeFile {
  type: "html" | "css" | "js" | "ts" | "jsx" | "tsx" | "json" | "md" | "txt";
  path: string;
  content: string;
}

// Helper function to create file objects
export const createFile = (
  type: CodeFile["type"],
  path: string,
  content: string
): CodeFile => ({
  type,
  path,
  content,
});

// Helper function to create common file combinations
export const createFiles = {
  html: (content: string, path = "/index.html") =>
    createFile("html", path, content),
  css: (content: string, path = "/styles.css") =>
    createFile("css", path, content),
  js: (content: string, path = "/index.js") => createFile("js", path, content),
  ts: (content: string, path = "/index.ts") => createFile("ts", path, content),
  jsx: (content: string, path = "/App.jsx") => createFile("jsx", path, content),
  tsx: (content: string, path = "/App.tsx") => createFile("tsx", path, content),
  json: (content: string, path = "/package.json") =>
    createFile("json", path, content),
};

// Formatting functions using js-beautify
const formatCode = (code: string, type: CodeFile["type"]): string => {
  if (!code.trim()) {
    switch (type) {
      case "html":
        return "<!-- No HTML code -->";
      case "css":
        return "/* No CSS code */";
      case "js":
      case "ts":
      case "jsx":
      case "tsx":
        return "// No JavaScript/TypeScript code";
      case "json":
        return "{}";
      case "md":
        return "<!-- No Markdown content -->";
      case "txt":
        return "No text content";
      default:
        return "// No code";
    }
  }

  try {
    switch (type) {
      case "html":
        return beautify.html(code, {
          indent_size: 2,
          indent_char: " ",
          max_preserve_newlines: 2,
          preserve_newlines: true,
          indent_scripts: "normal",
          end_with_newline: true,
          wrap_line_length: 0,
          indent_inner_html: false,
          indent_empty_lines: false,
        });

      case "css":
        return beautify.css(code, {
          indent_size: 2,
          indent_char: " ",
          selector_separator_newline: false,
          newline_between_rules: true,
          preserve_newlines: true,
          max_preserve_newlines: 2,
          end_with_newline: true,
          wrap_line_length: 0,
          indent_empty_lines: false,
        });

      case "js":
      case "ts":
      case "jsx":
      case "tsx":
        return beautify.js(code, {
          indent_size: 2,
          indent_char: " ",
          max_preserve_newlines: 2,
          preserve_newlines: true,
          keep_array_indentation: false,
          break_chained_methods: false,
          brace_style: "collapse",
          space_before_conditional: true,
          unescape_strings: false,
          jslint_happy: false,
          end_with_newline: true,
          wrap_line_length: 0,
          comma_first: false,
          e4x: false,
          indent_empty_lines: false,
        });

      case "json":
        return JSON.stringify(JSON.parse(code), null, 2);

      default:
        return code;
    }
  } catch (error) {
    console.error(`Error formatting ${type}:`, error);
    return code;
  }
};

interface CodeRunnerProps {
  files: CodeFile[];
  title?: string;
  height?: number;
  template?: "vanilla" | "react" | "vue" | "angular" | "svelte";
  dependencies?: Record<string, string>;
}

export default function CodeRunner({
  files,
  title = "Code Example",
  height = 400,
  template = "vanilla",
  dependencies = {},
}: CodeRunnerProps) {
  const [showCode, setShowCode] = useState(true);

  const theme = useTheme();

  // Format the code using custom formatting functions
  const formattedFiles = useMemo(() => {
    try {
      const result: Record<string, string> = {};

      files.forEach((file) => {
        const formattedContent = formatCode(file.content, file.type);
        result[file.path] = formattedContent;
      });

      return result;
    } catch (error) {
      console.error("Error formatting code:", error);
      // Fallback to unformatted code if formatting fails
      const result: Record<string, string> = {};
      files.forEach((file) => {
        result[file.path] = file.content || `// No ${file.type} code`;
      });
      return result;
    }
  }, [files]);

  return (
    <div className="my-8 border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-muted">
        <h4 className="text-lg font-semibold">{title}</h4>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCode(!showCode)}
            className="flex items-center gap-2"
          >
            {showCode ? (
              <>
                <Eye className="w-4 h-4" />
                Hide
              </>
            ) : (
              <>
                <Code className="w-4 h-4" />
                Show Code
              </>
            )}
          </Button>
        </div>
      </div>

      {showCode && (
        <div style={{ height: `${height}px` }}>
          <Sandpack
            template={template}
            files={formattedFiles}
            options={{
              showNavigator: false,
              showTabs: true,
              showLineNumbers: true,
              showInlineErrors: true,
              wrapContent: true,
              editorHeight: showCode ? height : 0,
              showConsoleButton: false,
              showConsole: false,
              rtl: true,
              resizablePanels: true,
            }}
            theme={theme.theme === "dark" ? atomDark : aquaBlue}
            customSetup={{
              dependencies,
            }}
          />
        </div>
      )}
    </div>
  );
}
