import { db } from "../../../config/db";
import { User, Project, getUsersWithTeams } from "../models";
import { fakerID_ID as faker } from "@faker-js/faker";
import { projects, assignedToProjects } from "../schemas";

export async function up() {
  const projectsData: Project[] = await db.select().from(projects);
  const usersData: User[] = await getUsersWithTeams();
  const data: any[] = [];

  for (const project of projectsData) {
    const filtered = usersData.filter((user) =>
      user.teams?.some((team) => team.id === project.teamId)
    );

    if (filtered.length === 0) {
      continue;
    }

    data.push({
      projectId: project.id,
      userId: faker.helpers.arrayElement(filtered).id,
    });
  }

  await db.insert(assignedToProjects).values(data);
}

export async function down() {
  await db.delete(assignedToProjects);
}
