import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAdminPage = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  if (isAdminPage && !isLoginPage && !request.cookies.get("gb_admin")) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLoginPage && request.cookies.get("gb_admin")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
