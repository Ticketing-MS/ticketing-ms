// src/db/seed.ts
import { db } from './index';
import { users } from './schema';
import bcrypt from 'bcryptjs';

async function seed() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await db.insert(users).values({
    name: 'ias',
    email: 'iaszaen@gmail.com',
    password: hashedPassword,
    role: 'admin',
    phone: '081234567890',
  });

  console.log('✅ User admin berhasil ditambahkan.');
}

seed().catch((err) => {
  console.error('❌ Error saat menambahkan user:', err);
});
