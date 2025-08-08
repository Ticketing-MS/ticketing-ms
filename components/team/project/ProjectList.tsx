"use client";

import { useRouter, usePathname } from "next/navigation";
import useSWR from "swr";
import { formatDistanceToNow } from "date-fns";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ProjectList() {
  const pathname = usePathname();
  const router = useRouter();

  const team = pathname.split("/")[2]; // /dashboard/[team]/...

  const { data: projects, isLoading } = useSWR(
    `/api/projectlist?team=${team}`,
    fetcher
  );

  if (isLoading) return <div>Loading...</div>;
  if (!projects?.length) return <div>No projects found.</div>;

  return (
    <ul className="space-y-4 p-4">
      {projects.map((project: any) => (
        <li
          key={project.slug}
          onClick={() =>
            router.push(`/dashboard/${team}/project/${project.slug}/tiket`)
          }
          className="cursor-pointer bg-white border rounded-lg shadow-sm px-4 py-4 hover:shadow-md transition"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center font-bold text-gray-700">
                {project.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <div className="text-sm text-gray-500">{project.group}</div>
                <div className="font-medium text-gray-800">{project.name}</div>

                <div className="flex gap-2 mt-1 flex-wrap">
                  {project.badges?.map((badge: string) => (
                    <span
                      key={badge}
                      className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500 whitespace-nowrap">
              Updated {formatDistanceToNow(new Date(project.updatedAt))} ago
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
