import { db } from "db";
import { users } from "db/schema";
import { eq } from "drizzle-orm";
import { compare, hash } from "bcryptjs";
import { cookies } from "next/headers";



// Fungsi Login
export async function loginUser(email: string, password: string) {
  const user = await db.select().from(users).where(eq(users.email, email)).then(res => res[0]);
  if (!user || !await compare(password, user.password)) return null;
  if (!user.isActive) throw new Error("disabled");
  (await cookies()).set("user_id", user.id.toString());
  return user;
}

// Ambil user dari cookies
export async function getCurrentUser() {
  const userId = (await cookies()).get("user_id")?.value;
  if (!userId) return null;
  return db.select().from(users).where(eq(users.id, Number(userId))).then(res => res[0]);
}

// Fungsi Register
type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role: string;
  access?: string[];
};

// Register Users
export async function registerUser({ name, email, password, role, access = [] }: RegisterInput) {
  const existing = await db.select().from(users).where(eq(users.email, email)).then(res => res[0]);
  if (existing) throw new Error("User already exists");
  const hashedPassword = await hash(password, 10);
  const [newUser] = await db.insert(users).values({
    name, email, password: hashedPassword, role, access, isActive: true
  }).returning();
  return newUser;
}

// Update user
export async function updateProfile(userId: number, data: { name?: string; email?: string }) {
const [updateUser] = await db
  .update(users)
  .set({
    name: data.name,
    email: data.email
  })
  .where(eq(users.id, userId))
  .returning();
  return updateUser;
}
