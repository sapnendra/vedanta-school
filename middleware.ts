import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPath = pathname === "/admin/login";

  if (pathname.startsWith("/api/payment")) {
    // Payment routes: add security headers
    const response = NextResponse.next();
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    // IMPORTANT: /api/payment/webhook must NOT be protected by admin JWT
    // Razorpay calls it directly - it has its own HMAC signature verification
    if (pathname === "/api/payment/webhook") {
      return response; // Let it through - webhook has its own security
    }

    return response;
  }

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
  matcher: ["/admin/:path*", "/api/payment/:path*"],
};
