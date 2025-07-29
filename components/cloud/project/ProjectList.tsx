"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ProjectList() {
  const { data: projects, isLoading } = useSWR("/api/project-list", fetcher);

  if (isLoading) return <div>Loading...</div>;
  if (!projects?.length) return <div>No projects found.</div>;

  return (
    <ul className="space-y-4">
      {projects.map((project: any) => (
        <li
          key={project.id}
          className="p-4 border rounded-lg shadow-sm hover:shadow transition"
        >
          <h3 className="font-semibold text-lg">{project.name}</h3>
          <p className="text-sm text-gray-600">{project.description}</p>
        </li>
      ))}
    </ul>
  );
}
