import Image from "next/image";
import { Quote } from "lucide-react";
import { testimonials } from "@/lib/mock-data";

export function Testimonials() {
  return (
    <section className="space-y-3 px-4">
      <h2 className="text-lg font-semibold text-[color:var(--foreground)]">What our community says</h2>

      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
        {testimonials.map((t) => (
          <article
            key={t.id}
            className="flex w-72 shrink-0 flex-col gap-3 rounded-2xl border border-sky-100 bg-[color:var(--card)] p-4 shadow-sm"
          >
            {/* Quote icon */}
            <Quote size={20} className="text-sky-200" />

            {/* Quote text */}
            <p className="flex-1 text-sm leading-relaxed text-[color:var(--foreground)]/80 italic line-clamp-5">
              &ldquo;{t.quote}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 border-t border-sky-50 pt-3">
              <Image
                src={t.avatar}
                alt={t.name}
                width={36}
                height={36}
                className="rounded-full border-2 border-sky-100 object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[color:var(--foreground)]">{t.name}</p>
                <p className="truncate text-xs text-[color:var(--muted)]">{t.role}</p>
              </div>
              <span className="ml-auto shrink-0 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-600">
                {t.country}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
