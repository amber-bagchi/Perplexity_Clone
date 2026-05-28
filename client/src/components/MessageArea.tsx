"use client";

import React, { useEffect, useRef } from "react";
import { Message } from "../types";
import CodeBlock from "./CodeBlock";
import MessageActions from "./MessageActions";
import { ExternalLink, Search } from "lucide-react";

interface MessageAreaProps {
  messages: Message[];
}

export default function MessageArea({ messages }: MessageAreaProps) {
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const renderMessageContent = (content: string) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let keyCounter = 0;

    // Better regex to capture code blocks - handles various formats
    const codeRegex = /```([\w]*)\s*\n([\s\S]*?)\n```/g;

    let match;
    const codeMatches: Array<{ index: number; length: number; lang: string; code: string }> = [];

    // Find all code blocks
    while ((match = codeRegex.exec(content)) !== null) {
      codeMatches.push({
        index: match.index,
        length: match[0].length,
        lang: match[1]?.trim() || "plaintext",
        code: match[2],
      });
    }

    // Process content by code blocks first
    codeMatches.forEach((codeBlock) => {
      if (lastIndex < codeBlock.index) {
        const textBefore = content.slice(lastIndex, codeBlock.index);
        renderTextBlock(textBefore, parts, keyCounter);
        keyCounter += 10;
      }

      // Render code block
      parts.push(
        <CodeBlock
          key={`code-${keyCounter++}`}
          language={codeBlock.lang}
          code={codeBlock.code}
        />
      );

      lastIndex = codeBlock.index + codeBlock.length;
    });

    // Handle remaining text
    if (lastIndex < content.length) {
      const remainingText = content.slice(lastIndex);
      renderTextBlock(remainingText, parts, keyCounter);
    }

    return <div className="space-y-4">{parts}</div>;
  };

  const renderTextBlock = (text: string, parts: React.ReactNode[], startKeyCounter: number) => {
    const lines = text.split("\n");
    let keyCounter = startKeyCounter;

    lines.forEach((line) => {
      const trimmedLine = line.trim();

      // Handle headers
      const headerMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
      if (headerMatch) {
        const level = headerMatch[1].length;
        const headerText = headerMatch[2];
        const headingClasses = {
          1: "text-3xl font-bold mt-4 mb-2",
          2: "text-2xl font-bold mt-3 mb-2",
          3: "text-xl font-bold mt-2 mb-2",
          4: "text-lg font-bold mt-2 mb-2",
          5: "text-base font-bold mt-2 mb-2",
          6: "text-sm font-bold mt-2 mb-2",
        };

        parts.push(
          <div
            key={`header-${keyCounter++}`}
            className={`${headingClasses[level as keyof typeof headingClasses]} text-white`}
          >
            {headerText}
          </div>
        );
        return;
      }

      // Handle list items
      const listMatch = trimmedLine.match(/^[\*\-\+]\s+(.+)$/);
      if (listMatch) {
        parts.push(
          <div key={`list-${keyCounter++}`} className="ml-4 text-gray-200 flex gap-3">
            <span className="text-blue-400 flex-shrink-0">•</span>
            <span>{parseInlineMarkdown(listMatch[1])}</span>
          </div>
        );
        return;
      }

      // Handle numbered lists
      const numberedListMatch = trimmedLine.match(/^\d+\.\s+(.+)$/);
      if (numberedListMatch) {
        parts.push(
          <div key={`list-${keyCounter++}`} className="ml-4 text-gray-200 flex gap-3">
            <span className="text-blue-400 flex-shrink-0">◆</span>
            <span>{parseInlineMarkdown(numberedListMatch[1])}</span>
          </div>
        );
        return;
      }

      // Handle empty lines
      if (!trimmedLine) {
        parts.push(<div key={`space-${keyCounter++}`} className="h-2"></div>);
        return;
      }

      // Regular paragraph
      parts.push(
        <div
          key={`para-${keyCounter++}`}
          className="text-gray-200 leading-relaxed text-base"
        >
          {parseInlineMarkdown(line)}
        </div>
      );
    });
  };

  const parseInlineMarkdown = (text: string) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let keyCounter = 0;

    // Bold text
    const boldRegex = /\*\*(.*?)\*\*/g;
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    let match;
    const patterns: Array<{ start: number; end: number; type: string; content: string }> = [];

    while ((match = boldRegex.exec(text)) !== null) {
      patterns.push({
        start: match.index,
        end: match.index + match[0].length,
        type: "bold",
        content: match[1],
      });
    }

    patterns.sort((a, b) => a.start - b.start);

    patterns.forEach((pattern) => {
      if (lastIndex < pattern.start) {
        const textBefore = text.slice(lastIndex, pattern.start);
        const urlMatches = Array.from(textBefore.matchAll(urlRegex));

        if (urlMatches.length > 0) {
          let subLastIndex = 0;
          urlMatches.forEach((urlMatch) => {
            if (subLastIndex < urlMatch.index) {
              parts.push(
                <span key={`text-${keyCounter++}`}>
                  {textBefore.slice(subLastIndex, urlMatch.index)}
                </span>
              );
            }
            parts.push(
              <a
                key={`url-${keyCounter++}`}
                href={urlMatch[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
              >
                {urlMatch[0]}
              </a>
            );
            subLastIndex = urlMatch.index + urlMatch[0].length;
          });
          if (subLastIndex < textBefore.length) {
            parts.push(
              <span key={`text-${keyCounter++}`}>{textBefore.slice(subLastIndex)}</span>
            );
          }
        } else {
          parts.push(
            <span key={`text-${keyCounter++}`}>{textBefore}</span>
          );
        }
      }

      if (pattern.type === "bold") {
        parts.push(
          <strong key={`bold-${keyCounter++}`} className="font-bold text-white">
            {pattern.content}
          </strong>
        );
      }

      lastIndex = pattern.end;
    });

    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      const urlMatches = Array.from(remainingText.matchAll(urlRegex));

      if (urlMatches.length > 0) {
        let subLastIndex = 0;
        urlMatches.forEach((urlMatch) => {
          if (subLastIndex < urlMatch.index) {
            parts.push(
              <span key={`text-${keyCounter++}`}>
                {remainingText.slice(subLastIndex, urlMatch.index)}
              </span>
            );
          }
          parts.push(
            <a
              key={`url-${keyCounter++}`}
              href={urlMatch[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
            >
              {urlMatch[0]}
            </a>
          );
          subLastIndex = urlMatch.index + urlMatch[0].length;
        });
        if (subLastIndex < remainingText.length) {
          parts.push(
            <span key={`text-${keyCounter++}`}>{remainingText.slice(subLastIndex)}</span>
          );
        }
      } else {
        parts.push(
          <span key={`text-${keyCounter++}`}>{remainingText}</span>
        );
      }
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-black text-white">
      {messages.map((msg) => (
        <div key={msg.id} className="flex gap-4 max-w-4xl mx-auto">
          {/* User message - right aligned */}
          {msg.type === "user" && (
            <div className="flex flex-col gap-2 ml-auto">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl px-4 py-3 max-w-md break-words shadow-md hover:shadow-lg transition-shadow">
                {msg.content}
              </div>
            </div>
          )}

          {/* Assistant message - left aligned */}
          {msg.type === "assistant" && (
            <div className="flex flex-col gap-3 flex-1">
              {/* Main response */}
              {msg.content && (
                <div className="space-y-3">
                  {renderMessageContent(msg.content)}
                </div>
              )}

              {/* Loading state */}
              {msg.isLoading && (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <div className="animate-pulse">⚪</div>
                  {msg.searchInfo?.stages?.includes("searching") && "Searching the web..."}
                  {msg.searchInfo?.stages?.includes("reading") && "Reading results..."}
                  {msg.searchInfo?.stages?.includes("writing") && "Generating response..."}
                </div>
              )}

              {/* Sources section */}
              {msg.searchInfo?.urls && msg.searchInfo.urls.length > 0 && (
                <div className="mt-2 pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2 mb-3">
                    <Search className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-400">SOURCES</span>
                  </div>
                  <div className="space-y-2">
                    {msg.searchInfo.urls.map((url: string, i: number) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-2 text-sm text-blue-400 hover:text-blue-300 group"
                      >
                        <ExternalLink className="w-3 h-3 mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="hover:underline break-all">{url}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Actions */}
              {msg.content && msg.type === "assistant" && (
                <MessageActions content={msg.content} />
              )}
            </div>
          )}
        </div>
      ))}
      <div ref={messageEndRef} />
    </div>
  );
}
