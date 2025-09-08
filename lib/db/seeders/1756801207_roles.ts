import { roles } from "../schemas";
import { db } from "../../../config/db";

export async function up() {
  const data: any[] = [
    { name: "admin" },
    { name: "team lead" },
    { name: "consultant" },
    { name: "project coordinator" },
  ];

  await db.insert(roles).values(data);
}

export async function down() {
  await db.delete(roles);
}
