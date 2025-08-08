import { db } from "db";
import { users } from "db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentUser } from "lib/auth"; // ⬅️ sesuaikan path kamu

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

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

    const updatedUser = await db
      .update(users)
      .set({ role, team, access: role === "pm" ? [] : null }) // clear access if not PM
      .where(eq(users.id, userId))
      .returning();

    if (updatedUser.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Role updated successfully",
      user: updatedUser[0],
    });
  } catch (error) {
    console.error("PATCH /users/[id]/role error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
