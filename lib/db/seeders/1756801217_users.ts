import { db } from "../../../config/db";
import { users, roles } from "../schemas";
import { Role } from "lib/db/models";
import { hashing } from "lib/utils/hashing";

export async function up() {
  const roleData: Role[] = await db.select().from(roles);

  const data: any[] = [
    {
      email: "admin@gmail.com",
      name: "Admin",
      password: await hashing("admin123"),
      roleId: roleData.filter((role) => role.name === "admin")[0].id,
    },
    {
      email: "iqbal@gmail.com",
      name: "Iqbal",
      password: await hashing("test123"),
      roleId: roleData.filter((role) => role.name === "consultant")[0].id,
    },
    {
      email: "trias@gmail.com",
      name: "Trias",
      password: await hashing("test123"),
      roleId: roleData.filter((role) => role.name === "consultant")[0].id,
    },
    {
      email: "faaiq@gmail.com",
      name: "Faaiq",
      password: await hashing("test123"),
      roleId: roleData.filter((role) => role.name === "consultant")[0].id,
    },
    {
      email: "mamat@gmail.com",
      name: "Mamat",
      password: await hashing("test123"),
      roleId: roleData.filter((role) => role.name === "consultant")[0].id,
    },
    {
      email: "imran@gmail.com",
      name: "Imboy",
      password: await hashing("test123"),
      roleId: roleData.filter((role) => role.name === "consultant")[0].id,
    },
  ];

  await db.insert(users).values(data);
}

export async function down() {
  await db.delete(users);
}
