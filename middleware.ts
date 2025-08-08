// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const getJwtSecret = () => new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    const role = (payload.role as string)?.toLowerCase();
    const team = (payload.team as string)?.toLowerCase();

    const pathTeam = pathname.split("/")[1]; // cloud, pm, devops, etc.

    // ❌ Admin area check
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // ✅ Team-based access
    const teamRoutes = ["cloud", "pm", "devops"];
    if (teamRoutes.includes(pathTeam)) {
      if (role !== "staff" || team !== pathTeam) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    // ✅ Allow access
    return NextResponse.next();
  } catch (err) {
    // console.error("JWT verification failed:", err);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/cloud/:path*", "/pm/:path*", "/devops/:path*"],
};
