import { NextResponse } from "next/server";
import { db } from "db"; // Sesuaikan dengan path DB kamu
import { users } from "db/schema"; // Sesuaikan
import { eq } from "drizzle-orm";

export async function GET() {
  const allUsers = await db.select().from(users);
  return NextResponse.json(allUsers);
}

export async function POST(req: Request) {
  const { id, isActive } = await req.json();
  await db
    .update(users)
    .set({ isActive }) 
    .where(eq(users.id, id));
  return NextResponse.json({ message: "User updated" });
}