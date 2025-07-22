import { db } from "db";
import { users } from "db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, context: { params: { id: string } }) {
  try {
    const { role } = await request.json();
    const { id } = await context.params; 
    const userId = Number(id);

    if (isNaN(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    if (!["admin", "cloud", "devops", "pm"].includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    await db.update(users).set({ role }).where(eq(users.id, userId));
    return NextResponse.json({ message: "Role updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}