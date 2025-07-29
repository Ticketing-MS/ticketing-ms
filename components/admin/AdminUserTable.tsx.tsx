"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLoginAt?: string;
};

export default function AdminUserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Ambil user dari localStorage
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        const user = JSON.parse(raw);
        setCurrentUserId(user?.id ?? null);
      } catch {
        setCurrentUserId(null);
      }
    }
  }, []);

  // Polling user list tiap 5 detik
  useEffect(() => {
    const fetchUsers = () => {
      fetch("/api/admin/users")
        .then((res) => res.json())
        .then((data) => setUsers(data))
        .catch(() => toast.error("Gagal memuat data user"));
    };

    fetchUsers();
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  // Hitung apakah user masih dianggap online (< 1 menit)
  const isUserOnline = (lastLoginAt?: string) => {
    if (!lastLoginAt) return false;
    const last = new Date(lastLoginAt).getTime();
    const now = Date.now();
    return now - last < 60 * 1000;
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8">
      <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-200 mb-6">
        Manajemen User
      </h2>
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded shadow">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-5 py-3 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                Status Login
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <td className="px-5 py-3 text-left text-sm text-gray-700 dark:text-gray-100">
                  {user.name}
                  {user.id === currentUserId && (
                    <span className="text-xs text-blue-500 ml-1">(kamu)</span>
                  )}
                </td>
                <td className="px-5 py-3 text-left text-sm text-gray-700 dark:text-gray-100">
                  {isUserOnline(user.lastLoginAt) ? (
                    <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      Online
                    </span>
                  ) : (
                    <div className="space-y-1">
                      <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                        Offline
                      </span>
                      {user.lastLoginAt && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Terakhir login:{" "}
                          {new Date(user.lastLoginAt).toLocaleString("id-ID", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
