// app/api/admin/users/[id]/team/route.ts
import { NextRequest } from "next/server";
import { db } from "db";
import { users } from "db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest, context: any) {
  const { params } = await Promise.resolve(context); // trick untuk hilangkan warning
  const userId = Number(params.id);

  const { team } = await req.json();

  if (!Array.isArray(team)) {
    return new Response(JSON.stringify({ message: "Invalid team format" }), { status: 400 });
  }

  await db.update(users).set({ team }).where(eq(users.id, userId));

  return new Response(JSON.stringify({ message: "Team updated" }), { status: 200 });
}
