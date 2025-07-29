import { db } from "db";
import { users } from "db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { role, team } = await request.json();

    const userId = params.id;
    const validRoles = ["admin", "staff"];
    const validTeams = ["cloud", "devops", "pm", "admin"];
  if (!validRoles.includes(role)) {
   return NextResponse.json({ message: "Invalid role" }, { status: 400 });
 }

 if (!validTeams.includes(team)) {
   return NextResponse.json({ message: "Invalid team" }, { status: 400 });
 }


    // Eksekusi update
    const updatedUser = await db
      .update(users)
      .set({ role, team })
      .where(eq(users.id, userId))
      .returning();

    if (updatedUser.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Role updated successfully",
      user: updatedUser[0]
    });
  } catch (error) {
    console.error("PATCH /users/[id]/role error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
