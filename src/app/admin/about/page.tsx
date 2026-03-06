"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Check,
} from "lucide-react";
import { MobileShell } from "@/components/shared/mobile-shell";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useAbout } from "@/context/about-context";
import {
  uploadAboutImageAsset,
  uploadAboutGalleryImage,
  type AboutData,
  type GalleryImage,
  type Partner,
  type PartnershipType,
  type TeamMember,
} from "@/lib/about-store";
import { cn } from "@/lib/utils";
import type {
  ChangeEvent,
} from "react";

// ─── Reusable primitives ──────────────────────────────────────────────────────

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  const cls =
    "w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-1";
  const style = {
    borderColor: "var(--border)",
    background: "var(--background)",
    color: "var(--foreground)",
  } as React.CSSProperties;
  return (
    <div className="space-y-1">
      <label
        className="text-xs font-semibold uppercase tracking-wide"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
          style={style}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
          style={style}
        />
      )}
    </div>
  );
}

function SaveBar({
  onSave,
  saved,
}: {
  onSave: () => void | Promise<void>;
  saved: boolean;
}) {
  return (
    <div className="flex items-center justify-end py-2">
      <button
        onClick={() => {
          void onSave();
        }}
        className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-semibold shadow-sm transition"
        style={{
          background: saved ? "var(--success)" : "var(--primary)",
          color: "var(--primary-fg)",
        }}
      >
        {saved ? (
          <>
            <Check size={14} /> Saved!
          </>
        ) : (
          <>
            <Save size={14} /> Save section
          </>
        )}
      </button>
    </div>
  );
}

function useSaved() {
  const [saved, setSaved] = useState(false);
  const flash = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  return { saved, flash };
}

function nanoid() {
  return Math.random().toString(36).slice(2, 10);
}

// ─── Section editors ─────────────────────────────────────────────────────────

function HeroEditor({
  draft,
  onChange,
}: {
  draft: AboutData;
  onChange: (d: AboutData) => void;
}) {
  const { saved, flash } = useSaved();
  const { update } = useAbout();

  return (
    <div className="space-y-4">
      <div
        className="space-y-3 rounded-2xl border p-4"
        style={{ borderColor: "var(--border)", background: "var(--card)" }}
      >
        <p
          className="text-xs font-bold uppercase tracking-wide"
          style={{ color: "var(--muted)" }}
        >
          Hero banner
        </p>
        <Field
          label="Headline"
          value={draft.heroTitle}
          onChange={(v) => onChange({ ...draft, heroTitle: v })}
        />
        <Field
          label="Subtitle"
          value={draft.heroSubtitle}
          onChange={(v) => onChange({ ...draft, heroSubtitle: v })}
          multiline
        />
      </div>

      <div
        className="space-y-3 rounded-2xl border p-4"
        style={{ borderColor: "var(--border)", background: "var(--card)" }}
      >
        <p
          className="text-xs font-bold uppercase tracking-wide"
          style={{ color: "var(--muted)" }}
        >
          Mission pillars (4 cards)
        </p>
        {draft.pillars.map((p, i) => (
          <div
            key={i}
            className="space-y-2 rounded-xl border p-3"
            style={{ borderColor: "var(--border)" }}
          >
            <p
              className="text-xs font-semibold"
              style={{ color: "var(--primary)" }}
            >
              Pillar {i + 1}
            </p>
            <Field
              label="Title"
              value={p.title}
              onChange={(v) => {
                const next = [...draft.pillars];
                next[i] = { ...p, title: v };
                onChange({ ...draft, pillars: next });
              }}
            />
            <Field
              label="Body"
              value={p.body}
              onChange={(v) => {
                const next = [...draft.pillars];
                next[i] = { ...p, body: v };
                onChange({ ...draft, pillars: next });
              }}
              multiline
            />
          </div>
        ))}
      </div>

      <SaveBar
        saved={saved}
        onSave={async () => {
          await update(draft);
          flash();
        }}
      />
    </div>
  );
}

