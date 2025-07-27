"use client";

import { useEffect, useState } from "react";
import { Home } from "lucide-react";

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
    <div className="flex overflow-y-auto">
      <main className="w-full min-h-screen bg-gray-100 p-6">
        <div className="min-h-screen bg-gray-100 p-6">
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

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold text-gray-700">
                Tiket Saya
              </h2>
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
      </main>
    </div>
  );
}
