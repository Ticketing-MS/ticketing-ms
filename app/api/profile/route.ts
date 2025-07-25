import { getCurrentUser, updateProfile } from "lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email } = body;

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const result = await updateProfile(currentUser.id, { name, email });
    return new Response(JSON.stringify({ success: true, user: result }), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return new Response(
      JSON.stringify({ message: "Failed to update user" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
