import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  Clock,
  MapPin,
  ArrowLeft,
  MessageCircle,
  Users,
} from "lucide-react";
import { MobileShell } from "@/components/shared/mobile-shell";
import { loadPublicEventById } from "@/lib/public-content-store";
import { cn } from "@/lib/utils";
import { ShareButton } from "./share-button";
import { EventRegistrationForm } from "./event-registration-form";

const typeColors: Record<string, string> = {
  workshop: "bg-violet-100 text-violet-700",
  webinar: "bg-[color:var(--primary-light)] text-[color:var(--primary)]",
  community: "bg-[color:var(--success-subtle)] text-[color:var(--success)]",
  fundraiser: "bg-amber-100 text-amber-700",
};

type Props = { params: Promise<{ eventId: string }> };

export default async function EventDetailPage({ params }: Props) {
  const { eventId } = await params;
  const event = await loadPublicEventById(eventId);
  if (!event) notFound();

  return (
    <MobileShell title={event.title} subtitle="Event details">
      <div className="space-y-5 pb-4">
        {/* Back */}
        <div className="px-4 pt-1">
          <Link
            href="/events"
            className="inline-flex items-center gap-1 text-sm font-medium"
            style={{ color: "var(--primary)" }}
          >
            <ArrowLeft size={16} /> All Events
          </Link>
        </div>

        {/* Cover image */}
        <div className="relative mx-4 h-52 overflow-hidden rounded-3xl">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          <span
            className={cn(
              "absolute left-4 top-4 rounded-full px-3 py-0.5 text-xs font-bold capitalize",
              typeColors[event.type],
            )}
          >
            {event.type}
          </span>
        </div>

        {/* Title + meta */}
        <div className="space-y-3 px-4">
          <h1
            className="text-xl font-bold leading-snug"
            style={{ color: "var(--foreground)" }}
          >
            {event.title}
          </h1>

          <div className="space-y-2">
            <div
              className="flex items-center gap-2 text-sm"
              style={{ color: "var(--muted)" }}
            >
              <CalendarDays size={15} style={{ color: "var(--primary)" }} />
              <span>{event.date}</span>
              <Clock
                size={15}
                className="ml-2"
                style={{ color: "var(--primary)" }}
              />
              <span>{event.time}</span>
            </div>
            <div
              className="flex items-center gap-2 text-sm"
              style={{ color: "var(--muted)" }}
            >
              <MapPin size={15} style={{ color: "var(--primary)" }} />
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div
          className="mx-4 rounded-2xl border p-4"
          style={{ borderColor: "var(--border)", background: "var(--card)" }}
        >
          <h2
            className="mb-2 text-sm font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            About this event
          </h2>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            {event.description}
          </p>
          <p
            className="mt-3 text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            This is a Tell A Story Foundation event. We create safe, facilitated
            spaces where people share their lived experiences — building
            empathy, community, and practical change through storytelling.
          </p>
        </div>

        {/* What to expect */}
        <div className="mx-4 space-y-2">
          <h2
            className="text-sm font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            What to expect
          </h2>
          {[
            "A warm, inclusive welcome for all participants",
            "Guided storytelling prompts and facilitation",
            "Opportunity to share (or simply listen)",
            "Connection with a supportive community",
          ].map((item) => (
            <div
              key={item}
              className="flex items-start gap-2 text-sm"
              style={{ color: "var(--muted)" }}
            >
              <span className="mt-0.5 shrink-0 text-[color:var(--success)]">
                ✓
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="mx-4 grid grid-cols-2 gap-3">
          {[
            { icon: Users, label: "Open to everyone", sub: "Free to attend" },
            {
              icon: MessageCircle,
              label: "Facilitated session",
              sub: "Safe space guaranteed",
            },
          ].map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl border p-3"
              style={{
                borderColor: "var(--border)",
                background: "var(--card)",
              }}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "var(--primary-light)" }}
              >
                <Icon size={16} style={{ color: "var(--primary)" }} />
              </div>
              <div>
                <p
                  className="text-xs font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  {label}
                </p>
                <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                  {sub}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <EventRegistrationForm eventId={event.id} eventTitle={event.title} />

        <div className="space-y-3 px-4">
          <a
            href="https://wa.me/256700277374"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold shadow-sm transition hover:opacity-90"
            style={{ background: "var(--primary-light)", color: "var(--primary)" }}
          >
            <MessageCircle size={16} /> Need help? Chat on WhatsApp
          </a>
          <ShareButton title={event.title} />
        </div>
      </div>
    </MobileShell>
  );
}
