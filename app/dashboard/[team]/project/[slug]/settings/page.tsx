import { db } from "db";
import { eq } from "drizzle-orm";
import { projects } from "db/schema";
import { StatusManager } from "components/tiketcomps/StatusManager";

type Props = { params: { slug: string } };

export default async function ProjectSettingsPage({ params }: Props) {
  const project = await db.query.projects.findFirst({
    where: eq(projects.slug, params.slug),
  });

  if (!project) return <p className="text-red-500">Project not found</p>;

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Project Settings</h1>
      <StatusManager projectId={project.id} />
    </main>
  );
}