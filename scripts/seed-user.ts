// scripts/seed-user.ts
import { db } from 'db';
import { users } from 'db/schema';
import bcrypt from 'bcryptjs';

async function seed() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  await db.insert(users).values({
    name: 'Admin Awal',
    email: 'admin@example.com',
    password: hashedPassword,
    role: 'admin',
  });

  console.log('✅ User berhasil dibuat!');
}

seed().catch((err) => {
  console.error('❌ Gagal membuat user:', err);
});
