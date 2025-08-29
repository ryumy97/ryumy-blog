"use client";

import { useState, useEffect } from "react";
import beautify from "js-beautify";
import {
  atomDark,
  dracula,
  githubLight,
  nightOwl,
  sandpackDark,
  aquaBlue,
  monokaiPro,
  cobalt2,
  cyberpunk,
  amethyst,
  ecoLight,
  gruvboxDark,
  gruvboxLight,
  neoCyan,
  freeCodeCampDark,
  levelUp,
} from "@codesandbox/sandpack-themes";
import { Copy, Check } from "lucide-react";

interface MDXCodeProps {
  children: string;
  className?: string;
  theme?:
    | "atomDark"
    | "dracula"
    | "githubLight"
    | "nightOwl"
    | "sandpackDark"
    | "aquaBlue"
    | "monokaiPro"
    | "cobalt2"
    | "cyberpunk"
    | "amethyst"
    | "ecoLight"
    | "gruvboxDark"
    | "gruvboxLight"
    | "neoCyan"
    | "freeCodeCampDark"
    | "levelUp";
}

const themes = {
  atomDark,
  dracula,
  githubLight,
  nightOwl,
  sandpackDark,
  aquaBlue,
  monokaiPro,
  cobalt2,
  cyberpunk,
  amethyst,
  ecoLight,
  gruvboxDark,
  gruvboxLight,
  neoCyan,
  freeCodeCampDark,
  levelUp,
};

