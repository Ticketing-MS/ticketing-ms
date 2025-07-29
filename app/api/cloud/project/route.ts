import { db } from "db";
import { projects } from "db/schema";
import { getCurrentUser } from "lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description } = body;

  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "Project name is required" }, { status: 400 });
  }

  const safeDescription = typeof description === "string" ? description : "";
  const team = Array.isArray(user.team) ? user.team[0] : user.team;

  const result = await db.insert(projects).values({
    name: title,
    description: safeDescription,
    team,
    createdBy: user.id,
  });

  return NextResponse.json({ message: "Project created", result });
}
