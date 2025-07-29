import { getCurrentUser } from "lib/auth";
import { db } from "db";
import { users } from "db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // pastikan sudah di-install

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    team: user.team,
    avatarUrl: user.avatarUrl,
  });
}

export async function POST(req: Request) {
  const sessionUser = await getCurrentUser();

  if (!sessionUser) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const {
    name,
    email,
    avatarUrl,
    currentPassword,
    newPassword,
    confirmPassword,
  } = await req.json();

  try {
    // Update profil dasar
    await db
      .update(users)
      .set({
        name,
        email,
        avatarUrl,
      })
      .where(eq(users.id, sessionUser.id));

    // Update password hanya jika semua field terkait terisi
    if (currentPassword && newPassword && confirmPassword) {
      if (newPassword !== confirmPassword) {
        return NextResponse.json(
          { message: "New passwords do not match" },
          { status: 400 }
        );
      }

      // Ambil password lama dari DB
      const userFromDb = await db
        .select({ password: users.password })
        .from(users)
        .where(eq(users.id, sessionUser.id))
        .then((res) => res[0]);

      const isMatch = await bcrypt.compare(
        currentPassword,
        userFromDb.password
      );

      if (!isMatch) {
        return NextResponse.json(
          { message: "Current password is incorrect" },
          { status: 401 }
        );
      }

      const hashed = await bcrypt.hash(newPassword, 10);

      await db
        .update(users)
        .set({ password: hashed })
        .where(eq(users.id, sessionUser.id));
    }

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ message: "Failed to update profile" }, { status: 500 });
  }
}
