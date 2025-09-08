import { db } from "config/db";
import { Team } from "./Team";
import { assignedToProjects, usersToTeams } from "../schemas";
import { Role } from "./Role";
import { Project } from "./Project";
import { Ticket } from "./Ticket";

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  avatarUrl: string | null;
  isActive: boolean;
  roleId: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;

  teams?: Team[];
  role?: Role;
  assignedProjects?: Project[];
  assignedTickets?: Ticket[];
}

export async function getUsersWithTeams(): Promise<User[]> {
  const usersData = await db.query.users.findMany({
    with: {
      usersToTeams: {
        with: {
          team: true,
        },
      },
    },
    where: (users, { exists, eq }) =>
      exists(
        db.select().from(usersToTeams).where(eq(usersToTeams.userId, users.id))
      ),
  });

  return usersData.map(({ usersToTeams, ...user }) => ({
    ...user,
    teams: (usersToTeams ?? []).map((userToTeam) => userToTeam.team),
  }));
}

export async function getUsersWithProjects(): Promise<User[]> {
  const usersData = await db.query.users.findMany({
    with: {
      assignedToProjects: {
        with: {
          project: true,
        },
      },
    },
    where: (users, { exists, eq }) =>
      exists(
        db
          .select()
          .from(assignedToProjects)
          .where(eq(assignedToProjects.userId, users.id))
      ),
  });

  return usersData.map(({ assignedToProjects, ...user }) => ({
    ...user,
    assignedProjects: (assignedToProjects ?? []).map(
      (assignedProject) => assignedProject.project
    ),
  }));
}
