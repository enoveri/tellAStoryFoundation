import {
  Mail,
  MessageCircle,
  Instagram,
  Twitter,
  Facebook,
} from "lucide-react";

const socials = [
  {
    icon: Instagram,
    label: "Instagram",
    href: "https://instagram.com/tellastory",
  },
  { icon: Twitter, label: "Twitter/X", href: "https://twitter.com/tellastory" },
  {
    icon: Facebook,
    label: "Facebook",
    href: "https://facebook.com/tellastory",
  },
];

export function ContactHome() {
  return (
    <section
      className="mx-4 mb-2 overflow-hidden rounded-3xl shadow-lg"
      style={{ background: "var(--inverse)" }}
    >
      {/* Top */}
      <div className="space-y-2 px-5 pt-6 pb-4">
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "var(--primary-mid)" }}
        >
          Get involved
        </p>
        <h2
          className="text-xl font-bold leading-snug"
          style={{ color: "var(--inverse-fg)" }}
        >
          We&rsquo;d love to hear from you.
        </h2>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--inverse-muted)" }}
        >
          Whether you want to write, volunteer, partner, or just say hello — we
          would love to hear from you.
        </p>
      </div>

      {/* CTA buttons */}
      <div className="flex gap-2 px-5 pb-5">
        <a
          href="mailto:hello@tellastory.org"
          className="flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold shadow-sm transition"
          style={{ background: "var(--inverse-fg)", color: "var(--inverse)" }}
        >
          <Mail size={14} />
          Email us
        </a>
        <a
          href="https://wa.me/256700277374"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 py-2.5 text-sm font-semibold transition"
          style={{
            borderColor: "var(--inverse-border)",
            color: "var(--inverse-fg)",
          }}
        >
          <MessageCircle size={14} />
          WhatsApp us
        </a>
      </div>

      {/* Divider */}
      <div
        className="mx-5"
        style={{ borderTop: "1px solid var(--inverse-border)" }}
      />

      {/* Socials */}
      <div className="flex items-center gap-4 px-5 py-4">
        <span
          className="text-xs font-semibold"
          style={{ color: "var(--inverse-muted)" }}
        >
          Follow us
        </span>
        {socials.map(({ icon: Icon, label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="transition hover:opacity-100"
            style={{ color: "var(--inverse-muted)" }}
          >
            <Icon size={20} />
          </a>
        ))}
      </div>
    </section>
  );
}
