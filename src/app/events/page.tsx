import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock, MapPin, ArrowRight } from "lucide-react";
import { MobileShell } from "@/components/shared/mobile-shell";
import { loadPublicEvents } from "@/lib/public-content-store";
import { cn } from "@/lib/utils";

const typeColors: Record<string, string> = {
  workshop:
    "bg-[color:var(--badge-workshop-bg)] text-[color:var(--badge-workshop-text)]",
  webinar:
    "bg-[color:var(--badge-webinar-bg)] text-[color:var(--badge-webinar-text)]",
  community:
    "bg-[color:var(--badge-community-bg)] text-[color:var(--badge-community-text)]",
  fundraiser:
    "bg-[color:var(--badge-fundraiser-bg)] text-[color:var(--badge-fundraiser-text)]",
};

export default async function EventsPage() {
  const upcoming = await loadPublicEvents();

  return (
    <MobileShell title="Events" subtitle="Workshops, circles & more">
      <div className="space-y-4 px-4">
        {/* Header */}
        <div
          className="rounded-3xl px-5 py-5 text-center shadow-md"
          style={{ background: "var(--inverse)" }}
        >
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--primary-mid)" }}
          >
            Join us
          </p>
          <h2
            className="mt-1 text-xl font-bold"
            style={{ color: "var(--inverse-fg)" }}
          >
            Upcoming Events
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--inverse-muted)" }}>
            Find a workshop, webinar or story circle near you.
          </p>
        </div>

        {/* Event cards */}
        {upcoming.map((event) => (
          <article
            key={event.id}
            className="overflow-hidden rounded-2xl border shadow-sm"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            {/* Cover image */}
            <div className="relative h-40 w-full">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
              <span
                className={cn(
                  "absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize",
                  typeColors[event.type],
                )}
              >
                {event.type}
              </span>
            </div>

            {/* Content */}
            <div className="space-y-2 p-4">
              <h3
                className="font-semibold leading-snug"
                style={{ color: "var(--foreground)" }}
              >
                {event.title}
              </h3>
              <p
                className="text-sm leading-relaxed line-clamp-2"
                style={{ color: "var(--muted)" }}
              >
                {event.description}
              </p>

              {/* Meta */}
              <div className="space-y-1 pt-1">
                <div
                  className="flex items-center gap-1.5 text-xs"
                  style={{ color: "var(--muted)" }}
                >
                  <CalendarDays size={12} style={{ color: "var(--primary)" }} />
                  <span>{event.date}</span>
                  <Clock
                    size={12}
                    className="ml-2"
                    style={{ color: "var(--primary)" }}
                  />
                  <span>{event.time}</span>
                </div>
                <div
                  className="flex items-center gap-1.5 text-xs"
                  style={{ color: "var(--muted)" }}
                >
                  <MapPin size={12} style={{ color: "var(--primary)" }} />
                  <span>{event.location}</span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex gap-2 pt-2">
                <Link
                  href={`/events/${event.id}`}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-semibold shadow-sm transition"
                  style={{
                    background: "var(--primary)",
                    color: "var(--primary-fg)",
                  }}
                >
                  Register now <ArrowRight size={13} />
                </Link>
                <Link
                  href={`/events/${event.id}`}
                  className="flex items-center justify-center rounded-full border px-4 py-2.5 text-sm font-semibold transition"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  Details
                </Link>
              </div>
            </div>
          </article>
        ))}

        {/* Contact CTA */}
        <div
          className="rounded-2xl p-4 text-center"
          style={{
            background: "var(--primary-subtle)",
            border: "1px solid var(--primary-light)",
          }}
        >
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            Want to host an event?
          </p>
          <p className="mb-3 mt-1 text-xs" style={{ color: "var(--muted)" }}>
            Partner with us to bring a story circle to your community.
          </p>
          <a
            href="https://wa.me/256700277374"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold"
            style={{ background: "var(--primary)", color: "var(--primary-fg)" }}
          >
            Contact us on WhatsApp
          </a>
        </div>
      </div>
    </MobileShell>
  );
}