function TeamEditor({
  draft,
  onChange,
}: {
  draft: AboutData;
  onChange: (d: AboutData) => void;
}) {
  const { saved, flash } = useSaved();
  const { update } = useAbout();
  const [uploadingMemberId, setUploadingMemberId] = useState<string | null>(
    null,
  );
  const [uploadErrorByMember, setUploadErrorByMember] = useState<
    Record<string, string>
  >({});

  const addMember = () => {
    const member: TeamMember = {
      id: nanoid(),
      name: "New Member",
      role: "Role title",
      img: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    };
    onChange({ ...draft, team: [...draft.team, member] });
  };

  const updateMember = (id: string, key: keyof TeamMember, val: string) => {
    onChange({
      ...draft,
      team: draft.team.map((m) => (m.id === id ? { ...m, [key]: val } : m)),
    });
  };

  const removeMember = (id: string) => {
    onChange({ ...draft, team: draft.team.filter((m) => m.id !== id) });
  };

  const uploadMemberAvatar = async (memberId: string, file: File) => {
    setUploadingMemberId(memberId);
    setUploadErrorByMember((prev) => {
      const next = { ...prev };
      delete next[memberId];
      return next;
    });

    const { url, error } = await uploadAboutImageAsset(file, "team");
    setUploadingMemberId(null);

    if (error || !url) {
      setUploadErrorByMember((prev) => ({
        ...prev,
        [memberId]: error || "Avatar upload failed.",
      }));
      return;
    }

    updateMember(memberId, "img", url);
  };

  return (
    <div className="space-y-4">
      {draft.team.map((m) => (
        <div
          key={m.id}
          className="space-y-3 rounded-2xl border p-4"
          style={{ borderColor: "var(--border)", background: "var(--card)" }}
        >
          <div className="flex items-center justify-between">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={m.img}
              alt={m.name}
              className="h-10 w-10 rounded-full object-cover"
            />
            <button
              onClick={() => removeMember(m.id)}
              className="rounded-full p-1.5 transition hover:bg-red-50"
              style={{ color: "var(--danger, #ef4444)" }}
            >
              <Trash2 size={15} />
            </button>
          </div>
          <Field
            label="Name"
            value={m.name}
            onChange={(v) => updateMember(m.id, "name", v)}
          />
          <Field
            label="Role"
            value={m.role}
            onChange={(v) => updateMember(m.id, "role", v)}
          />
          <Field
            label="Avatar URL"
            value={m.img}
            onChange={(v) => updateMember(m.id, "img", v)}
          />
          <div className="space-y-1">
            <label
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: "var(--muted)" }}
            >
              Upload avatar
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void uploadMemberAvatar(m.id, file);
                }
                event.currentTarget.value = "";
              }}
              className="w-full rounded-xl border px-3 py-2 text-sm"
              style={{
                borderColor: "var(--border)",
                background: "var(--background)",
                color: "var(--foreground)",
              }}
            />
            {uploadingMemberId === m.id ? (
              <p className="text-[11px]" style={{ color: "var(--muted)" }}>
                Uploading avatar...
              </p>
            ) : null}
            {uploadErrorByMember[m.id] ? (
              <p className="text-[11px]" style={{ color: "#ef4444" }}>
                {uploadErrorByMember[m.id]}
              </p>
            ) : null}
          </div>
        </div>
      ))}
      <button
        onClick={addMember}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-3 text-sm font-semibold transition"
        style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
      >
        <Plus size={15} /> Add team member
      </button>
      <SaveBar
        saved={saved}
        onSave={async () => {
          await update(draft);
          flash();
        }}
      />
    </div>
  );
}

