import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Clock, MapPin, ArrowRight } from "lucide-react";
import { events } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const typeColors: Record<string, string> = {
  workshop:   "bg-violet-100 text-violet-700",
  webinar:    "bg-sky-100    text-sky-700",
  community:  "bg-emerald-100 text-emerald-700",
  fundraiser: "bg-amber-100  text-amber-700",
};

export function UpcomingEvents() {
  return (
    <section className="space-y-3 px-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[color:var(--foreground)]">Upcoming events</h2>
        <Link href="/about" className="text-sm font-medium text-[color:var(--muted)] hover:text-sky-700">
          View all
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
        {events.map((event) => (
          <article
            key={event.id}
            className="flex w-64 shrink-0 flex-col overflow-hidden rounded-2xl border border-sky-100 bg-[color:var(--card)] shadow-sm"
          >
            <div className="relative h-28 w-full">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
                sizes="256px"
              />
              <span className={cn("absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize", typeColors[event.type])}>
                {event.type}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-1.5 p-3">
              <p className="text-sm font-semibold leading-tight text-[color:var(--foreground)] line-clamp-2">{event.title}</p>
              <p className="text-xs leading-relaxed text-[color:var(--muted)] line-clamp-2">{event.description}</p>

              <div className="mt-auto space-y-1 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-[color:var(--muted)]">
                  <CalendarDays size={11} className="shrink-0 text-sky-500" />
                  <span>{event.date}</span>
                  <Clock size={11} className="ml-1 shrink-0 text-sky-500" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[color:var(--muted)]">
                  <MapPin size={11} className="shrink-0 text-sky-500" />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>
            </div>
          </article>
        ))}

        {/* View all card */}
        <Link
          href="/about"
          className="flex w-32 shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-sky-200 bg-sky-50 text-center text-xs font-semibold text-sky-700 hover:bg-sky-100"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100">
            <ArrowRight size={14} />
          </div>
          View all events
        </Link>
      </div>
    </section>
  );
}
