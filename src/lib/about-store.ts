// ─── Types ────────────────────────────────────────────────────────────────────

export type Pillar = { title: string; body: string };

export type TeamMember = { id: string; name: string; role: string; img: string };

export type GalleryImage = { id: string; src: string; alt: string };

export type Partner = { id: string; name: string; kind: string; logo: string };

export type PartnershipType = { id: string; title: string; body: string };

export type AboutData = {
  heroTitle: string;
  heroSubtitle: string;
  pillars: Pillar[];
  team: TeamMember[];
  gallery: GalleryImage[];
  partners: Partner[];
  partnershipTypes: PartnershipType[];
};

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const defaultAboutData: AboutData = {
  heroTitle: "Creating Change Through Stories",
  heroSubtitle:
    "A non-profit using storytelling to inspire, heal, and transform communities everywhere.",
  pillars: [
    {
      title: "Our Mission",
      body: "Tell A Story Foundation creates safe spaces where individuals share their lived experiences — turning personal journeys into community power.",
    },
    {
      title: "Community First",
      body: "We believe every voice matters. Our platform connects storytellers across communities, fostering empathy, healing, and mutual support.",
    },
    {
      title: "Story as Tool",
      body: "We use storytelling as a tool for advocacy, mental health, and social change — because stories shift hearts before systems do.",
    },
    {
      title: "Global Reach",
      body: "Operating from Africa and reaching the world, we amplify voices that are rarely heard and celebrate the diversity of human experience.",
    },
  ],
  team: [
    { id: "tm1", name: "Amara Nwosu", role: "Founder & Executive Director", img: "https://i.pravatar.cc/150?img=47" },
    { id: "tm2", name: "Kelvin Osei",  role: "Head of Community",            img: "https://i.pravatar.cc/150?img=12" },
    { id: "tm3", name: "Maya Patel",   role: "Content & Blog Lead",          img: "https://i.pravatar.cc/150?img=32" },
  ],
  gallery: [
    { id: "g1", src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop", alt: "Community gathering" },
    { id: "g2", src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop", alt: "Children reading" },
    { id: "g3", src: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=300&fit=crop", alt: "Workshop session" },
    { id: "g4", src: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop", alt: "Story circle" },
    { id: "g5", src: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400&h=300&fit=crop", alt: "Outdoor event" },
    { id: "g6", src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop", alt: "Safe space workshop" },
  ],
  partners: [
    { id: "p1", name: "Ubuntu Education Fund",   kind: "NGO Partner",       logo: "https://i.pravatar.cc/80?img=1" },
    { id: "p2", name: "Africa Storytelling Lab",  kind: "Creative Partner",  logo: "https://i.pravatar.cc/80?img=2" },
    { id: "p3", name: "Youth Voices Initiative",  kind: "Community Partner", logo: "https://i.pravatar.cc/80?img=3" },
    { id: "p4", name: "Healing Words Trust",      kind: "Wellness Partner",  logo: "https://i.pravatar.cc/80?img=4" },
  ],
  partnershipTypes: [
    { id: "pt1", title: "NGO & Community",   body: "Co-host story circles, workshops, and safe-space events in your community." },
    { id: "pt2", title: "Corporate Sponsor", body: "Fund programmes, sponsor events, and align your brand with human-centred storytelling." },
    { id: "pt3", title: "Academic Partner",  body: "Collaborate on research, curriculum, and storytelling-as-therapy programmes." },
    { id: "pt4", title: "Media & Content",   body: "Amplify our stories through your platforms and reach wider audiences together." },
  ],
};

// ─── localStorage helpers ─────────────────────────────────────────────────────

const STORAGE_KEY = "tas_about_data";

export function loadAboutData(): AboutData {
  if (typeof window === "undefined") return defaultAboutData;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AboutData) : defaultAboutData;
  } catch {
    return defaultAboutData;
  }
}

export function saveAboutData(data: AboutData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
