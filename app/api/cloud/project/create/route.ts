import { NextResponse } from "next/server";
import { db } from "db";
import { projects } from "db/schema";
import { getCurrentUser } from "lib/auth";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  // if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // const { title, description } = await req.json();

  // await db.insert(projects).values({

  //   description,
  //   team: user.team,
  //   createdBy: user.id,
  // });

  return NextResponse.json({ message: "Project created" });
}
