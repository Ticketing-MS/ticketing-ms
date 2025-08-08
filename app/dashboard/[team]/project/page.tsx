"use client"

import { useEffect, useState } from "react";
import { ProjectList } from "components/team/project/ProjectList";
import Link from "next/link";

export default function ProjectPage() {
  const [team, setTeam] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      const res = await fetch("/api/jwt", { credentials: "include" });
      if (!res.ok) return;
      const { user } = await res.json();
      setTeam(user.team);
    };

    fetchTeam();
  }, []);

  if (!team) return null;
  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Projects
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            List of all your cloud projects
          </p>
        </div>

        <Link
          href={`/dashboard/${team}/project/new`}
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + New Project
        </Link>
      </div>

      {/* List of projects */}
      <ProjectList />
    </main>
  );
}
