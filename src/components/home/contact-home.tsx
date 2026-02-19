import { Mail, Instagram, Twitter, Facebook } from "lucide-react";

const socials = [
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/tellastory", color: "hover:text-pink-500" },
  { icon: Twitter,   label: "Twitter/X", href: "https://twitter.com/tellastory",   color: "hover:text-sky-500" },
  { icon: Facebook,  label: "Facebook",  href: "https://facebook.com/tellastory",  color: "hover:text-blue-600" },
];

export function ContactHome() {
  return (
    <section className="mx-4 mb-2 overflow-hidden rounded-3xl bg-gradient-to-br from-sky-700 to-sky-900 text-white shadow-lg">
      {/* Top */}
      <div className="space-y-2 px-5 pt-6 pb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-sky-300">Get involved</p>
        <h2 className="text-xl font-bold leading-snug">Ready to share your story?</h2>
        <p className="text-sm leading-relaxed text-sky-100">
          Whether you want to write, volunteer, partner, or just say hello — we would love to hear from you.
        </p>
      </div>

      {/* CTA buttons */}
      <div className="flex gap-2 px-5 pb-5">
        <a
          href="mailto:hello@tellastory.org"
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white py-2 text-sm font-semibold text-sky-800 shadow-sm transition hover:bg-sky-50"
        >
          <Mail size={14} />
          Email us
        </a>
        <a
          href="/write"
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
        >
          Write a story
        </a>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10 mx-5" />

      {/* Socials */}
      <div className="flex items-center gap-4 px-5 py-4">
        <span className="text-xs text-sky-300">Follow us</span>
        {socials.map(({ icon: Icon, label, href, color }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={`text-sky-200 transition ${color}`}
          >
            <Icon size={18} />
          </a>
        ))}
      </div>
    </section>
  );
}
