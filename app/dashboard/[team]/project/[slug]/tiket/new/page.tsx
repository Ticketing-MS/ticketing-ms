import { TiketForm } from "components/team/tiketlist/TiketForm";
import { getCurrentUser } from "lib/auth";
import { getProjectBySlug } from "lib/getProjectSlug";
import { redirect } from "next/navigation";

type Props = {
  params: { slug: string };
  searchParams: { statusId?: string };
};

export default async function NewTicketPage({ params, searchParams }: Props) {
  const currentUser = await getCurrentUser();
  const project = await getProjectBySlug(params.slug);

  if (!currentUser || !project) {
    return redirect("/not-found");
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Create New Ticket</h1>
      <TiketForm
        projectSlug={params.slug}
        projectId={project.id}
        userId={currentUser.id}
        team={currentUser.team}
        defaultStatusId={searchParams.statusId || ""}
      />
    </div>
  );
}
