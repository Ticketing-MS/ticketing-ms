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

    // Set cookie user
    (await
      // Set cookie user
      cookies()).set(
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
        maxAge: 300, 
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
