import { db } from "../../../config/db";
import { users, teams, usersToTeams } from "../schemas";
import { Team, User } from "lib/db/models";

function filterTeam(teamData: Team[], query: string) {
  return teamData.filter((team) => team.name === query)[0].id;
}

export async function up() {
  const userData: User[] = await db.select().from(users);
  const teamData: Team[] = await db.select().from(teams);

  const data: any[] = [];

  for (const user of userData) {
    switch (user.name) {
      case "Iqbal":
        data.push({
          userId: user.id,
          teamId: filterTeam(teamData, "DevOps"),
        });
        break;
      case "Faaiq":
        data.push({
          userId: user.id,
          teamId: filterTeam(teamData, "DevOps"),
        });
        break;
      case "Trias":
        data.push({ userId: user.id, teamId: filterTeam(teamData, "Cloud") });
        break;
      case "Mamat":
        data.push({ userId: user.id, teamId: filterTeam(teamData, "Cloud") });
        break;
      case "Imboy":
        data.push({ userId: user.id, teamId: filterTeam(teamData, "Cloud") });
        data.push({ userId: user.id, teamId: filterTeam(teamData, "DevOps") });
        break;
    }
  }

  await db.insert(usersToTeams).values(data);
}

export async function down() {
  await db.delete(usersToTeams);
}
