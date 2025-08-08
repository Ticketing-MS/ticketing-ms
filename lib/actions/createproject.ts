'use server';

import { db } from "db";
import { projects } from "db/schema";
import { v4 as uuidv4 } from "uuid";
import { getCurrentUser } from "lib/auth";

export async function createProject(data: {
  name: string;
  description?: string;
  team: string;
  slug: string;
}) {
  const user = await getCurrentUser();
  if (!user) return { error: "Unauthorized" };

  const id = uuidv4();

  try {
    await db.insert(projects).values({
      id,
      name: data.name,
      slug: data.slug,
      description: data.description || "",
      team: data.team,
      createdBy: user.id,
    });

    return { success: true, projectId: id };
  } catch (error) {
    console.error("Create project error:", error);
    return { error: "Failed to create project" };
  }
}
