import { loginUser } from "lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const cleanEmail = email.trim().toLowerCase();

    let user;
    try {
      user = await loginUser(cleanEmail, password);
    } catch (err: any) {
      if (err.message === "disabled") {
        return new Response(
          JSON.stringify({ message: "Your account has been disabled" }),
          { status: 403 }
        );
      }
      throw err;
    }

    if (!user) {
      return new Response(
        JSON.stringify({ message: "Invalid credentials" }),
        { status: 401 }
      );
    }

    (await cookies()).set(
      "user",
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      }),
      {
        httpOnly: false,
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      }
    );

    return new Response(
      JSON.stringify({
        email: user.email,
        name: user.name,
        role: user.role,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ message: "Something went wrong" }), {
      status: 500,
    });
  }
}
