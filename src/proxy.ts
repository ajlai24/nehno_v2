import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

export default async function proxy(req: NextRequest) {
  // If the requested path is `/about`, redirect to `/`
  if (req.nextUrl.pathname === "/about") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return createMiddleware(routing)(req);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(de|en)/:path*", "/((?!_next|_vercel|.*\\..*|api).*)"],
};
