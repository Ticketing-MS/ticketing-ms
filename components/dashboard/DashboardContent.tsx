// components/DashboardContent.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";
import AdminUserTable from "components/admin/AdminUserTable.tsx"; // opsional

type User = {
  id: string;
  name: string;
  role: string;
  team: string;
};

export default function DashboardContent({ team }: { team: string }) {
  const [user, setUser] = useState<User | null>(null);
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

      // Admin access
      if (team === "admin" && user.role !== "admin") {
        router.push("/unauthorized");
        return;
      }

      // Staff access
      if (user.role === "staff" && user.team !== team) {
        router.push("/unauthorized");
        return;
      }

      setUser(user);
      setLoading(false);
    };

    checkUser();
  }, [team]);

  if (loading || !user) return null;

  const isAdmin = user.role === "admin";

  return (
    <main className="w-full min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="bg-white dark:bg-gray-800 shadow p-6 rounded-xl mb-6 flex items-start gap-4">
          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
            <Home className="text-blue-600 dark:text-blue-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white capitalize">
              {isAdmin ? "Admin" : team} Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {isAdmin
                ? "Showing all information about users and system statistics."
                : "Showing all information about tickets and project updates."}
            </p>
          </div>
        </div>

        {isAdmin ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 shadow p-4 rounded-lg">
              Tiket Active Cloud
            </div>
            <div className="bg-white dark:bg-gray-800 shadow p-4 rounded-lg">
              Tiket Active DevOps
            </div>
            <div className="bg-white dark:bg-gray-800 shadow p-4 rounded-lg">
              <AdminUserTable currentUserId={user.id} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        )}
      </div>
    </main>
  );
}
