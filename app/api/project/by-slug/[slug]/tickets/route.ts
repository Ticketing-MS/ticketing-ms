// /app/api/project/by-slug/[slug]/tickets/route.ts

import { db } from "db";
import { tickets, projects, ticketStatuses } from "db/schema";
import { eq} from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
  const project = await db.query.projects.findFirst({
    where: eq(projects.slug, params.slug),
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

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
    .where(eq(tickets.projectId, project.id));

  const statusData = await db
    .select()
    .from(ticketStatuses)
    .where(eq(ticketStatuses.projectId, project.id));

  return NextResponse.json({ tickets: ticketData, statuses: statusData });
}
