import { NextResponse, type NextRequest } from "next/server";

// Only the real domain should appear in Google. Previews (jhajjz.vercel.app, branch deploys, localhost)
// get "noindex" so they never compete with jhajjz.in. Nothing to change at launch: once the domain points
// here, its pages are indexable automatically.
const liveHosts = new Set(["www.jhajjz.in", "jhajjz.in"]);

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const host = (request.headers.get("host") ?? "").split(":")[0];
  if (!liveHosts.has(host)) response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  // Pages only: skip Next's assets and any file with an extension (images, icons, robots.txt, sitemap.xml).
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
