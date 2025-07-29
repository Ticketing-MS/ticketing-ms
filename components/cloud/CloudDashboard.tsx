"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";

export default function CloudDashboard() {
  const [user, setUser] = useState<{ name: string; team: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const res = await fetch("/api/jwt", { credentials: "include" });
      if (!res.ok) {
        router.push("/login");
        return;
      }

      const { user } = await res.json();
      if (user.team !== "cloud") {
        router.push("/unauthorized");
        return;
      }

      setUser(user);
      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) return null;

  return (
    <div className="flex overflow-y-auto">
      <main className="w-full min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <div className="min-h-screen p-6">
          <div className="bg-white dark:bg-gray-800 shadow p-6 rounded-xl mb-6 flex items-start gap-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
              <Home className="text-blue-600 dark:text-blue-300 w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Home
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Showing all information about statistic and more
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
                Tiket Saya
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Lihat semua tiket aktif milikmu.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
                Progress Terbaru
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Pantau perkembangan issue yang sedang dikerjakan.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
