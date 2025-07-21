import { loginUser } from "lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const cleanEmail = email.trim().toLowerCase();

    const user = await loginUser(cleanEmail, password);

    if (!user) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401,
      });
    }

return new Response(JSON.stringify({
  email: user.email,
  name: user.name,
  role: user.role
}), {
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
