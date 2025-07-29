import { ProjectForm } from "components/cloud/project/ProjectForm";

export default function NewProjectPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Create New Project</h1>
      <ProjectForm />
    </main>
  );
}
