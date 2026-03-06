import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Pillar = { title: string; body: string };

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  img: string;
};

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
    {
      id: "tm1",
      name: "Amara Nwosu",
      role: "Founder & Executive Director",
      img: "https://i.pravatar.cc/150?img=47",
    },
    {
      id: "tm2",
      name: "Kelvin Osei",
      role: "Head of Community",
      img: "https://i.pravatar.cc/150?img=12",
    },
    {
      id: "tm3",
      name: "Maya Patel",
      role: "Content & Blog Lead",
      img: "https://i.pravatar.cc/150?img=32",
    },
  ],
  gallery: [
    {
      id: "g1",
      src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop",
      alt: "Community gathering",
    },
    {
      id: "g2",
      src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop",
      alt: "Children reading",
    },
    {
      id: "g3",
      src: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=300&fit=crop",
      alt: "Workshop session",
    },
    {
      id: "g4",
      src: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop",
      alt: "Story circle",
    },
    {
      id: "g5",
      src: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400&h=300&fit=crop",
      alt: "Outdoor event",
    },
    {
      id: "g6",
      src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop",
      alt: "Safe space workshop",
    },
  ],
  partners: [
    {
      id: "p1",
      name: "Ubuntu Education Fund",
      kind: "NGO Partner",
      logo: "https://i.pravatar.cc/80?img=1",
    },
    {
      id: "p2",
      name: "Africa Storytelling Lab",
      kind: "Creative Partner",
      logo: "https://i.pravatar.cc/80?img=2",
    },
    {
      id: "p3",
      name: "Youth Voices Initiative",
      kind: "Community Partner",
      logo: "https://i.pravatar.cc/80?img=3",
    },
    {
      id: "p4",
      name: "Healing Words Trust",
      kind: "Wellness Partner",
      logo: "https://i.pravatar.cc/80?img=4",
    },
  ],
  partnershipTypes: [
    {
      id: "pt1",
      title: "NGO & Community",
      body: "Co-host story circles, workshops, and safe-space events in your community.",
    },
    {
      id: "pt2",
      title: "Corporate Sponsor",
      body: "Fund programmes, sponsor events, and align your brand with human-centred storytelling.",
    },
    {
      id: "pt3",
      title: "Academic Partner",
      body: "Collaborate on research, curriculum, and storytelling-as-therapy programmes.",
    },
    {
      id: "pt4",
      title: "Media & Content",
      body: "Amplify our stories through your platforms and reach wider audiences together.",
    },
  ],
};

// ─── Supabase helpers ─────────────────────────────────────────────────────────

type AboutPageRow = {
  id: string;
  hero_title: string;
  hero_subtitle: string;
};

type AboutPillarRow = {
  id: string;
  title: string;
  body: string;
};

type AboutTeamRow = {
  id: string;
  name: string;
  role_title: string;
  avatar_url: string | null;
};

type AboutGalleryRow = {
  id: string;
  image_url: string;
  alt_text: string | null;
};

type AboutPartnerRow = {
  id: string;
  name: string;
  kind: string | null;
  logo_url: string | null;
};

type AboutPartnershipTypeRow = {
  id: string;
  title: string;
  body: string;
};

const STORAGE_KEY = "tas_about_data";

function saveLocalFallback(data: AboutData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadLocalFallback() {
  if (typeof window === "undefined") return defaultAboutData;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AboutData) : defaultAboutData;
  } catch {
    return defaultAboutData;
  }
}

function mergeAboutRows(input: {
  aboutPage: AboutPageRow;
  pillars: AboutPillarRow[] | null;
  team: AboutTeamRow[] | null;
  gallery: AboutGalleryRow[] | null;
  partners: AboutPartnerRow[] | null;
  partnershipTypes: AboutPartnershipTypeRow[] | null;
}): AboutData {
  return {
    heroTitle: input.aboutPage.hero_title,
    heroSubtitle: input.aboutPage.hero_subtitle,
    pillars:
      input.pillars?.map((p) => ({ title: p.title, body: p.body })) ??
      defaultAboutData.pillars,
    team:
      input.team?.map((m) => ({
        id: m.id,
        name: m.name,
        role: m.role_title,
        img: m.avatar_url || "",
      })) ?? defaultAboutData.team,
    gallery:
      input.gallery?.map((g) => ({
        id: g.id,
        src: g.image_url,
        alt: g.alt_text || "Gallery image",
      })) ?? defaultAboutData.gallery,
    partners:
      input.partners?.map((p) => ({
        id: p.id,
        name: p.name,
        kind: p.kind || "Partner",
        logo: p.logo_url || "",
      })) ?? defaultAboutData.partners,
    partnershipTypes:
      input.partnershipTypes?.map((pt) => ({
        id: pt.id,
        title: pt.title,
        body: pt.body,
      })) ?? defaultAboutData.partnershipTypes,
  };
}

