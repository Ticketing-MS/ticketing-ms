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
      <main className="w-full min-h-screen bg-gray-100 p-6">
        {/* <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-700">
            {user
              ? `Welcome ${user.name} di tim ${roleLabelMap[user.role]}`
              : "Loading..."}
          </h1>
          <p className="text-gray-600">Selamat datang di panel admin! 🛠️</p>
        </div> */}

        {/* Section: Home Info */}
        <div className="bg-white shadow p-6 rounded-xl mb-6 flex items-start gap-4">
          <div className="bg-blue-100 p-2 rounded-full">
            <Home className="text-blue-600 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Home</h2>
            <p className="text-gray-600 text-sm">
              Showing all information about statistic and more
            </p>
          </div>
        </div>

        {/* Section: Grid Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white shadow p-4 rounded-lg text-gray-700">
            Tiket Active Cloud
          </div>
          <div className="bg-white shadow p-4 rounded-lg text-gray-700">
            Tiket Active DevOps
          </div>
          <div className="bg-white shadow p-4 rounded-lg text-gray-700">
            <AdminUserTable />
          </div>
        </div>
      </main>
    </div>
  );
}