function GalleryEditor({
  draft,
  onChange,
}: {
  draft: AboutData;
  onChange: (d: AboutData) => void;
}) {
  const { saved, flash } = useSaved();
  const { update } = useAbout();
  const [newSrc, setNewSrc] = useState("");
  const [newAlt, setNewAlt] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const addImage = () => {
    if (!newSrc.trim()) return;
    const img: GalleryImage = {
      id: nanoid(),
      src: newSrc.trim(),
      alt: newAlt.trim() || "Gallery image",
    };
    onChange({ ...draft, gallery: [...draft.gallery, img] });
    setNewSrc("");
    setNewAlt("");
  };

  const onFilePicked = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setNewFile(file);
    setUploadError(null);
  };

  const uploadAndAddImage = async () => {
    if (!newFile) return;

    setIsUploading(true);
    setUploadError(null);

    const { url, error } = await uploadAboutGalleryImage(newFile);
    setIsUploading(false);

    if (error || !url) {
      setUploadError(error || "Image upload failed.");
      return;
    }

    const img: GalleryImage = {
      id: nanoid(),
      src: url,
      alt: newAlt.trim() || newFile.name || "Gallery image",
    };

    onChange({ ...draft, gallery: [...draft.gallery, img] });
    setNewFile(null);
    setNewAlt("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (id: string) =>
    onChange({ ...draft, gallery: draft.gallery.filter((g) => g.id !== id) });

  const updateAlt = (id: string, alt: string) =>
    onChange({
      ...draft,
      gallery: draft.gallery.map((g) => (g.id === id ? { ...g, alt } : g)),
    });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {draft.gallery.map((g) => (
          <div
            key={g.id}
            className="relative overflow-hidden rounded-2xl border"
            style={{ borderColor: "var(--border)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={g.src}
              alt={g.alt}
              className="aspect-square w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 space-y-1 bg-black/60 p-2">
              <input
                value={g.alt}
                onChange={(e) => updateAlt(g.id, e.target.value)}
                className="w-full rounded bg-white/20 px-2 py-0.5 text-[10px] text-white placeholder:text-white/60 outline-none"
                placeholder="Alt text"
              />
              <button
                onClick={() => removeImage(g.id)}
                className="flex w-full items-center justify-center gap-1 rounded py-0.5 text-[10px] font-semibold text-red-300 hover:bg-red-900/40"
              >
                <Trash2 size={10} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add new */}
      <div
        className="space-y-2 rounded-2xl border p-4"
        style={{ borderColor: "var(--border)", background: "var(--card)" }}
      >
        <p
          className="text-xs font-bold uppercase tracking-wide"
          style={{ color: "var(--muted)" }}
        >
          Add image
        </p>
        <div className="space-y-1">
          <label
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--muted)" }}
          >
            Upload image
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFilePicked}
            className="w-full rounded-xl border px-3 py-2 text-sm"
            style={{
              borderColor: "var(--border)",
              background: "var(--background)",
              color: "var(--foreground)",
            }}
          />
          {newFile ? (
            <p className="text-[11px]" style={{ color: "var(--muted)" }}>
              Selected: {newFile.name}
            </p>
          ) : null}
        </div>
        <Field label="Image URL" value={newSrc} onChange={setNewSrc} />
        <Field label="Alt text" value={newAlt} onChange={setNewAlt} />
        <button
          onClick={() => {
            void uploadAndAddImage();
          }}
          disabled={!newFile || isUploading}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background: "var(--primary)",
            color: "var(--primary-fg)",
          }}
        >
          {isUploading ? "Uploading..." : "Upload and add image"}
        </button>
        <button
          onClick={addImage}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold transition"
          style={{
            background: "var(--primary-light)",
            color: "var(--primary)",
          }}
        >
          <Plus size={14} /> Add to gallery
        </button>
        {uploadError ? (
          <p className="text-xs" style={{ color: "#ef4444" }}>
            {uploadError}
          </p>
        ) : null}
      </div>

      <SaveBar
        saved={saved}
        onSave={async () => {
          await update(draft);
          flash();
        }}
      />
    </div>
  );
}

