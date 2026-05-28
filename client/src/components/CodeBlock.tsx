"use client";

import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  language: string;
  code: string;
}

export default function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState<string>("");

  useEffect(() => {
    const highlightCode = async () => {
      try {
        const { default: hljs } = await import("highlight.js");
        const lang = hljs.getLanguage(language) ? language : "plaintext";
        const highlighted = hljs.highlight(code, { language: lang }).value;
        setHighlightedCode(highlighted);
      } catch (error) {
        setHighlightedCode(code);
      }
    };
    highlightCode();
  }, [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  return (
    <div className="relative bg-[#1e1e1e] rounded-lg overflow-hidden shadow-lg my-4 border border-gray-700 group">
      <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-gray-700">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs px-3 py-1.5 rounded transition-all duration-200 hover:shadow-md"
        >
          {copied ? (
            <>
              <Check size={14} className="text-green-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy
            </>
          )}
        </button>
      </div>

      <pre className="px-4 py-4 text-sm bg-[#1e1e1e] text-gray-100 overflow-x-auto max-h-96 font-mono leading-relaxed">
        {highlightedCode ? (
          <code
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
            style={{
              background: "transparent",
            }}
          />
        ) : (
          <code>{code}</code>
        )}
      </pre>
    </div>
  );
}
