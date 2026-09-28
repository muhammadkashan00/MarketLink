import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-dev-secret-please-change-in-production"
);
const COOKIE_NAME = "marketlink_session";

const PROTECTED_ROUTES: Array<{ prefix: string; roles: string[] }> = [
  { prefix: "/customer", roles: ["CUSTOMER"] },
  { prefix: "/farmer", roles: ["FARMER"] },
  { prefix: "/admin", roles: ["ADMIN"] },
];

const AUTH_ROUTES = ["/login", "/register"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;

  let session: { role?: string; userId?: string } | null = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      session = payload as { role?: string; userId?: string };
    } catch {
      session = null;
    }
  }

  // Redirect logged-in users away from login/register
  if (AUTH_ROUTES.includes(pathname) && session) {
    const role = session.role;
    const dashboard =
      role === "CUSTOMER" ? "/customer" : role === "FARMER" ? "/farmer" : role === "ADMIN" ? "/admin" : "/";
    return NextResponse.redirect(new URL(dashboard, req.url));
  }

  // Protect role-based routes
  for (const route of PROTECTED_ROUTES) {
    if (pathname.startsWith(route.prefix)) {
      if (!session) {
        const url = new URL("/login", req.url);
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
      }
      if (session.role && !route.roles.includes(session.role)) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/customer/:path*", "/farmer/:path*", "/admin/:path*", "/login", "/register"],
};
