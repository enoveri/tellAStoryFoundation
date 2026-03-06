import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { defaultAboutData, type AboutData } from "@/lib/about-store";

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

export async function loadAboutDataServer(): Promise<AboutData> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: aboutPage } = await supabase
      .from("about_page")
      .select("id, hero_title, hero_subtitle")
      .limit(1)
      .maybeSingle<AboutPageRow>();

    if (!aboutPage) {
      return defaultAboutData;
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

    return mergeAboutRows({
      aboutPage,
      pillars: pillarsRes.data || null,
      team: teamRes.data || null,
      gallery: galleryRes.data || null,
      partners: partnersRes.data || null,
      partnershipTypes: partnershipTypesRes.data || null,
    });
  } catch {
    return defaultAboutData;
  }
}
