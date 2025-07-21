'use server';

import { db } from 'db';
import { users } from 'db/schema';
import bcrypt from 'bcryptjs';

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  const hashed = await bcrypt.hash(data.password, 10);

  await db.insert(users).values({
    name: data.name,
    email: data.email,
    password: hashed,
    role: data.role,
  });
}
