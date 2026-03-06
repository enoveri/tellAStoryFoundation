"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  Edit,
  Save,
  Trash2,
  Users,
} from "lucide-react";

import { MobileShell } from "@/components/shared/mobile-shell";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  deleteAdminEvent,
  fetchAdminEvents,
  fetchEventApplicants,
  saveAdminEvent,
  type AdminEvent,
  type EventApplicant,
} from "@/lib/admin-client";
import { uploadEventCoverImage } from "@/lib/events-client";

type EventFormState = {
  id?: string;
  title: string;
  description: string;
  eventLocation: string;
  startsAt: string;
  endsAt: string;
  coverImageUrl: string;
  isActive: boolean;
};

const emptyForm: EventFormState = {
  title: "",
  description: "",
  eventLocation: "",
  startsAt: "",
  endsAt: "",
  coverImageUrl: "",
  isActive: true,
};

function toLocalDateTimeInput(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const offsetMs = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function prettyDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "TBD";

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminEventsPage() {
  const { user, isLoading } = useCurrentUser();
  const isAdmin = user?.role === "admin";

  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [form, setForm] = useState<EventFormState>(emptyForm);
  const [status, setStatus] = useState<string | null>(null);
  const [isEventsLoading, setIsEventsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [expandedApplicantsEventId, setExpandedApplicantsEventId] = useState<
    string | null
  >(null);
  const [applicantsByEvent, setApplicantsByEvent] = useState<
    Record<string, EventApplicant[]>
  >({});
  const [loadingApplicantsFor, setLoadingApplicantsFor] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const nextEvents = await fetchAdminEvents();
      if (!mounted) return;
      setEvents(nextEvents);
      setIsEventsLoading(false);
    };

    if (isAdmin) {
      void load();
      return;
    }

    setIsEventsLoading(false);

    return () => {
      mounted = false;
    };
  }, [isAdmin]);

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
    [events],
  );

  const refreshEvents = async () => {
    const nextEvents = await fetchAdminEvents();
    setEvents(nextEvents);
  };

  const startEdit = (event: AdminEvent) => {
    setForm({
      id: event.id,
      title: event.title,
      description: event.description,
      eventLocation: event.eventLocation,
      startsAt: toLocalDateTimeInput(event.startsAt),
      endsAt: toLocalDateTimeInput(event.endsAt),
      coverImageUrl: event.coverImageUrl,
      isActive: event.isActive,
    });
    setStatus(`Editing ${event.title}`);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setStatus("Creating a new event.");
  };

  const saveEvent = async () => {
    if (!form.title.trim() || !form.description.trim() || !form.startsAt) {
      setStatus("Title, description, and start date/time are required.");
      return;
    }

    setIsSaving(true);
    setStatus(null);

    const result = await saveAdminEvent({
      id: form.id,
      title: form.title.trim(),
      description: form.description.trim(),
      eventLocation: form.eventLocation.trim(),
      startsAt: form.startsAt,
      endsAt: form.endsAt,
      coverImageUrl: form.coverImageUrl.trim(),
      isActive: form.isActive,
    });

    setIsSaving(false);

    if (result.error) {
      setStatus(`Save failed: ${result.error}`);
      return;
    }

    await refreshEvents();
    setStatus(form.id ? "Event updated." : "Event created.");
    setForm(emptyForm);
  };

  const removeEvent = async (event: AdminEvent) => {
    const ok = confirm(`Delete event \"${event.title}\"?`);
    if (!ok) return;

    setStatus(null);
    const result = await deleteAdminEvent(event.id);

    if (result.error) {
      setStatus(`Delete failed: ${result.error}`);
      return;
    }

    await refreshEvents();
    setStatus("Event deleted.");
  };

  const onCoverPicked = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    const { url, error } = await uploadEventCoverImage(file);
    setIsUploadingCover(false);

    if (error || !url) {
      setStatus(error || "Cover upload failed.");
      event.currentTarget.value = "";
      return;
    }

    setForm((prev) => ({ ...prev, coverImageUrl: url }));
    setStatus("Cover image uploaded.");
    event.currentTarget.value = "";
  };

  const toggleApplicants = async (eventId: string) => {
    if (expandedApplicantsEventId === eventId) {
      setExpandedApplicantsEventId(null);
      return;
    }

    setExpandedApplicantsEventId(eventId);

    if (applicantsByEvent[eventId]) {
      return;
    }

    setLoadingApplicantsFor(eventId);
    const applicants = await fetchEventApplicants(eventId);
    setLoadingApplicantsFor(null);
    setApplicantsByEvent((prev) => ({ ...prev, [eventId]: applicants }));
  };

  if (isLoading) {
    return (
      <MobileShell title="Events" subtitle="Checking access">
        <div className="p-8 text-center text-sm" style={{ color: "var(--muted)" }}>
          Loading your account...
        </div>
      </MobileShell>
    );
  }

  if (!isAdmin) {
    return (
      <MobileShell title="Events" subtitle="Admin only">
        <div className="p-8 text-center text-sm" style={{ color: "var(--muted)" }}>
          Admin access required. <Link href="/profile" className="font-semibold underline" style={{ color: "var(--primary)" }}>Go back</Link>
        </div>
      </MobileShell>
    );
  }

  if (isEventsLoading) {
    return (
      <MobileShell title="Manage Events" subtitle="Loading events">
        <div className="p-8 text-center text-sm" style={{ color: "var(--muted)" }}>
          Loading events...
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell title="Manage Events" subtitle={`${events.length} events`}>
      <div className="space-y-4 pb-3">
        {status ? (
          <div className="mx-4 rounded-xl border px-3 py-2 text-xs" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
            {status}
          </div>
        ) : null}

        <div className="flex items-center justify-between px-4 pt-1">
          <Link href="/admin" className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: "var(--primary)" }}>
            <ChevronLeft size={16} /> Admin Dashboard
          </Link>
          <button
            onClick={resetForm}
            className="rounded-full border px-3 py-1.5 text-xs font-semibold"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            New event
          </button>
        </div>

        <section className="mx-4 space-y-3 rounded-2xl border p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            {form.id ? "Edit event" : "Create event"}
          </h2>

          <input
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Event title"
            className="w-full rounded-xl border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border)", background: "var(--background)", color: "var(--foreground)" }}
          />

          <textarea
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Event description"
            rows={3}
            className="w-full rounded-xl border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border)", background: "var(--background)", color: "var(--foreground)" }}
          />

          <input
            value={form.eventLocation}
            onChange={(e) => setForm((prev) => ({ ...prev, eventLocation: e.target.value }))}
            placeholder="Location"
            className="w-full rounded-xl border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border)", background: "var(--background)", color: "var(--foreground)" }}
          />

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              type="datetime-local"
              value={form.startsAt}
              onChange={(e) => setForm((prev) => ({ ...prev, startsAt: e.target.value }))}
              className="w-full rounded-xl border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border)", background: "var(--background)", color: "var(--foreground)" }}
            />
            <input
              type="datetime-local"
              value={form.endsAt}
              onChange={(e) => setForm((prev) => ({ ...prev, endsAt: e.target.value }))}
              className="w-full rounded-xl border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border)", background: "var(--background)", color: "var(--foreground)" }}
            />
          </div>

          <div className="space-y-2">
            <input
              value={form.coverImageUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, coverImageUrl: e.target.value }))}
              placeholder="Cover Image URL"
              className="w-full rounded-xl border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border)", background: "var(--background)", color: "var(--foreground)" }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                void onCoverPicked(e);
              }}
              className="w-full rounded-xl border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border)", background: "var(--background)", color: "var(--foreground)" }}
            />
            {isUploadingCover ? (
              <p className="text-xs" style={{ color: "var(--muted)" }}>Uploading cover image...</p>
            ) : null}
          </div>

          <label className="flex items-center gap-2 text-sm" style={{ color: "var(--foreground)" }}>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
            />
            Event is active
          </label>

          <button
            onClick={() => {
              void saveEvent();
            }}
            disabled={isSaving}
            className="flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold disabled:opacity-50"
            style={{ background: "var(--primary)", color: "var(--primary-fg)" }}
          >
            <Save size={14} /> {isSaving ? "Saving..." : form.id ? "Update event" : "Create event"}
          </button>
        </section>

        <section className="space-y-3 px-4">
          {sortedEvents.map((event) => (
            <article key={event.id} className="space-y-2 rounded-2xl border p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{event.title}</h3>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    {prettyDate(event.startsAt)}
                    {event.eventLocation ? ` · ${event.eventLocation}` : ""}
                  </p>
                </div>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                  style={{
                    background: event.isActive ? "var(--success-subtle)" : "#e5e7eb",
                    color: event.isActive ? "var(--success)" : "#374151",
                  }}
                >
                  {event.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <p className="line-clamp-2 text-xs" style={{ color: "var(--muted)" }}>
                {event.description}
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => startEdit(event)}
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold"
                  style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  <Edit size={12} /> Edit
                </button>
                <button
                  onClick={() => {
                    void toggleApplicants(event.id);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold"
                  style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  <Users size={12} /> Applicants ({event.applicantsCount})
                </button>
                <button
                  onClick={() => {
                    void removeEvent(event);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ background: "#fff1f2", color: "#e11d48" }}
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>

              {expandedApplicantsEventId === event.id ? (
                <div className="mt-2 rounded-xl border p-3" style={{ borderColor: "var(--border)", background: "var(--background)" }}>
                  <p className="mb-2 text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                    Event Applicants
                  </p>
                  {loadingApplicantsFor === event.id ? (
                    <p className="text-xs" style={{ color: "var(--muted)" }}>Loading applicants...</p>
                  ) : (applicantsByEvent[event.id] || []).length === 0 ? (
                    <p className="text-xs" style={{ color: "var(--muted)" }}>No applications yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {(applicantsByEvent[event.id] || []).map((applicant) => (
                        <div key={applicant.id} className="rounded-lg border p-2" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
                          <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>{applicant.fullName}</p>
                          <p className="text-[11px]" style={{ color: "var(--muted)" }}>{applicant.email}</p>
                          {applicant.phone ? <p className="text-[11px]" style={{ color: "var(--muted)" }}>{applicant.phone}</p> : null}
                          {applicant.organisation ? <p className="text-[11px]" style={{ color: "var(--muted)" }}>{applicant.organisation}</p> : null}
                          {applicant.notes ? <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>{applicant.notes}</p> : null}
                          <p className="mt-1 text-[10px]" style={{ color: "var(--muted)" }}>
                            Applied {prettyDate(applicant.createdAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </article>
          ))}

          {sortedEvents.length === 0 ? (
            <div className="rounded-2xl border p-4 text-center text-sm" style={{ borderColor: "var(--border)", color: "var(--muted)", background: "var(--card)" }}>
              No events yet. Create the first one above.
            </div>
          ) : null}
        </section>

        <div className="px-4 text-center text-xs" style={{ color: "var(--muted)" }}>
          Event creation and applicant management sync directly with Supabase.
        </div>
      </div>
    </MobileShell>
  );
}
