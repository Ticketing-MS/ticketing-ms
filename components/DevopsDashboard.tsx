"use client";

import { useEffect, useState } from "react";

const roleLabelMap: Record<string, string> = {
  admin: "Admin",
  cloud: "Cloud",
  devops: "DevOps",
  pm: "Project Manager",
};

export default function DevopsDashboard() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-600">
        {user
          ? `Welcome ${user.name} di tim ${roleLabelMap[user.role]}`
          : "Loading..."}
      </h1>
      <p className="text-gray-600">
        Selamat datang di dashboard{" "}
        {user?.role === "cloud" ? "cloud engineer" : "devops engineer"}! 🚀
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold text-gray-700">Tiket Saya</h2>
          <p className="text-sm text-gray-500">
            Lihat semua tiket aktif milikmu.
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold text-gray-700">
            Progress Terbaru
          </h2>
          <p className="text-sm text-gray-500">
            Pantau perkembangan issue yang sedang dikerjakan.
          </p>
        </div>
      </div>
    </div>
  );
}
