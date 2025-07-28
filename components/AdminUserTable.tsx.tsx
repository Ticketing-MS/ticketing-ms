"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
};

export default function AdminUserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => toast.error("Gagal memuat data user"));
  }, []);

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
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="px-5 py-3 text-left text-sm text-gray-700 dark:text-gray-100">
                  {user.name}
                </td>
                <td className="px-5 py-3 text-left text-sm text-gray-700 dark:text-gray-100">
                  <span
                    className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                      user.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {user.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