function PartnersEditor({
  draft,
  onChange,
}: {
  draft: AboutData;
  onChange: (d: AboutData) => void;
}) {
  const { saved, flash } = useSaved();
  const { update } = useAbout();
  const [uploadingPartnerId, setUploadingPartnerId] = useState<string | null>(
    null,
  );
  const [uploadErrorByPartner, setUploadErrorByPartner] = useState<
    Record<string, string>
  >({});

  const addPartner = () => {
    const p: Partner = {
      id: nanoid(),
      name: "Partner Name",
      kind: "Partner type",
      logo: `https://i.pravatar.cc/80?img=${Math.floor(Math.random() * 70)}`,
    };
    onChange({ ...draft, partners: [...draft.partners, p] });
  };
  const removePartner = (id: string) =>
    onChange({ ...draft, partners: draft.partners.filter((p) => p.id !== id) });
  const updatePartner = (id: string, key: keyof Partner, val: string) =>
    onChange({
      ...draft,
      partners: draft.partners.map((p) =>
        p.id === id ? { ...p, [key]: val } : p,
      ),
    });

  const addPType = () => {
    const pt: PartnershipType = {
      id: nanoid(),
      title: "New Partnership",
      body: "Describe this partnership type.",
    };
    onChange({ ...draft, partnershipTypes: [...draft.partnershipTypes, pt] });
  };
  const removePType = (id: string) =>
    onChange({
      ...draft,
      partnershipTypes: draft.partnershipTypes.filter((pt) => pt.id !== id),
    });
  const updatePType = (id: string, key: keyof PartnershipType, val: string) =>
    onChange({
      ...draft,
      partnershipTypes: draft.partnershipTypes.map((pt) =>
        pt.id === id ? { ...pt, [key]: val } : pt,
      ),
    });

  const uploadPartnerLogo = async (partnerId: string, file: File) => {
    setUploadingPartnerId(partnerId);
    setUploadErrorByPartner((prev) => {
      const next = { ...prev };
      delete next[partnerId];
      return next;
    });

    const { url, error } = await uploadAboutImageAsset(file, "partner");
    setUploadingPartnerId(null);

    if (error || !url) {
      setUploadErrorByPartner((prev) => ({
        ...prev,
        [partnerId]: error || "Logo upload failed.",
      }));
      return;
    }

    updatePartner(partnerId, "logo", url);
  };

  return (
    <div className="space-y-5">
      {/* Partners list */}
      <div className="space-y-3">
        <p
          className="px-1 text-xs font-bold uppercase tracking-wide"
          style={{ color: "var(--muted)" }}
        >
          Current partners
        </p>
        {draft.partners.map((p) => (
          <div
            key={p.id}
            className="space-y-2 rounded-2xl border p-4"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            <div className="flex items-center justify-between">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.logo}
                alt={p.name}
                className="h-10 w-10 rounded-xl object-cover"
              />
              <button
                onClick={() => removePartner(p.id)}
                style={{ color: "#ef4444" }}
              >
                <Trash2 size={15} />
              </button>
            </div>
            <Field
              label="Organisation name"
              value={p.name}
              onChange={(v) => updatePartner(p.id, "name", v)}
            />
            <Field
              label="Partnership type"
              value={p.kind}
              onChange={(v) => updatePartner(p.id, "kind", v)}
            />
            <Field
              label="Logo URL"
              value={p.logo}
              onChange={(v) => updatePartner(p.id, "logo", v)}
            />
            <div className="space-y-1">
              <label
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--muted)" }}
              >
                Upload logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    void uploadPartnerLogo(p.id, file);
                  }
                  event.currentTarget.value = "";
                }}
                className="w-full rounded-xl border px-3 py-2 text-sm"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--background)",
                  color: "var(--foreground)",
                }}
              />
              {uploadingPartnerId === p.id ? (
                <p className="text-[11px]" style={{ color: "var(--muted)" }}>
                  Uploading logo...
                </p>
              ) : null}
              {uploadErrorByPartner[p.id] ? (
                <p className="text-[11px]" style={{ color: "#ef4444" }}>
                  {uploadErrorByPartner[p.id]}
                </p>
              ) : null}
            </div>
          </div>
        ))}
        <button
          onClick={addPartner}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-3 text-sm font-semibold"
          style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
        >
          <Plus size={14} /> Add partner
        </button>
      </div>

      {/* Partnership types */}
      <div className="space-y-3">
        <p
          className="px-1 text-xs font-bold uppercase tracking-wide"
          style={{ color: "var(--muted)" }}
        >
          Partnership types (ways to partner)
        </p>
        {draft.partnershipTypes.map((pt) => (
          <div
            key={pt.id}
            className="space-y-2 rounded-2xl border p-4"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            <div className="flex items-center justify-end">
              <button
                onClick={() => removePType(pt.id)}
                style={{ color: "#ef4444" }}
              >
                <Trash2 size={15} />
              </button>
            </div>
            <Field
              label="Title"
              value={pt.title}
              onChange={(v) => updatePType(pt.id, "title", v)}
            />
            <Field
              label="Description"
              value={pt.body}
              onChange={(v) => updatePType(pt.id, "body", v)}
              multiline
            />
          </div>
        ))}
        <button
          onClick={addPType}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-3 text-sm font-semibold"
          style={{ borderColor: "var(--primary-mid)", color: "var(--primary)" }}
        >
          <Plus size={14} /> Add partnership type
        </button>
      </div>

      <SaveBar
        saved={saved}
        onSave={async () => {
          await update(draft);
          flash();
        }}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const sections = [
  { id: "hero", label: "Hero & Pillars" },
  { id: "team", label: "Team" },
  { id: "gallery", label: "Gallery" },
  { id: "partners", label: "Partners" },
] as const;

