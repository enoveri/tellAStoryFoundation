import { BlogEditor } from "@/components/blog/blog-editor";
import { MobileShell } from "@/components/shared/mobile-shell";

export default function BlogEditorPage() {
  return (
    <MobileShell title="Write Blog" subtitle="Draft NGO blog posts in markdown.">
      <BlogEditor />
    </MobileShell>
  );
}
