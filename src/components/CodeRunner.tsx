"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, Copy, Check, Eye, Code } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

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
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(true);
  const [panelSizes, setPanelSizes] = useState([50, 50]);

  const dataRef = useRef<{
    html: string;
    css: string;
    js: string;
  }>({
    html,
    css,
    js,
  });

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [editableHtml, setEditableHtml] = useState(dataRef.current.html);
  const [editableCss, setEditableCss] = useState(dataRef.current.css);
  const [editableJs, setEditableJs] = useState(dataRef.current.js);

  useEffect(() => {
    dataRef.current.html = html;
    dataRef.current.css = css;
    dataRef.current.js = js;

    setEditableHtml(dataRef.current.html);
    setEditableCss(dataRef.current.css);
    setEditableJs(dataRef.current.js);

    console.log(dataRef.current.html);
    console.log(dataRef.current.css);
    console.log(dataRef.current.js);

    runCode();
  }, [html, css, js]);

  const runCode = () => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;

    if (!doc) return;

    // Clear previous content and scripts
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            ${dataRef.current.css}
          </style>
        </head>
        <body>
          ${dataRef.current.html}
          <script>
            // Clear any existing variables and functions
            if (typeof window !== 'undefined') {
              // Remove all properties from window except built-ins
              Object.keys(window).forEach(key => {
                if (!['console', 'document', 'window', 'location', 'history', 'navigator', 'screen', 'localStorage', 'sessionStorage'].includes(key)) {
                  try {
                    delete window[key];
                  } catch (e) {
                    // Ignore errors for non-configurable properties
                  }
                }
              });
            }
            
            // Wrap in try-catch to handle errors gracefully
            try {
              ${dataRef.current.js}
            } catch (error) {
              console.error('Code execution error:', error);
            }
          </script>
        </body>
      </html>
    `);
    doc.close();
  };

  const debouncedRunCode = () => {
    // Clear any existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout for 0.5 seconds (500ms)
    debounceTimeoutRef.current = setTimeout(() => {
      runCode();
    }, 500);
  };

  const handlePanelResize = (sizes: number[]) => {
    setPanelSizes(sizes);
    // Run code immediately after resize
    runCode();
  };

  const copyCode = async () => {
    const fullCode = `<!DOCTYPE html>
<html>
<head>
  <style>
${dataRef.current.css}
  </style>
</head>
<body>
${dataRef.current.html}
  <script>
${dataRef.current.js}
  </script>
</body>
</html>`;

    try {
      await navigator.clipboard.writeText(fullCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

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
          <Button
            variant="outline"
            size="sm"
            onClick={copyCode}
            className="flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Code
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Desktop Layout - 2 Column Resizable */}
      {showCode ? (
        <div className="hidden md:block">
          <ResizablePanelGroup
            direction="horizontal"
            className="min-h-[400px]"
            style={{ height: `${height}px` }}
            onLayout={handlePanelResize}
          >
            {/* Left Panel - Code Editor */}
            <ResizablePanel defaultSize={50} minSize={20} maxSize={80}>
              <div className="flex flex-col bg-muted/30 h-full overflow-auto">
                <div className="p-4 border-b border-border">
                  <h5 className="text-sm font-semibold mb-3 text-muted-foreground">
                    HTML
                  </h5>
                  <Textarea
                    value={editableHtml}
                    onChange={(e) => {
                      dataRef.current.html = e.target.value;
                      debouncedRunCode();
                      setEditableHtml(e.target.value);
                    }}
                    placeholder="Enter HTML code..."
                    className="font-mono text-sm min-h-[80px] resize-none"
                  />
                </div>

                <div className="p-4 border-b border-border">
                  <h5 className="text-sm font-semibold mb-3 text-muted-foreground">
                    CSS
                  </h5>
                  <Textarea
                    value={editableCss}
                    onChange={(e) => {
                      dataRef.current.css = e.target.value;
                      debouncedRunCode();
                      setEditableCss(e.target.value);
                    }}
                    placeholder="Enter CSS code..."
                    className="font-mono text-sm min-h-[80px] resize-none"
                  />
                </div>

                <div className="p-4 flex-1">
                  <h5 className="text-sm font-semibold mb-3 text-muted-foreground">
                    JavaScript
                  </h5>
                  <Textarea
                    value={editableJs}
                    onChange={(e) => {
                      dataRef.current.js = e.target.value;
                      debouncedRunCode();
                      setEditableJs(e.target.value);
                    }}
                    placeholder="Enter JavaScript code..."
                    className="font-mono text-sm h-full resize-none"
                  />
                </div>
              </div>
            </ResizablePanel>

            {/* Resizable Handle */}
            <ResizableHandle withHandle />

            {/* Right Panel - Preview */}
            <ResizablePanel defaultSize={50}>
              <div className="bg-background h-full">
                <iframe
                  ref={iframeRef}
                  title={title}
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    background: "white",
                  }}
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      ) : (
        /* Desktop Preview Only */
        <></>
      )}

      {/* Mobile Layout - Stacked */}
      {showCode ? (
        <div className="md:hidden">
          <div className="space-y-4 mb-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <h5 className="text-sm font-semibold mb-3 text-muted-foreground">
                HTML
              </h5>
              <Textarea
                value={editableHtml}
                onChange={(e) => {
                  dataRef.current.html = e.target.value;
                  debouncedRunCode();
                  setEditableHtml(e.target.value);
                }}
                placeholder="Enter HTML code..."
                className="font-mono text-sm min-h-[100px] resize-none"
              />
            </div>

            <div className="bg-muted/30 rounded-lg p-4">
              <h5 className="text-sm font-semibold mb-3 text-muted-foreground">
                CSS
              </h5>
              <Textarea
                value={editableCss}
                onChange={(e) => {
                  dataRef.current.css = e.target.value;
                  debouncedRunCode();
                  setEditableCss(e.target.value);
                }}
                placeholder="Enter CSS code..."
                className="font-mono text-sm min-h-[100px] resize-none"
              />
            </div>

            <div className="bg-muted/30 rounded-lg p-4">
              <h5 className="text-sm font-semibold mb-3 text-muted-foreground">
                JavaScript
              </h5>
              <Textarea
                value={editableJs}
                onChange={(e) => {
                  dataRef.current.js = e.target.value;
                  debouncedRunCode();
                  setEditableJs(e.target.value);
                }}
                placeholder="Enter JavaScript code..."
                className="font-mono text-sm min-h-[100px] resize-none"
              />
            </div>
          </div>

          {/* Mobile Preview */}
          <div
            className="bg-background rounded-lg border"
            style={{ height: `${height}px` }}
          >
            <iframe
              ref={iframeRef}
              title={title}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                background: "white",
                borderRadius: "0.5rem",
              }}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      ) : (
        /* Mobile Preview Only */
        <></>
      )}
    </div>
  );
}
