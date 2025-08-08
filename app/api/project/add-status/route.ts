// app/api/project/add-status/route.ts
import { db } from "db";
import { projects, ticketStatuses } from "db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { name, projectId, projectSlug } = await req.json();

  if (!name || (!projectId && !projectSlug)) {
    return NextResponse.json(
      { error: "Missing projectId or name" },
      { status: 400 }
    );
  }

  let resolvedProjectId = projectId;

  if (!resolvedProjectId && projectSlug) {
    const project = await db.query.projects.findFirst({
      where: eq(projects.slug, projectSlug),
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found for provided slug" },
        { status: 404 }
      );
    }

    resolvedProjectId = project.id;
  }

  const [inserted] = await db
    .insert(ticketStatuses)
    .values({ name, projectId: resolvedProjectId })
    .returning();

  return NextResponse.json({ success: true, status: inserted });
}
