import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "db";
import { users } from "db/schema";
import { eq } from "drizzle-orm";

export async function POST() {
  const cookieStore = cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) {
    return NextResponse.json({ message: "No user logged in" }, { status: 400 });
  }

  // Set lastLoginAt ke null
  await db
    .update(users)
    .set({ lastLoginAt: null })
    .where(eq(users.id, userId));

  // Hapus cookie
  cookieStore.set("user_id", "", { maxAge: 0 });

  return NextResponse.json({ message: "Logged out successfully" });
}
