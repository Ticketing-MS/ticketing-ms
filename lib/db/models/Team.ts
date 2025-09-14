import { db } from "config/db";
import { and, eq } from "drizzle-orm";
import { usersToTeams } from "../schemas";

export interface Team {
  id: string;
  name: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export async function getTeamByUserId(userId: string): Promise<Team[]> {
  const teams: Team[] = await db.query.teams.findMany({
    where: (teams, { exists, eq }) =>
      exists(
        db
          .select()
          .from(usersToTeams)
          .where(
            and(
              eq(usersToTeams.teamId, teams.id),
              eq(usersToTeams.userId, userId)
            )
          )
      ),
  });

  return teams;
}