export default function MDXCode({
  children,
  className = "",
  theme = "atomDark",
}: MDXCodeProps) {
  const [formattedCode, setFormattedCode] = useState(children);
  const [isFormatted, setIsFormatted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Determine language from className (e.g., "language-javascript")
  const language = className.replace("language-", "");

  useEffect(() => {
    if (!children || isFormatted) return;

    try {
      let formatted = children;

      // Format based on language
      switch (language) {
        case "html":
          formatted = beautify.html(children, {
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
          break;

        case "css":
          formatted = beautify.css(children, {
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
          break;

        case "javascript":
        case "js":
          formatted = beautify.js(children, {
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
          break;

        default:
          formatted = children;
      }

      setFormattedCode(formatted);
      setIsFormatted(true);
    } catch (error) {
      console.error("Error formatting code:", error);
      setFormattedCode(children);
    }
  }, [children, language, isFormatted]);

  // Get the selected theme
  const selectedTheme = themes[theme];
  const themeColors = selectedTheme.colors;
  const syntaxColors = selectedTheme.syntax;

  // Enhanced syntax highlighting with Sandpack theme colors
  const highlightSyntax = (code: string, lang: string) => {
    // Helper function to get color from syntax style
    const getColor = (style: string | { color?: string }) => {
      return typeof style === "string"
        ? style
        : style.color || themeColors.base;
    };

    // Helper function to escape HTML entities
    const escapeHtml = (text: string) => {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    };

    // Helper function to create highlighted span
    const createSpan = (text: string, color: string) => {
      return `<span style="color: ${color}">${escapeHtml(text)}</span>`;
    };

    // Track positions to avoid overlapping replacements
    const positions: Array<{
      start: number;
      end: number;
      replacement: string;
    }> = [];

    if (lang === "javascript" || lang === "js") {
      // Keywords
      const keywordRegex =
        /\b(const|let|var|function|return|if|else|for|while|class|import|export|default|from|as|try|catch|finally|throw|new|delete|typeof|instanceof|in|of|this|super|extends|static|async|await|yield|get|set)\b/g;
      let match;
      while ((match = keywordRegex.exec(code)) !== null) {
        positions.push({
          start: match.index,
          end: match.index + match[0].length,
          replacement: createSpan(match[0], getColor(syntaxColors.keyword)),
        });
      }

      // Built-in objects
      const builtinRegex =
        /\b(console|document|window|Math|Array|Object|String|Number|Boolean|Date|RegExp|Error|Promise|Map|Set|WeakMap|WeakSet|Symbol|Proxy|Reflect|JSON|parseInt|parseFloat|isNaN|isFinite|encodeURI|decodeURI|encodeURIComponent|decodeURIComponent|escape|unescape)\b/g;
      while ((match = builtinRegex.exec(code)) !== null) {
        positions.push({
          start: match.index,
          end: match.index + match[0].length,
          replacement: createSpan(match[0], getColor(syntaxColors.static)),
        });
      }

      // Properties
      const propertyRegex =
        /\b(\.log|\.warn|\.error|\.info|\.debug|\.getElementById|\.querySelector|\.querySelectorAll|\.addEventListener|\.removeEventListener|\.setAttribute|\.getAttribute|\.classList|\.style|\.innerHTML|\.textContent|\.value|\.focus|\.blur|\.click|\.submit|\.preventDefault|\.stopPropagation)\b/g;
      while ((match = propertyRegex.exec(code)) !== null) {
        positions.push({
          start: match.index,
          end: match.index + match[0].length,
          replacement: createSpan(match[0], getColor(syntaxColors.property)),
        });
      }

      // Numbers
      const numberRegex = /\b(\d+(?:\.\d+)?)\b/g;
      while ((match = numberRegex.exec(code)) !== null) {
        positions.push({
          start: match.index,
          end: match.index + match[0].length,
          replacement: createSpan(match[0], getColor(syntaxColors.plain)),
        });
      }

      // Comments (single line)
      const singleLineCommentRegex = /(\/\/.*$)/gm;
      while ((match = singleLineCommentRegex.exec(code)) !== null) {
        positions.push({
          start: match.index,
          end: match.index + match[0].length,
          replacement: createSpan(match[0], getColor(syntaxColors.comment)),
        });
      }

      // Comments (multi-line)
      const multiLineCommentRegex = /(\/\*[\s\S]*?\*\/)/g;
      while ((match = multiLineCommentRegex.exec(code)) !== null) {
        positions.push({
          start: match.index,
          end: match.index + match[0].length,
          replacement: createSpan(match[0], getColor(syntaxColors.comment)),
        });
      }

      // Strings
      const stringRegex = /(["'`])([^"'`]*?)\1/g;
      while ((match = stringRegex.exec(code)) !== null) {
        const fullMatch = match[0];
        const quote = match[1];
        const content = match[2];
        positions.push({
          start: match.index,
          end: match.index + fullMatch.length,
          replacement: `${quote}${createSpan(content, getColor(syntaxColors.string || syntaxColors.plain))}${quote}`,
        });
      }

      // Punctuation
      const punctuationRegex = /([{}()[\].,;:])/g;
      while ((match = punctuationRegex.exec(code)) !== null) {
        positions.push({
          start: match.index,
          end: match.index + match[0].length,
          replacement: createSpan(match[0], getColor(syntaxColors.punctuation)),
        });
      }

      // Operators
      const operatorRegex = /([+\-*/%=<>!&|^~?:])/g;
      while ((match = operatorRegex.exec(code)) !== null) {
        positions.push({
          start: match.index,
          end: match.index + match[0].length,
          replacement: createSpan(match[0], getColor(syntaxColors.definition)),
        });
      }
    }

    if (lang === "typescript" || lang === "ts") {
      // TypeScript keywords
      const tsKeywordRegex =
        /\b(const|let|var|function|return|if|else|for|while|class|import|export|default|from|as|try|catch|finally|throw|new|delete|typeof|instanceof|in|of|this|super|extends|static|async|await|yield|get|set|interface|type|enum|namespace|module|declare|implements|abstract|public|private|protected|readonly|override|abstract|constructor|super)\b/g;
      let tsMatch;
      while ((tsMatch = tsKeywordRegex.exec(code)) !== null) {
        positions.push({
          start: tsMatch.index,
          end: tsMatch.index + tsMatch[0].length,
          replacement: createSpan(tsMatch[0], getColor(syntaxColors.keyword)),
        });
      }

      // Add other TypeScript-specific patterns...
      // (reuse the same patterns as JavaScript for now)
    }

    if (lang === "css") {
      // CSS properties
      const propertyRegex = /([a-zA-Z-]+)(?=\s*:)/g;
      let cssMatch;
      while ((cssMatch = propertyRegex.exec(code)) !== null) {
        positions.push({
          start: cssMatch.index,
          end: cssMatch.index + cssMatch[0].length,
          replacement: createSpan(cssMatch[0], getColor(syntaxColors.property)),
        });
      }

      // CSS values
      const valueRegex = /(:)([^;]*?)(;)/g;
      while ((cssMatch = valueRegex.exec(code)) !== null) {
        const colon = cssMatch[1];
        const value = cssMatch[2];
        const semicolon = cssMatch[3];
        positions.push({
          start: cssMatch.index + colon.length,
          end: cssMatch.index + colon.length + value.length,
          replacement: createSpan(
            value,
            getColor(syntaxColors.string || syntaxColors.plain)
          ),
        });
      }

      // CSS braces
      const braceRegex = /(\{|\})/g;
      while ((cssMatch = braceRegex.exec(code)) !== null) {
        positions.push({
          start: cssMatch.index,
          end: cssMatch.index + cssMatch[0].length,
          replacement: createSpan(
            cssMatch[0],
            getColor(syntaxColors.punctuation)
          ),
        });
      }

      // CSS comments
      const commentRegex = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
      while ((cssMatch = commentRegex.exec(code)) !== null) {
        positions.push({
          start: cssMatch.index,
          end: cssMatch.index + cssMatch[0].length,
          replacement: createSpan(cssMatch[0], getColor(syntaxColors.comment)),
        });
      }
    }

    if (lang === "html") {
      // HTML tags
      const tagRegex = /(&lt;\/?)([a-zA-Z][a-zA-Z0-9]*)([^&]*?)(&gt;)/g;
      let htmlMatch;
      while ((htmlMatch = tagRegex.exec(code)) !== null) {
        const openBracket = htmlMatch[1];
        const tagName = htmlMatch[2];
        const attributes = htmlMatch[3];
        const closeBracket = htmlMatch[4];
        positions.push({
          start: htmlMatch.index + openBracket.length,
          end: htmlMatch.index + openBracket.length + tagName.length,
          replacement: createSpan(tagName, getColor(syntaxColors.tag)),
        });
      }

      // HTML attributes
      const attrRegex = /([a-zA-Z-]+)=/g;
      while ((htmlMatch = attrRegex.exec(code)) !== null) {
        positions.push({
          start: htmlMatch.index,
          end: htmlMatch.index + htmlMatch[0].length - 1, // -1 to exclude the = sign
          replacement: createSpan(
            htmlMatch[1],
            getColor(syntaxColors.property)
          ),
        });
      }

      // HTML comments
      const commentRegex = /(&lt;!--)([^&]*?)(--&gt;)/g;
      while ((htmlMatch = commentRegex.exec(code)) !== null) {
        positions.push({
          start: htmlMatch.index,
          end: htmlMatch.index + htmlMatch[0].length,
          replacement: createSpan(htmlMatch[0], getColor(syntaxColors.comment)),
        });
      }
    }

    // Sort positions by start index in descending order to avoid offset issues
    positions.sort((a, b) => b.start - a.start);

    // Apply replacements from end to start
    let result = code;
    for (const pos of positions) {
      result =
        result.slice(0, pos.start) + pos.replacement + result.slice(pos.end);
    }

    return result;
  };

  const highlightedCode = highlightSyntax(formattedCode, language);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="relative group">
      <code
        className={`block px-2 py-1 rounded text-sm font-mono ${className}`}
        style={{
          backgroundColor: themeColors.surface1,
          color: themeColors.base,
          border: `1px solid ${themeColors.surface2}`,
          borderRadius: "6px",
          padding: "8px 12px",
          fontSize: "14px",
          lineHeight: "1.5",
          fontFamily:
            'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
          overflow: "auto",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          backgroundColor: themeColors.surface2,
          color: themeColors.base,
          border: `1px solid ${themeColors.surface3}`,
        }}
        title="Copy code"
      >
        {copied ? (
          <Check size={16} style={{ color: themeColors.accent }} />
        ) : (
          <Copy size={16} />
        )}
      </button>
    </div>
  );
}
