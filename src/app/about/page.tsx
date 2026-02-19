import { Heart, Users, BookOpen, Globe } from "lucide-react";
import { MobileShell } from "@/components/shared/mobile-shell";

const pillars = [
  {
    icon: Heart,
    title: "Our Mission",
    body: "Tell A Story Foundation creates safe spaces where individuals share their lived experiences — turning personal journeys into community power.",
  },
  {
    icon: Users,
    title: "Community First",
    body: "We believe every voice matters. Our platform connects storytellers across communities, fostering empathy, healing, and mutual support.",
  },
  {
    icon: BookOpen,
    title: "Story as Tool",
    body: "We use storytelling as a tool for advocacy, mental health, and social change — because stories shift hearts before systems do.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    body: "Operating from Africa and reaching the world, we amplify voices that are rarely heard and celebrate the diversity of human experience.",
  },
];

const team = [
  { name: "Amara Nwosu", role: "Founder & Executive Director", img: "https://i.pravatar.cc/150?img=47" },
  { name: "Kelvin Osei", role: "Head of Community", img: "https://i.pravatar.cc/150?img=12" },
  { name: "Maya Patel", role: "Content & Blog Lead", img: "https://i.pravatar.cc/150?img=32" },
];

export default function AboutPage() {
  return (
    <MobileShell title="About Us" subtitle="Tell A Story Foundation">
      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-100 via-cyan-50 to-white px-5 py-8 text-center">
        <span className="mb-3 inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-700">
          Who we are
        </span>
        <h2 className="mb-3 text-2xl font-bold leading-snug text-[color:var(--foreground)]">
          Creating Change Through Stories
        </h2>
        <p className="mx-auto max-w-xs text-sm text-[color:var(--muted)]">
          A non-profit on a mission to use the power of storytelling to inspire, heal, and transform communities everywhere.
        </p>
      </section>

      {/* Pillars */}
      <section className="space-y-3 px-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--muted)]">What we stand for</h3>
        {pillars.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex gap-4 rounded-2xl border border-sky-100 bg-[color:var(--card)] p-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100">
              <Icon size={18} className="text-sky-700" />
            </div>
            <div>
              <p className="mb-1 text-sm font-semibold text-[color:var(--foreground)]">{title}</p>
              <p className="text-xs leading-relaxed text-[color:var(--muted)]">{body}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Team */}
      <section className="space-y-3 px-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--muted)]">Meet the team</h3>
        <div className="grid grid-cols-3 gap-3">
          {team.map(({ name, role, img }) => (
            <div key={name} className="flex flex-col items-center gap-2 rounded-2xl border border-sky-100 bg-[color:var(--card)] p-3 text-center shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={name} className="h-14 w-14 rounded-full border-2 border-sky-200 object-cover" />
              <p className="text-xs font-semibold leading-tight text-[color:var(--foreground)]">{name}</p>
              <p className="text-[10px] leading-tight text-[color:var(--muted)]">{role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="mx-4 mb-4 rounded-2xl bg-sky-700 px-5 py-6 text-center text-white shadow-md">
        <p className="mb-1 text-base font-bold">Get in touch</p>
        <p className="mb-4 text-sm text-sky-100">Partner with us, share your story, or support our mission.</p>
        <a
          href="mailto:hello@tellastory.org"
          className="inline-block rounded-full bg-white px-5 py-2 text-sm font-semibold text-sky-700 shadow-sm transition hover:bg-sky-50"
        >
          hello@tellastory.org
        </a>
      </section>
    </MobileShell>
  );
}
