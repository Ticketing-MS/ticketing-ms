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

const ROLES = ["admin", "cloud", "devops", "pm"];

export default function AdminUserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => toast.error("Gagal memuat data user"));
  }, []);

  const toggleUserStatus = async (id: number, current: boolean) => {
    setLoadingId(id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        body: JSON.stringify({ id, isActive: !current }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === id ? { ...user, isActive: !current } : user
          )
        );
        toast.success(
          `User berhasil di${current ? "nonaktifkan" : "aktifkan"}`
        );
      } else {
        const error = await res.json();
        toast.error(`Gagal mengubah status: ${error.message}`);
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat mengubah status");
    }
    setLoadingId(null);
  };

  const updateUserRole = async (id: number, newRole: string) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === id ? { ...user, role: newRole } : user
          )
        );
        toast.success("Role berhasil diperbarui 🎉");
      } else {
        const error = await res.json();
        toast.error(`Gagal update role: ${error.message}`);
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat update role");
    }
    setLoadingId(null);
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8">
      <h2 className="text-2xl font-semibold text-gray-600 mb-6">
        Manajemen User
      </h2>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nama
              </th>

              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="px-5 py-3 text-left text-xs font-semibold text-gray-500 ">
                  {user.name}
                </td>
                <td className="px-5 py-3 text-left text-xs font-semibold text-gray-500 ">
                  <span
                    className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                      user.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
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
