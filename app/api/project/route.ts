// /app/api/projects/route.ts

import { db } from "db";
import { projects } from "db/schema";
import { NextResponse } from "next/server";
import { getCurrentUser } from "lib/auth";
import slugify from "slugify";

export async function POST(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const slug = slugify(body.name, { lower: true });

  try {
    const result = await await db.insert(projects).values({
      name: body.name,
      slug: slug,
      description: body.description,
      team: body.team,
      createdBy: user.id,
      updatedAt: new Date(), // ✅ tambahkan ini
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Insert error", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
