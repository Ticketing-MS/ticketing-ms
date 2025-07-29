import { loginUser } from "lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const { token, user } = (await loginUser(email, password)) || {};

  if (!token || !user) {
    return new Response(JSON.stringify({ message: "Invalid credentials" }), {
      status: 401,
    });
  }

  cookies().set("token", token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });

  return Response.json({
    id: user.id,
    name: user.name,
    role: user.role,
    team: user.team,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt,
  });
}
