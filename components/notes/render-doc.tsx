import type { ReactNode } from "react";
import type { DocMark, DocNode, JournalDoc } from "@/lib/notes/types";

// Renders the stored Tiptap/ProseMirror JSON document as React elements.
// Only the node/mark types below are ever rendered — anything else is
// skipped. Because this walks a known JSON shape into explicit React
// elements (never dangerouslySetInnerHTML / raw HTML), arbitrary markup or
// scripts in `content` cannot execute: there is no HTML parser in this path.

function safeHref(href: unknown): string | null {
  if (typeof href !== "string") return null;
  try {
    const url = new URL(href, "https://abbybrennan.co.uk");
    if (["http:", "https:", "mailto:"].includes(url.protocol)) return href;
  } catch {
    return null;
  }
  return null;
}

function safeSrc(src: unknown): string | null {
  if (typeof src !== "string") return null;
  try {
    const url = new URL(src);
    if (["http:", "https:"].includes(url.protocol)) return src;
  } catch {
    return null;
  }
  return null;
}

function applyMarks(text: ReactNode, marks: DocMark[] | undefined, key: string): ReactNode {
  if (!marks || marks.length === 0) return text;
  return marks.reduce<ReactNode>((acc, mark, i) => {
    const markKey = `${key}-m${i}`;
    switch (mark.type) {
      case "bold":
        return <strong key={markKey}>{acc}</strong>;
      case "italic":
        return <em key={markKey}>{acc}</em>;
      case "link": {
        const href = safeHref(mark.attrs?.href);
        if (!href) return acc;
        return (
          <a
            key={markKey}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-mist underline-offset-2 transition-colors hover:text-roast"
          >
            {acc}
          </a>
        );
      }
      default:
        return acc;
    }
  }, text);
}

function renderInline(nodes: DocNode[] | undefined, keyPrefix: string): ReactNode[] {
  if (!nodes) return [];
  return nodes.map((node, i) => {
    const key = `${keyPrefix}-${i}`;
    if (node.type === "text") {
      return <span key={key}>{applyMarks(node.text ?? "", node.marks, key)}</span>;
    }
    if (node.type === "hardBreak") {
      return <br key={key} />;
    }
    return null;
  });
}

function renderBlock(node: DocNode, key: string): ReactNode {
  switch (node.type) {
    case "paragraph":
      return (
        <p key={key} className="text-[15px] leading-relaxed text-graphite sm:text-base">
          {renderInline(node.content, key)}
        </p>
      );
    case "heading": {
      const level = Number(node.attrs?.level) || 2;
      const className = "font-display font-semibold tracking-tight text-ink";
      const children = renderInline(node.content, key);
      if (level <= 2) return <h2 key={key} className={`${className} text-2xl`}>{children}</h2>;
      return <h3 key={key} className={`${className} text-xl`}>{children}</h3>;
    }
    case "blockquote":
      return (
        <blockquote key={key} className="border-l-2 border-roast/40 pl-4 italic text-graphite">
          {node.content?.map((child, i) => renderBlock(child, `${key}-${i}`))}
        </blockquote>
      );
    case "bulletList":
      return (
        <ul key={key} className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-graphite sm:text-base">
          {node.content?.map((item, i) => (
            <li key={`${key}-${i}`}>{item.content?.map((child, j) => renderBlock(child, `${key}-${i}-${j}`))}</li>
          ))}
        </ul>
      );
    case "orderedList":
      return (
        <ol key={key} className="list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-graphite sm:text-base">
          {node.content?.map((item, i) => (
            <li key={`${key}-${i}`}>{item.content?.map((child, j) => renderBlock(child, `${key}-${i}-${j}`))}</li>
          ))}
        </ol>
      );
    case "image": {
      const src = safeSrc(node.attrs?.src);
      if (!src) return null;
      const alt = typeof node.attrs?.alt === "string" ? node.attrs.alt : "";
      // eslint-disable-next-line @next/next/no-img-element
      return <img key={key} src={src} alt={alt} className="my-2 w-full rounded-md border border-mist" />;
    }
    default:
      return null;
  }
}

export function RenderDoc({ doc }: { doc: JournalDoc }) {
  return <>{doc.content.map((node, i) => renderBlock(node, `b${i}`))}</>;
}
