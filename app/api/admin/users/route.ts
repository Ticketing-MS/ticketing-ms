import { NextResponse } from "next/server";
import { db } from "db"; 
import { users } from "db/schema"; 
import { eq } from "drizzle-orm";

export async function GET() {
  const allUsers = await db.select().from(users);
  return NextResponse.json(allUsers);
}

export async function POST(req: Request) {
  try {
    const { id, isActive } = await req.json();

    const numericId = Number(id);
    if (isNaN(numericId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    await db
      .update(users)
      .set({ isActive }) 
      .where(eq(users.id, numericId));

    return NextResponse.json({ message: "User updated" });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}