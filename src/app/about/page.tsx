import { AboutPageClient } from "@/components/about/about-page-client";
import { loadAboutDataServer } from "@/lib/about-store-server";

export default async function AboutPage() {
  const data = await loadAboutDataServer();
  return <AboutPageClient data={data} />;
}
