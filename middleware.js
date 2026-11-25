import { NextResponse } from "next/server";

// The admin panel lives on its own domain. ADMIN_HOST (Vercel env var) can override it.
// /admin always keeps working on localhost for development.
const ADMIN_HOST = (process.env.ADMIN_HOST || "ayesh-eshani-admin.vercel.app").toLowerCase();

export function middleware(req) {
  if (!ADMIN_HOST) return NextResponse.next();

  const host = (req.headers.get("host") || "").toLowerCase().split(":")[0];
  const { pathname } = req.nextUrl;
  const isLocal = host === "localhost" || host === "127.0.0.1";

  if (host === ADMIN_HOST) {
    // admin domain: "/" shows the admin panel, invitation pages are not served here
    if (pathname === "/" ) return NextResponse.rewrite(new URL("/admin", req.url));
    if (pathname === "/admin") return NextResponse.redirect(new URL("/", req.url));
    if (pathname.startsWith("/day")) return NextResponse.rewrite(new URL("/404", req.url));
    return NextResponse.next();
  }

  // any other domain: hide the admin panel
  if (!isLocal && pathname.startsWith("/admin")) {
    return NextResponse.rewrite(new URL("/404", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|favicon.ico|.*\\.(?:jpg|jpeg|png|svg|webp|mp3|ico)$).*)"],
};
