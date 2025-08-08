import { db } from "db";
import { tickets, projects, ticketStatuses } from "db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const projectId = params.id;

  const ticketData = await db
    .select({
      id: tickets.id,
      title: tickets.title,
      slug: tickets.slug,
      description: tickets.description,
      updatedAt: tickets.updatedAt,
      labels: tickets.labels,
      projectSlug: projects.slug,
      statusId: tickets.statusId,
    })
    .from(tickets)
    .innerJoin(projects, eq(tickets.projectId, projects.id))
    .where(eq(tickets.projectId, projectId));

  const statusData = await db
    .select()
    .from(ticketStatuses)
    .where(eq(ticketStatuses.projectId, projectId));

  return NextResponse.json({ tickets: ticketData, statuses: statusData });
}