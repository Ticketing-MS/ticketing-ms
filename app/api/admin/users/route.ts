import { NextResponse } from "next/server";
import { db } from "db";
import { users } from "db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "lib/auth"; // Pastikan path sesuai

// =====================
// GET - Fetch all users
// =====================
export async function GET() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      team: users.team,
      access: users.access,
      isActive: users.isActive,
      lastLoginAt: users.lastLoginAt,
    })
    .from(users);

  return NextResponse.json(allUsers);
}

// ===========================
// POST - Toggle Active Status
// ===========================
export async function POST(req: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id, isActive } = await req.json();

  if (!id || typeof isActive !== "boolean") {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  await db.update(users).set({ isActive }).where(eq(users.id, id));

  return NextResponse.json({ message: "User updated" });
}
