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
  // ── Tables ──────────────────────────────────────────────────────────────────
  // Wrap in overflow div for mobile scroll; use not-prose to escape Typography's
  // descendant selectors and apply precise utility classes instead.
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
  // Styled as callout/info cards — not-prose for full control.
  blockquote: ({ children }) => (
    <div className="not-prose my-6 rounded-r-lg border-l-4 border-primary bg-primary/5 dark:bg-primary/10 px-5 py-4 text-sm leading-relaxed text-foreground [&_p]:my-1 [&_strong]:font-semibold [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_code]:border [&_code]:border-border">
      {children}
    </div>
  ),

  // ── Code blocks ─────────────────────────────────────────────────────────────
  // not-prose so prose doesn't override background/padding.
  pre: ({ children }) => {
    // Extract language from the nested <code className="language-xxx"> child.
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

  // Inline code: check for language-* className → block code inside a <pre>,
  // otherwise → inline code with highlight background.
  code: ({ className, children }) => {
    if (extractLanguage(className) !== null) {
      // Inside a pre block — minimal styling, pre handles the container.
      return (
        <code className={cn("font-mono text-sm text-slate-100 leading-relaxed", className)}>
          {children}
        </code>
      );
    }
    // Inline code
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
      className="font-medium text-primary underline-offset-4 hover:underline"
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
// Split into logical groups for readability. Applied to the <article> wrapper.
// Custom components above handle table/blockquote/code/a/hr with not-prose.

const PROSE_CLASSES = [
  // Plugin base — enables all prose-* modifier classes below
  "prose prose-slate dark:prose-invert max-w-none",

  // ── Headings ──────────────────────────────────────────────────────────────
  "prose-headings:scroll-mt-24 prose-headings:font-bold prose-headings:tracking-tight",
  // h2: major section — wide top margin + bottom border
  "prose-h2:text-[1.25rem] prose-h2:leading-snug",
  "prose-h2:mt-12 prose-h2:mb-5 prose-h2:pb-3",
  "prose-h2:border-b prose-h2:border-border",
  // h3: subsection / exercise
  "prose-h3:text-[1.1rem] prose-h3:leading-snug",
  "prose-h3:mt-8 prose-h3:mb-3",
  // h4: step / sub-exercise
  "prose-h4:text-base prose-h4:leading-snug",
  "prose-h4:mt-6 prose-h4:mb-2",

  // ── Paragraphs ─────────────────────────────────────────────────────────────
  "prose-p:my-4 prose-p:leading-[1.85] prose-p:text-foreground/90",

  // ── Lists ──────────────────────────────────────────────────────────────────
  "prose-ul:my-5 prose-ol:my-5",
  "prose-li:my-2 prose-li:leading-relaxed",

  // ── Strong / em ───────────────────────────────────────────────────────────
  "prose-strong:font-semibold prose-strong:text-foreground",

  // ── Inline code — neutralise the Typography backtick quotes, custom
  //    component handles actual styling
  "prose-code:before:content-none prose-code:after:content-none",
  "prose-code:font-mono",

  // ── Pre — neutralise so custom <pre> component has full control
  "prose-pre:bg-transparent prose-pre:p-0 prose-pre:shadow-none prose-pre:border-0",

  // ── HR ─────────────────────────────────────────────────────────────────────
  "prose-hr:border-border",

  // ── Lead paragraph ─────────────────────────────────────────────────────────
  "prose-lead:text-muted-foreground",
].join(" ");

// ─── Component ────────────────────────────────────────────────────────────────

interface MarkdownRendererProps {
  content: string;
  /** Extra classes merged onto the <article> wrapper */
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
