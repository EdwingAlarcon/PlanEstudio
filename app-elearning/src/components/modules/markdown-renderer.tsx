"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import type { Components } from "react-markdown";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractLanguage(className?: string): string | null {
  if (!className) return null;
  const m = /language-(\w+)/.exec(className);
  return m?.[1] ?? null;
}

// ─── Custom components ────────────────────────────────────────────────────────

const COMPONENTS: Components = {
  // ── Lists ────────────────────────────────────────────────────────────────────
  // Explicit overrides guarantee bullets/numbers are always visible regardless
  // of @tailwindcss/typography resets or CSS cascade conflicts.
  // remark-gfm adds class="contains-task-list" to ul elements that contain
  // checkboxes — those get list-none; regular lists get list-disc.
  ul: ({ className, children }) => {
    if (className?.includes("contains-task-list")) {
      return (
        <ul className="my-5 list-none pl-0 space-y-2">{children}</ul>
      );
    }
    return (
      <ul className="my-5 list-disc pl-6 space-y-0.5">{children}</ul>
    );
  },

  ol: ({ children }) => (
    <ol className="my-5 list-decimal pl-6 space-y-0.5">{children}</ol>
  ),

  li: ({ className, children }) => {
    if (className?.includes("task-list-item")) {
      return (
        <li className="flex items-start gap-0 list-none leading-[1.75] my-0.5">
          {children}
        </li>
      );
    }
    return <li className="leading-[1.75] my-0.5">{children}</li>;
  },

  // ── Tables ──────────────────────────────────────────────────────────────────
  table: ({ children }) => (
    <div className="not-prose my-8 w-full overflow-x-auto rounded-lg border border-border shadow-sm">
      <table className="w-full min-w-full border-collapse text-sm">
        {children}
      </table>
    </div>
  ),

  thead: ({ children }) => (
    <thead className="bg-muted/70 dark:bg-muted/50">{children}</thead>
  ),

  tbody: ({ children }) => (
    <tbody className="divide-y divide-border">{children}</tbody>
  ),

  tr: ({ children }) => (
    <tr className="even:bg-muted/20 transition-colors hover:bg-muted/40">
      {children}
    </tr>
  ),

  th: ({ children }) => (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b border-border whitespace-nowrap">
      {children}
    </th>
  ),

  td: ({ children }) => (
    <td className="px-4 py-3 text-sm text-foreground align-top">
      {children}
    </td>
  ),

  // ── Blockquotes ─────────────────────────────────────────────────────────────
  blockquote: ({ children }) => (
    <div className="not-prose my-6 rounded-r-lg border-l-4 border-primary bg-primary/5 dark:bg-primary/10 px-5 py-4 text-sm leading-relaxed text-foreground [&_p]:my-1 [&_strong]:font-semibold [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_code]:border [&_code]:border-border">
      {children}
    </div>
  ),

  // ── Code blocks ─────────────────────────────────────────────────────────────
  pre: ({ children }) => {
    let lang: string | null = null;
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        const p = child.props as Record<string, unknown>;
        if (typeof p.className === "string") {
          lang = extractLanguage(p.className);
        }
      }
    });

    return (
      <div className="not-prose my-6 overflow-hidden rounded-lg border border-slate-700 dark:border-slate-800 shadow-md">
        {lang && (
          <div className="flex items-center gap-2 border-b border-slate-700 bg-slate-800 px-4 py-2">
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
              {lang}
            </span>
          </div>
        )}
        <pre className="m-0 overflow-x-auto bg-slate-900 dark:bg-[#0d1117] p-5 text-sm leading-relaxed">
          {children}
        </pre>
      </div>
    );
  },

  code: ({ className, children }) => {
    if (extractLanguage(className) !== null) {
      return (
        <code className={cn("font-mono text-sm text-slate-100 leading-relaxed", className)}>
          {children}
        </code>
      );
    }
    return (
      <code className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.875em] text-foreground">
        {children}
      </code>
    );
  },

  // ── Links ───────────────────────────────────────────────────────────────────
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-[#0078D4] dark:text-[#4DB8FF] underline-offset-4 hover:underline hover:text-[#106EBE] dark:hover:text-[#74CAFF] transition-colors"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),

  // ── Horizontal rule ─────────────────────────────────────────────────────────
  hr: () => <hr className="not-prose my-10 border-t border-border" />,

  // ── GFM task-list checkboxes ─────────────────────────────────────────────────
  input: ({ type, checked }) => {
    if (type !== "checkbox") return null;
    return (
      <span
        aria-hidden
        className={cn(
          "mr-2 mt-0.5 inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border align-text-top transition-colors",
          checked
            ? "border-primary bg-primary"
            : "border-muted-foreground/40 bg-background"
        )}
      >
        {checked && (
          <svg
            className="h-3 w-3 text-primary-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
    );
  },
};

// ─── Prose wrapper classes ────────────────────────────────────────────────────

const PROSE_CLASSES = [
  "prose prose-slate dark:prose-invert max-w-none",

  // Headings — generous vertical spacing matches MS Learn section rhythm
  "prose-headings:scroll-mt-24 prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground",
  "prose-h2:text-[1.25rem] prose-h2:leading-snug",
  "prose-h2:mt-14 prose-h2:mb-6 prose-h2:pb-3",
  "prose-h2:border-b prose-h2:border-border",
  "prose-h3:text-[1.1rem] prose-h3:leading-snug",
  "prose-h3:mt-10 prose-h3:mb-4",
  "prose-h4:text-base prose-h4:leading-snug",
  "prose-h4:mt-6 prose-h4:mb-3",

  // Paragraphs
  "prose-p:my-5 prose-p:leading-[1.85]",

  // Lists — only margin; list-style handled by component overrides above
  "prose-ul:my-5 prose-ol:my-5",

  // Paragraphs inside list items (loose lists) shouldn't add giant margins
  "[&_li>p]:my-2",

  // Strong / em
  "prose-strong:font-semibold prose-strong:text-foreground",

  // Inline code
  "prose-code:before:content-none prose-code:after:content-none",
  "prose-code:font-mono",

  // Pre — neutralised; custom <pre> handles the container
  "prose-pre:bg-transparent prose-pre:p-0 prose-pre:shadow-none prose-pre:border-0",

  // HR
  "prose-hr:border-border",

  // Lead
  "prose-lead:text-muted-foreground",
].join(" ");

// ─── Component ────────────────────────────────────────────────────────────────

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <article className={cn(PROSE_CLASSES, className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={COMPONENTS}>
        {content}
      </ReactMarkdown>
    </article>
  );
}
