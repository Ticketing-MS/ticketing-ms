import { db } from "../../../config/db";
import { teams } from "../schemas";

export async function up() {
  const data: any[] = [
    { name: "Cloud" },
    { name: "DevOps" },
    { name: "Database" },
    { name: "Middleware" },
    { name: "Security" },
    { name: "Infra" },
    { name: "Project Coordinator" },
  ];

  await db.insert(teams).values(data);
}

export async function down() {
  await db.delete(teams);
}
