import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const getJwtSecret = () => new TextEncoder().encode(process.env.JWT_SECRET!); // jangan pakai NEXT_PUBLIC

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
    const currentTeam = pathname.split("/")[1];

    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const validTeams = ["cloud", "pm", "devops"];
    if (validTeams.includes(currentTeam)) {
      if (role !== "staff" || team !== currentTeam) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/cloud/:path*", "/pm/:path*", "/devops/:path*"],
};
