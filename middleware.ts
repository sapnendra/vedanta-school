import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPath = pathname === "/admin/login";

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin-token")?.value;

  if (!token && !isLoginPath) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (!token) {
    return NextResponse.next();
  }

  const payload = await verifyToken(token);

  if (!payload) {
    if (isLoginPath) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLoginPath) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
