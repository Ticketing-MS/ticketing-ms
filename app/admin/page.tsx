"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminUserTable from "components/AdminUserTable.tsx";
import { Home } from "lucide-react";

const roleLabelMap: Record<string, string> = {
  admin: "Admin",
  cloud: "Cloud",
  devops: "DevOps",
  pm: "Project Manager",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) return router.push("/");

    const user = JSON.parse(rawUser);
    if (user.role !== "admin") router.push("/");
  }, []);

  return (
    <div className="flex overflow-y-auto">
      <main className="w-full min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-8">
        <div className="max-w-screen-xl mx-auto px-6">
          {/* Section: Home Info */}
          <div className="bg-white dark:bg-gray-800 shadow p-6 rounded-xl mb-6 flex items-start gap-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
              <Home className="text-blue-600 dark:text-blue-400 w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Home
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Showing all information about statistic and more
              </p>
            </div>
          </div>

          {/* Section: Grid Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 shadow p-4 rounded-lg">
              Tiket Active Cloud
            </div>
            <div className="bg-white dark:bg-gray-800 shadow p-4 rounded-lg">
              Tiket Active DevOps
            </div>
            <div className="bg-white dark:bg-gray-800 shadow p-4 rounded-lg">
              <AdminUserTable />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
