import { db } from 'db';
import { eq } from 'drizzle-orm';
import { users } from 'db/schema';
import { compare, hash } from 'bcryptjs';

export async function loginUser(email: string, password: string) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .then(res => res[0]);

  console.log('User found:', user);

  if (!user) return null;

  const isMatch = await compare(password, user.password);
  console.log('Password match:', isMatch);

  if (!isMatch) return null;

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
  // Cek user sudah ada atau belum
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
    })
    .returning();

  return newUser;
}
