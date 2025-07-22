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
    <div className="bg-white rounded shadow p-4 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Manajemen User</h2>
      <table className="min-w-[600px] w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Nama</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Status</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">
                <select
                  disabled={loadingId === user.id}
                  value={user.role}
                  onChange={(e) =>
                    updateUserRole(user.id, e.target.value)
                  }
                  className="bg-white border border-gray-300 rounded px-2 py-1"
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-2">
                {user.isActive ? (
                  <span className="text-green-600">Aktif</span>
                ) : (
                  <span className="text-red-600">Nonaktif</span>
                )}
              </td>
              <td className="p-2">
                <button
                  disabled={loadingId === user.id}
                  onClick={() =>
                    toggleUserStatus(user.id, user.isActive)
                  }
                  className={`px-2 py-1 text-xs rounded ${
                    user.isActive
                      ? "bg-red-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {user.isActive ? "Nonaktifkan" : "Aktifkan"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
