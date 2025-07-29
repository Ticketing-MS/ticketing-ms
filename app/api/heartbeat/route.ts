// /app/api/heartbeat/route.ts
import { NextResponse } from "next/server";
import { db } from "db";
import { users } from "db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function POST() {
  const userId = (await cookies()).get("user_id")?.value;
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await db
    .update(users)
    .set({ lastLoginAt: new Date() })
    .where(eq(users.id, userId));

  return NextResponse.json({ message: "Heartbeat updated" });
}
