import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Decode payload (tanpa verify signature)
    const payload = JSON.parse(atob(token.split(".")[1]));
    const { role, team } = payload;

    // Admin check
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Staff (cloud, pm, devops) check
    const validTeams = ["cloud", "pm", "devops"];
    const currentTeam = pathname.split("/")[1];

    if (validTeams.includes(currentTeam)) {
      if (role !== "staff" || team !== currentTeam) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

  } catch (err) {
    console.error("JWT parse error:", err);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/cloud/:path*", "/pm/:path*", "/devops/:path*"],
};