type SectionId = (typeof sections)[number]["id"];

export default function AdminAboutPage() {
  const { user, isLoading } = useCurrentUser();
  const isAdmin = user?.role === "admin";
  const { data, reset, saveError } = useAbout();
  const [active, setActive] = useState<SectionId>("hero");
  const [draft, setDraft] = useState(data);

  // Keep draft in sync when context changes externally (e.g. on first hydration)
  useEffect(() => {
    setDraft(data);
  }, [data]);

  if (isLoading) {
    return (
      <MobileShell title="Edit About Page" subtitle="Checking access">
        <div
          className="px-4 py-8 text-center text-sm"
          style={{ color: "var(--muted)" }}
        >
          Loading your account...
        </div>
      </MobileShell>
    );
  }

  if (!isAdmin) {
    return (
      <MobileShell title="Access Denied" subtitle="Admin only">
        <div
          className="px-4 py-8 text-center text-sm"
          style={{ color: "var(--muted)" }}
        >
          You need admin privileges to edit the About page.
          <br />
          <Link
            href="/profile"
            className="mt-2 block font-semibold underline"
            style={{ color: "var(--primary)" }}
          >
            Go to Profile
          </Link>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell
      title="Edit About Page"
      subtitle="Changes are saved per section"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-1">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-sm font-medium"
          style={{ color: "var(--primary)" }}
        >
          <ChevronLeft size={16} /> Admin
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/about"
            className="rounded-full border px-3 py-1 text-xs font-semibold"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            Preview
          </Link>
          <button
            onClick={async () => {
              if (confirm("Reset all About page content to defaults?")) {
                await reset();
              }
            }}
            className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold"
            style={{ borderColor: "#ef4444", color: "#ef4444" }}
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>
      </div>

      {/* Section tabs */}
      <div className="overflow-x-auto scrollbar-none">
        <div className="flex gap-1 px-4 pb-1 pt-2">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                active === s.id ? "shadow-sm" : "opacity-60",
              )}
              style={
                active === s.id
                  ? { background: "var(--primary)", color: "var(--primary-fg)" }
                  : {
                      background: "var(--card)",
                      color: "var(--foreground)",
                      border: "1px solid var(--border)",
                    }
              }
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active editor */}
      <div className="px-4 py-2">
        {saveError ? (
          <div
            className="mb-3 rounded-xl border px-3 py-2 text-xs"
            style={{ borderColor: "#ef4444", color: "#ef4444" }}
          >
            Save failed: {saveError}
          </div>
        ) : null}
        {active === "hero" && <HeroEditor draft={draft} onChange={setDraft} />}
        {active === "team" && <TeamEditor draft={draft} onChange={setDraft} />}
        {active === "gallery" && (
          <GalleryEditor draft={draft} onChange={setDraft} />
        )}
        {active === "partners" && (
          <PartnersEditor draft={draft} onChange={setDraft} />
        )}
      </div>
    </MobileShell>
  );
}
