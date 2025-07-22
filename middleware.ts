import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { protectedRoutes, roleRoutes } from "lib/routes";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userCookie = request.cookies.get("user")?.value;

  // Tidak ada cookie, redirect ke login
  if (!userCookie && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (userCookie) {
    try {
      const user = JSON.parse(decodeURIComponent(userCookie));

      // Cek kalau user nonaktif
      if (user.isActive === false) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // Cek role akses berdasarkan path
      for (const [role, allowedPaths] of Object.entries(roleRoutes)) {
        if (pathname.startsWith(`/${role}`) && user.role !== role) {
          return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
      }

    } catch (err) {
      console.error("Error parsing user cookie:", err);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// Terapkan middleware hanya pada route tertentu
export const config = {
  matcher: [
    "/admin/:path*",
    "/cloud/:path*",
    "/pm/:path*",
    "/devops/:path*",
  ],
};
