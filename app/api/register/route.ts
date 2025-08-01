import { registerUser } from "lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role, team } = body;

    const result = await registerUser({ name, email, password, role, team });

    return new Response(JSON.stringify({ success: true, user: result }), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ message: "Failed to register user" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
