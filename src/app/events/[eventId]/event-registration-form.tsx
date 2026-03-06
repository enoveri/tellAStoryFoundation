"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";

import { useCurrentUser } from "@/hooks/use-current-user";
import {
  getMyEventApplication,
  submitEventApplication,
} from "@/lib/events-client";

type EventRegistrationFormProps = {
  eventId: string;
  eventTitle: string;
};

function prettyDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "recently";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function EventRegistrationForm({
  eventId,
  eventTitle,
}: EventRegistrationFormProps) {
  const { user, isLoading } = useCurrentUser();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadyAppliedAt, setAlreadyAppliedAt] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    setFullName(user.name || "");
    setEmail(user.email || "");

    let mounted = true;
    const loadExisting = async () => {
      const { application } = await getMyEventApplication(eventId);
      if (!mounted || !application) return;

      setFullName(application.full_name);
      setEmail(application.email);
      setPhone(application.phone || "");
      setOrganisation(application.organisation || "");
      setNotes(application.notes || "");
      setAlreadyAppliedAt(application.created_at);
    };

    void loadExisting();

    return () => {
      mounted = false;
    };
  }, [eventId, user]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fullName.trim() || !email.trim()) {
      setStatus("Name and email are required.");
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    const result = await submitEventApplication({
      eventId,
      fullName,
      email,
      phone,
      organisation,
      notes,
    });

    setIsSubmitting(false);

    if (result.error) {
      setStatus(result.error);
      return;
    }

    setAlreadyAppliedAt(new Date().toISOString());
    setStatus("Application submitted successfully.");
  };

  return (
    <section
      className="mx-4 space-y-3 rounded-2xl border p-4"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
    >
      <h2
        className="text-sm font-semibold"
        style={{ color: "var(--foreground)" }}
      >
        Register for this event
      </h2>

      {isLoading ? (
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          Checking your account...
        </p>
      ) : null}

      {!isLoading && !user ? (
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          Please{" "}
          <Link
            href="/login"
            className="font-semibold underline"
            style={{ color: "var(--primary)" }}
          >
            sign in
          </Link>{" "}
          to register for {eventTitle}.
        </p>
      ) : null}

      {!isLoading && user ? (
        <>
          {alreadyAppliedAt ? (
            <p className="text-xs" style={{ color: "var(--success)" }}>
              You already applied on {prettyDate(alreadyAppliedAt)}. Update your
              details below if needed.
            </p>
          ) : null}

          <form className="space-y-2" onSubmit={onSubmit}>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full name"
              className="w-full rounded-xl border px-3 py-2 text-sm"
              style={{
                borderColor: "var(--border)",
                background: "var(--background)",
                color: "var(--foreground)",
              }}
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="w-full rounded-xl border px-3 py-2 text-sm"
              style={{
                borderColor: "var(--border)",
                background: "var(--background)",
                color: "var(--foreground)",
              }}
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className="w-full rounded-xl border px-3 py-2 text-sm"
              style={{
                borderColor: "var(--border)",
                background: "var(--background)",
                color: "var(--foreground)",
              }}
            />
            <input
              value={organisation}
              onChange={(e) => setOrganisation(e.target.value)}
              placeholder="Organisation (optional)"
              className="w-full rounded-xl border px-3 py-2 text-sm"
              style={{
                borderColor: "var(--border)",
                background: "var(--background)",
                color: "var(--foreground)",
              }}
            />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything we should know?"
              rows={3}
              className="w-full rounded-xl border px-3 py-2 text-sm"
              style={{
                borderColor: "var(--border)",
                background: "var(--background)",
                color: "var(--foreground)",
              }}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold disabled:opacity-50"
              style={{
                background: "var(--primary)",
                color: "var(--primary-fg)",
              }}
            >
              <Send size={14} />{" "}
              {isSubmitting ? "Submitting..." : "Submit application"}
            </button>
          </form>
        </>
      ) : null}

      {status ? (
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          {status}
        </p>
      ) : null}
    </section>
  );
}
