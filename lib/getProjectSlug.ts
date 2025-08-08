// lib/getProjectSlug.ts
import { db } from "db";
import { projects } from "db/schema";
import { eq } from "drizzle-orm";

export async function getProjectBySlug(slug: string) {
  const result = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, slug))
    .limit(1);

  console.log("🔍 Fetched project by slug:", slug);
  console.log("📦 Result from DB:", result);

  return result[0];
}
