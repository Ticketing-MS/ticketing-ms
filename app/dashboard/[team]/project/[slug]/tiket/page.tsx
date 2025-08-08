import { db } from "db";
import { projects } from "db/schema";
import { eq } from "drizzle-orm";
import { TicketBoardClient } from "components/team/tiketlist/TiketBoardClient";
import Link from "next/link";

type Props = {
  params: { slug: string };
};

export default async function TicketPage({ params }: Props) {
  const project = await db.query.projects.findFirst({
    where: eq(projects.slug, params.slug),
  });

  if (!project) {
    return <div className="p-4 text-red-500">Project not found.</div>;
  }

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Tikets
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            List of all your cloud tickets
          </p>
        </div>
      </div>

      <TicketBoardClient projectSlug={project.slug} />
    </main>
  );
}
