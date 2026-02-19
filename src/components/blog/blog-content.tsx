import ReactMarkdown from "react-markdown";

type BlogContentProps = {
  markdown: string;
};

export function BlogContent({ markdown }: BlogContentProps) {
  return (
    <article className="prose prose-sm max-w-none prose-headings:text-[color:var(--foreground)] prose-p:text-[color:var(--foreground)]/90 prose-blockquote:border-l-sky-300 prose-blockquote:text-[color:var(--muted)] prose-li:text-[color:var(--foreground)]/90">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </article>
  );
}
