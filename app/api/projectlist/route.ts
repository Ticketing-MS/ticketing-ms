// /app/api/projectlist/route.ts
import { db } from "db";
import { projects } from "db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const teamParam = req.nextUrl.searchParams.get("team");

  const result = await db
    .select({
      id: projects.id,
      name: projects.name,
      slug: projects.slug,       
      description: projects.description,
      team: projects.team,
      updatedAt: projects.updatedAt,
    })
    .from(projects)
    .where(eq(projects.team, teamParam!));

  return NextResponse.json(result);
}
