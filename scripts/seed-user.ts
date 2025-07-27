const { db } = require("../db"); // perbaiki path sesuai strukturmu
const { users } = require("../db/schema");
const { eq } = require("drizzle-orm");
const bcrypt = require("bcryptjs");

async function seedAdmin() {
  const email = "admin@example.com";

  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length > 0) {
    console.log("Admin user already exists.");
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await db.insert(users).values({
    id: crypto.randomUUID(),
    name: "Super Admin",
    email,
    password: hashedPassword,
    role: "admin",
    isActive: true,
    team: ["cloud", "devops"],
  });

  console.log("✅ Admin user created:", email);
}

seedAdmin().then(() => process.exit(0));
