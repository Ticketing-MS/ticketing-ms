import { NextRequest } from "next/server";
import { db } from "db";
import { users } from "db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest, context: any) {
  const { params } = await Promise.resolve(context);
  const userId = params.id;

  const { access } = await req.json();

  if (!Array.isArray(access)) {
    return new Response(JSON.stringify({ message: "Invalid access format" }), {
      status: 400,
    });
  }

  await db.update(users).set({ access }).where(eq(users.id, userId));

  return new Response(JSON.stringify({ message: "Access updated" }), {
    status: 200,
  });
}
