import { db } from "db";
import { users } from "db/schema";
import { eq } from "drizzle-orm";
import { compare, hash } from "bcryptjs";
import { cookies } from "next/headers";

// Fungsi Login
export async function loginUser(email: string, password: string) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .then((res) => res[0]);

  if (!user || !(await compare(password, user.password))) return null;
  if (!user.isActive) throw new Error("disabled");

  await db
    .update(users)
    .set({
      isActive: true,
      lastLoginAt: new Date(),
    })
    .where(eq(users.id, user.id));

  const updatedUser = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id))
    .then((res) => res[0]);

  (await cookies()).set("user_id", updatedUser.id);

  return {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    team: updatedUser.team,
    isActive: updatedUser.isActive,
    avatarUrl: updatedUser.avatarUrl,
    lastLoginAt: updatedUser.lastLoginAt?.toISOString() ?? null,
  };
}

// Ambil user dari cookies
export async function getCurrentUser() {
  const userId = (await cookies()).get("user_id")?.value;
  if (!userId) return null;

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .then((res) => res[0]);

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    team: user.team,
    avatarUrl: user.avatarUrl,
  };
}

// Register
type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role: string;
  team: string;
};

export async function registerUser({
  name,
  email,
  password,
  role,
  team,
}: RegisterInput) {
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .then((res) => res[0]);

  if (existing) throw new Error("User already exists");

  const hashedPassword = await hash(password, 10);

  const [newUser] = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
      role,
      team,
      isActive: true,
    })
    .returning();

  return newUser;
}

// Update profile
export async function updateProfile(
  userId: string,
  data: { name?: string; email?: string }
) {
  const [updateUser] = await db
    .update(users)
    .set({
      name: data.name,
      email: data.email,
    })
    .where(eq(users.id, userId))
    .returning();

  return updateUser;
}
