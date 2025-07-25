"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  team?: string[];
  isActive: boolean;
  createdAt?: string;
};

const ROLES = ["admin", "cloud", "devops", "pm"];

export default function ManagementUserPage() {

  const [users, setUsers] = useState<User[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  

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
    } catch {
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
    } catch {
      toast.error("Terjadi kesalahan saat update role");
    }
    setLoadingId(null);
  };

  const toggleTeam = async (id: number, selectedTeam: string) => {
    setLoadingId(id);
    try {
      const user = users.find((u) => u.id === id);
      if (!user) return;

      const newTeam = user.team?.includes(selectedTeam)
        ? user.team.filter((t) => t !== selectedTeam)
        : [...(user.team || []), selectedTeam];

      const res = await fetch(`/api/admin/users/${id}/team`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team: newTeam }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, team: newTeam } : u))
        );
        toast.success("Team PM berhasil diperbarui");
      } else {
        const error = await res.json();
        toast.error(`Gagal update team: ${error.message}`);
      }
    } catch {
      toast.error("Terjadi kesalahan saat update team");
    }
    setLoadingId(null);
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8">

      <div className="flex flex-col sm:flex-row justify-between mb-4">
        <div className="mb-2 sm:mb-0">
          <input
            type="text"
            placeholder="Search user..."
            className="px-4 py-2 border border-gray-300 rounded w-full text-gray-600 sm:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Role
              </th>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="px-5 py-3 text-left text-xs font-semibold text-gray-500 ">{user.name}</td>
                <td className="px-5 py-3 text-left text-xs font-semibold text-gray-500 ">
                  {user.email}
                </td>
                <td className="px-5 py-4 align-top">
                  <div className="flex flex-col gap-2">
                    {/* Label untuk role */}
                    <label className="block text-sm text-xs font-semibold text-gray-500">Role</label>

                    {/* Select Role */}
                    <select
                      disabled={loadingId === user.id}
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 text-xs font-semibold text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </option>
                      ))}
                    </select>

                    {/* Checkbox akses jika PM */}
                    {user.role === "pm" && (
                      <div className="mt-2 space-y-1">
                        <label className="flex items-center text-xs font-semibold text-gray-500">
                          <input
                            type="checkbox"
                            checked={user.team?.includes("cloud")}
                            onChange={() => toggleTeam(user.id, "cloud")}
                            className="mr-2"
                          />
                          Cloud
                        </label>
                        <label className="flex items-center text-xs font-semibold text-gray-500">
                          <input
                            type="checkbox"
                            checked={user.team?.includes("devops")}
                            onChange={() => toggleTeam(user.id, "devops")}
                            className="mr-2"
                          />
                          DevOps
                        </label>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
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
                <td className="px-5 py-3 text-left text-xs font-semibold text-gray-500 ">
                  <button
                    disabled={loadingId === user.id}
                    onClick={() => toggleUserStatus(user.id, user.isActive)}
                    className={`px-3 py-2 text-sm rounded text-xs font-semibold text-gray-500 ${
                      user.isActive
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    {user.isActive ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  Tidak ada user ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
