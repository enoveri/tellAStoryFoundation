import { NextRequest } from "next/server";

const FALLBACK_IMAGE = "https://tellastoryfoundation.org/TAS2.svg";

function isAllowedRemoteUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const src = request.nextUrl.searchParams.get("src") || FALLBACK_IMAGE;

  if (!isAllowedRemoteUrl(src)) {
    return new Response("Invalid image URL.", { status: 400 });
  }

  try {
    const upstream = await fetch(src, {
      headers: {
        "User-Agent": "TellAStory-OGProxy/1.0",
      },
      next: { revalidate: 60 * 60 },
    });

    if (!upstream.ok) {
      return new Response("Could not load source image.", { status: 502 });
    }

    const body = await upstream.arrayBuffer();
    const contentType = upstream.headers.get("content-type") || "image/jpeg";

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return new Response("Failed to proxy image.", { status: 500 });
  }
}
