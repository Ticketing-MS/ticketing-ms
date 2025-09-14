import { db } from "../../../config/db";
import { fakerID_ID as faker } from "@faker-js/faker";
import { assignedToTickets, tickets } from "../schemas";
import { getUsersWithProjects, Ticket, User } from "../models";

export async function up() {
  const usersData: User[] = await getUsersWithProjects();
  const ticketsData: Ticket[] = await db.select().from(tickets);
  const data: any[] = [];

  for (const ticket of ticketsData) {
    const filtered = usersData.filter((user) =>
      user.assignedProjects?.some((project) => project.id === ticket.projectId)
    );

    if (filtered.length === 0) {
      continue;
    }

    data.push({
      userId: faker.helpers.arrayElement(filtered).id,
      ticketId: ticket.id,
    });
  }

  await db.insert(assignedToTickets).values(data);
}

export async function down() {
  await db.delete(assignedToTickets);
}
