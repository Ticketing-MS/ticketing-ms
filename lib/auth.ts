import { db } from "db";
import { users } from "db/schema";
import { eq } from "drizzle-orm";
import { compare, hash } from "bcryptjs";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

// ===========================
// Login
// ===========================
export async function loginUser(email: string, password: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user || !(await compare(password, user.password))) return null;
  if (!user.isActive) throw new Error("disabled");

  await db
    .update(users)
    .set({
      isActive: true,
      lastLoginAt: new Date(),
    })
    .where(eq(users.id, user.id));

  const token = await new SignJWT({
    team: user.team,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .setSubject(user.id)
    .sign(secret);

  return { token, user };
}

// ===========================
// getCurrentUser via JWT
// ===========================
export async function getCurrentUser() {
  const token = cookies().get("token")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.sub;
    if (!userId || typeof userId !== "string") return null;

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        name: true,
        email: true,
        role: true,
        team: true,
        avatarUrl: true,
        access: true,
      },
    });

    if (!user) return null;
    return user;
  } catch (err) {
    console.error("JWT verification error:", err);
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
  const defaultAvatar = "/avatarDefault.png";

  const [newUser] = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
      role,
      team,
      isActive: true,
      avatarUrl: defaultAvatar,
    })
    .returning();

  return newUser;
}

// ===========================
// Update profile
// ===========================
export async function updateProfile(
  userId: string,
  data: { name?: string; email?: string; avatarUrl?: string }
) {
  const [updatedUser] = await db
    .update(users)
    .set({
      name: data.name,
      email: data.email,
      avatarUrl: data.avatarUrl,
    })
    .where(eq(users.id, userId))
    .returning();

  return updatedUser;
}
