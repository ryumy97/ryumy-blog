"use client";

import { Button } from "@/components/ui/button";
import { Sandpack } from "@codesandbox/sandpack-react";
import { aquaBlue, atomDark } from "@codesandbox/sandpack-themes";
import beautify from "js-beautify";
import { Code, Eye } from "lucide-react";
import { useTheme } from "next-themes";
import { useMemo, useState } from "react";

// Formatting functions using js-beautify
const formatHtml = (code: string): string => {
  if (!code.trim()) return "<!-- No HTML code -->";

  try {
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
  } catch (error) {
    console.error("Error formatting HTML:", error);
    return code;
  }
};

const formatCss = (code: string): string => {
  if (!code.trim()) return "/* No CSS code */";

  try {
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
  } catch (error) {
    console.error("Error formatting CSS:", error);
    return code;
  }
};

const formatJs = (code: string): string => {
  if (!code.trim()) return "// No JavaScript code";

  try {
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
  } catch (error) {
    console.error("Error formatting JavaScript:", error);
    return code;
  }
};

interface CodeRunnerProps {
  html?: string;
  css?: string;
  js?: string;
  title?: string;
  height?: number;
}

export default function CodeRunner({
  html = "",
  css = "",
  js = "",
  title = "Code Example",
  height = 400,
}: CodeRunnerProps) {
  const [showCode, setShowCode] = useState(true);

  const theme = useTheme();

  // Format the code using custom formatting functions
  const formattedFiles = useMemo(() => {
    try {
      const formattedHtml = formatHtml(html);
      const formattedCss = formatCss(css);
      const formattedJs = formatJs(js);

      return {
        "/index.html": formattedHtml,
        "/styles.css": formattedCss,
        "/index.js": formattedJs,
      };
    } catch (error) {
      console.error("Error formatting code:", error);
      // Fallback to unformatted code if formatting fails
      return {
        "/index.html": html || "<!-- No HTML code -->",
        "/styles.css": css || "/* No CSS code */",
        "/index.js": js || "// No JavaScript code",
      };
    }
  }, [html, css, js]);

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
            template="vanilla"
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
              dependencies: {},
            }}
          />
        </div>
      )}
    </div>
  );
}
