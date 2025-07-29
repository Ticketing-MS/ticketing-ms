import { NextResponse } from "next/server";
import { db } from "db";
import { users } from "db/schema";
import { eq } from "drizzle-orm";

// Ambil semua user dengan field yang dibutuhkan
export async function GET() {
  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      isActive: users.isActive,
      lastLoginAt: users.lastLoginAt,
    })
    .from(users);
      console.log("📦 allUsers:", allUsers); // ⬅️ Tambahkan ini untuk debug

  return NextResponse.json(allUsers);
}

// Update status aktif user (misalnya disable/enable akun)
export async function POST(req: Request) {
  const { id, isActive } = await req.json();

  if (!id || typeof isActive !== "boolean") {
    return NextResponse.json(
      { message: "Invalid payload" },
      { status: 400 }
    );
  }

  await db
    .update(users)
    .set({ isActive })
    .where(eq(users.id, id));

  return NextResponse.json({ message: "User updated" });
}
