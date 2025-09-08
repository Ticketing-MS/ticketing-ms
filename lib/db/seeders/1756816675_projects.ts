import { db } from "../../../config/db";
import { teams, users, projects } from "../schemas";
import { Team, User } from "../models";
import { fakerID_ID as faker } from "@faker-js/faker";
import { generateSlug } from "lib/utils/slug";
import { eq, not } from "drizzle-orm";

export async function up() {
  const teamData: Team[] = await db.query.teams.findMany({
    where: not(eq(teams.name, "Project Coordinator")),
  });
  const userData: User[] = await db.query.users.findMany({
    where: not(eq(users.name, "Admin")),
  });
  const data: any[] = [];

  for (const team of teamData) {
    for (let i = 0; i < 5; i++) {
      const projectName = faker.company.name();
      const tmpData = {
        teamId: team.id,
        name: projectName,
        slug: generateSlug(projectName),
        description: faker.company.catchPhrase(),
        createdBy: faker.helpers.arrayElement(userData).id,
      };

      data.push(tmpData);
    }
  }

  await db.insert(projects).values(data);
}

export async function down() {
  await db.delete(projects);
}
