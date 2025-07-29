import { loginUser } from "lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const result = await loginUser(email, password);

    if (!result) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const { token, user } = result;

    // Set JWT as HttpOnly cookie
    cookies().set("token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    });

    // Return user data (tanpa token)
    return NextResponse.json({
      id: user.id,
      name: user.name,
      role: user.role,
      team: user.team,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
    });

  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
