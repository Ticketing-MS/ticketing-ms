// app/api/assignees/route.ts
import { db } from "db";
import { users } from "db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const team = req.nextUrl.searchParams.get("team");

  if (!team) {
    return NextResponse.json({ error: "Team is required" }, { status: 400 });
  }

  const result = await db.select({
    id: users.id,
    name: users.name,
    team: users.team,
  }).from(users).where(eq(users.team, team));

  return NextResponse.json(result);
}
