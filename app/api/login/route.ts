import { loginUser } from "lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const cleanEmail = email.trim().toLowerCase();

    const user = await loginUser(cleanEmail, password);

    if (!user) {
      return new Response(
        JSON.stringify({ message: "Invalid credentials" }),
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return new Response(
        JSON.stringify({ message: "Your account has been disabled" }),
        { status: 403 }
      );
    }

    if (user.role === "staff" && !user.team) {
      return new Response(
        JSON.stringify({ message: "Staff must be assigned to a team" }),
        { status: 400 }
      );
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      team: user.team,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
    };

    (await cookies()).set("user", JSON.stringify(userData), {
      httpOnly: false,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return new Response(JSON.stringify(userData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Something went wrong" }), {
      status: 500,
    });
  }
}
