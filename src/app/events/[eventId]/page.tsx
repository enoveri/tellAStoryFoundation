import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
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
  workshop:
    "bg-[color:var(--badge-workshop-bg)] text-[color:var(--badge-workshop-text)]",
  webinar:
    "bg-[color:var(--badge-webinar-bg)] text-[color:var(--badge-webinar-text)]",
  community:
    "bg-[color:var(--badge-community-bg)] text-[color:var(--badge-community-text)]",
  fundraiser:
    "bg-[color:var(--badge-fundraiser-bg)] text-[color:var(--badge-fundraiser-text)]",
};

type Props = { params: Promise<{ eventId: string }> };

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://tellastoryfoundation.org"
  );
}

function truncate(value: string, length = 160) {
  if (value.length <= length) return value;
  return `${value.slice(0, length - 1).trimEnd()}...`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { eventId } = await params;
  const event = await loadPublicEventById(eventId);

  if (!event) {
    return {
      title: "Event not found | Tell A Story",
      description: "This event could not be found.",
    };
  }

  const description = truncate(event.description, 170);
  const url = `${getBaseUrl()}/events/${event.id}`;

  return {
    title: `${event.title} | Tell A Story`,
    description,
    alternates: {
      canonical: `/events/${event.id}`,
    },
    openGraph: {
      type: "article",
      title: event.title,
      description,
      url,
      images: [
        {
          url: event.image,
          alt: event.title,
          width: 1200,
          height: 630,
        },
      ],
      siteName: "Tell A Story",
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description,
      images: [event.image],
    },
  };
}

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
          <ShareButton title={event.title} description={event.description} />
        </div>
      </div>
    </MobileShell>
  );
}
