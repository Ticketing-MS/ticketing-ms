"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminUserTable from "components/AdminUserTable.tsx";

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
        <h1 className="text-2xl font-bold mb-4 text-gray-700">
          {user
            ? `Welcome ${user.name} di tim ${roleLabelMap[user.role]}`
            : "Loading..."}
        </h1>
        <p className="text-gray-600 mb-6">Selamat datang di panel admin! 🛠️</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white shadow p-4 rounded-lg text-gray-700">
            Tiket Active Cloud
          </div>
          <div className="bg-white shadow p-4 rounded-lg text-gray-700">
            Tiket Active Devops
          </div>
          <div className="bg-white shadow p-4 rounded-lg text-gray-700">
            <AdminUserTable />
          </div>
        </div>
      </main>
    </div>
  );
}