export async function loadAboutData(): Promise<AboutData> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data: aboutPage } = await supabase
      .from("about_page")
      .select("id, hero_title, hero_subtitle")
      .limit(1)
      .maybeSingle<AboutPageRow>();

    if (!aboutPage) {
      return loadLocalFallback();
    }

    const [pillarsRes, teamRes, galleryRes, partnersRes, partnershipTypesRes] =
      await Promise.all([
        supabase
          .from("about_pillars")
          .select("id, title, body")
          .eq("about_page_id", aboutPage.id)
          .order("sort_order", { ascending: true })
          .returns<AboutPillarRow[]>(),
        supabase
          .from("about_team_members")
          .select("id, name, role_title, avatar_url")
          .eq("about_page_id", aboutPage.id)
          .order("sort_order", { ascending: true })
          .returns<AboutTeamRow[]>(),
        supabase
          .from("about_gallery_assets")
          .select("id, image_url, alt_text")
          .eq("about_page_id", aboutPage.id)
          .order("sort_order", { ascending: true })
          .returns<AboutGalleryRow[]>(),
        supabase
          .from("about_partners")
          .select("id, name, kind, logo_url")
          .eq("about_page_id", aboutPage.id)
          .order("sort_order", { ascending: true })
          .returns<AboutPartnerRow[]>(),
        supabase
          .from("about_partnership_types")
          .select("id, title, body")
          .eq("about_page_id", aboutPage.id)
          .order("sort_order", { ascending: true })
          .returns<AboutPartnershipTypeRow[]>(),
      ]);

    const merged = mergeAboutRows({
      aboutPage,
      pillars: pillarsRes.data || null,
      team: teamRes.data || null,
      gallery: galleryRes.data || null,
      partners: partnersRes.data || null,
      partnershipTypes: partnershipTypesRes.data || null,
    });

    saveLocalFallback(merged);
    return merged;
  } catch {
    return loadLocalFallback();
  }
}

export async function saveAboutData(data: AboutData): Promise<void> {
  const supabase = createSupabaseBrowserClient();

  const { data: page } = await supabase
    .from("about_page")
    .select("id")
    .limit(1)
    .maybeSingle<{ id: string }>();

  let pageId = page?.id;

  if (!pageId) {
    const { data: inserted, error } = await supabase
      .from("about_page")
      .insert({
        hero_title: data.heroTitle,
        hero_subtitle: data.heroSubtitle,
      })
      .select("id")
      .single<{ id: string }>();

    if (error || !inserted) {
      throw new Error(error?.message || "Failed to create About page");
    }

    pageId = inserted.id;
  } else {
    const { error } = await supabase
      .from("about_page")
      .update({ hero_title: data.heroTitle, hero_subtitle: data.heroSubtitle })
      .eq("id", pageId);

    if (error) {
      throw new Error(error.message);
    }
  }

  const persistList = async <T extends Record<string, unknown>>(
    table: string,
    rows: T[],
  ) => {
    const { error: deleteError } = await supabase
      .from(table)
      .delete()
      .eq("about_page_id", pageId);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    if (rows.length === 0) {
      return;
    }

    const { error: insertError } = await supabase.from(table).insert(rows);

    if (insertError) {
      throw new Error(insertError.message);
    }
  };

  await persistList(
    "about_pillars",
    data.pillars.map((p, index) => ({
      about_page_id: pageId,
      title: p.title,
      body: p.body,
      sort_order: index + 1,
    })),
  );

  await persistList(
    "about_team_members",
    data.team.map((m, index) => ({
      about_page_id: pageId,
      name: m.name,
      role_title: m.role,
      avatar_url: m.img || null,
      sort_order: index + 1,
    })),
  );

  await persistList(
    "about_gallery_assets",
    data.gallery.map((g, index) => ({
      about_page_id: pageId,
      image_url: g.src,
      alt_text: g.alt,
      sort_order: index + 1,
    })),
  );

  await persistList(
    "about_partners",
    data.partners.map((p, index) => ({
      about_page_id: pageId,
      name: p.name,
      kind: p.kind,
      logo_url: p.logo || null,
      sort_order: index + 1,
    })),
  );

  await persistList(
    "about_partnership_types",
    data.partnershipTypes.map((pt, index) => ({
      about_page_id: pageId,
      title: pt.title,
      body: pt.body,
      sort_order: index + 1,
    })),
  );

  saveLocalFallback(data);
}
