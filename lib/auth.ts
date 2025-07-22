import { db } from "db";
import { users } from "db/schema";
import { eq } from "drizzle-orm";
import { compare, hash } from "bcryptjs";

export async function loginUser(email: string, password: string) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .then(res => res[0]);

  if (!user) return { error: "not_found" };
  if (!user.isActive) return { error: "disabled" };

  const isMatch = await compare(password, user.password);
  if (!isMatch) return { error: "not_found" };

  return user;
}

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role: string;
  access?: string[];
};

export async function registerUser({
  name,
  email,
  password,
  role,
  access = [],
}: RegisterInput) {
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .then(res => res[0]);

  if (existing) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hash(password, 10);

  const [newUser] = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
      role,
      access,
      isActive: true, // default aktif
    })
    .returning();

  return newUser;
}
