import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { protectedRoutes, roleRoutes } from "lib/routes";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userCookie = request.cookies.get("user")?.value;

  // ⛔ Redirect ke login kalau belum login & akses route terlindungi
  if (
    !userCookie &&
    protectedRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (userCookie) {
    try {
      const user = JSON.parse(decodeURIComponent(userCookie));

      // ⛔ User nonaktif
      if (user.isActive === false) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // ✅ Cek akses berdasarkan role atau team
      for (const [routeKey] of Object.entries(roleRoutes)) {
        if (pathname.startsWith(`/${routeKey}`)) {
          // admin dicek berdasarkan role
          if (routeKey === "admin" && user.role !== "admin") {
            return NextResponse.redirect(new URL("/login", request.url));
          }
          // team lainnya dicek berdasarkan team
          if (
            ["cloud", "pm", "devops"].includes(routeKey) &&
            user.team !== routeKey
          ) {
            return NextResponse.redirect(new URL("/login", request.url));
          }
        }
      }
    } catch (err) {
      console.error("Error parsing user cookie:", err);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/cloud/:path*", "/pm/:path*", "/devops/:path*"],
};
