import { db } from "db";
import { users } from "db/schema";
import { eq } from "drizzle-orm";
import { compare, hash } from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET!;

// ===========================
// Login
// ===========================
export async function loginUser(email: string, password: string) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .then((res) => res[0]);

  if (!user || !(await compare(password, user.password))) return null;
  if (!user.isActive) throw new Error("disabled");

  // Update status login
  await db
    .update(users)
    .set({ isActive: true, lastLoginAt: new Date() })
    .where(eq(users.id, user.id));

  // Generate JWT
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      role: user.role,
      team: user.team,
    },
    secret,
    { expiresIn: "7d" }
  );

  return { token, user };
}

// ===========================
// getCurrentUser via JWT
// ===========================
export async function getCurrentUser() {
  const token = cookies().get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, secret);
    if (typeof decoded === "string") return null;
    return decoded; // contains id, name, role, team
  } catch {
    return null;
  }
}

// ===========================
// Register
// ===========================
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

// ===========================
// Update profile
// ===========================
export async function updateProfile(
  userId: string,
  data: { name?: string; email?: string }
) {
  const [updatedUser] = await db
    .update(users)
    .set({
      name: data.name,
      email: data.email,
    })
    .where(eq(users.id, userId))
    .returning();

  return updatedUser;
}
