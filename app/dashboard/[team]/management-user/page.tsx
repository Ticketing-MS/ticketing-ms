"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  team: string;
  access?: string[];
  isActive: boolean;
};

const ROLES = ["admin", "staff"];
const TEAMS_BY_ROLE: Record<string, string[]> = {
  admin: ["admin"],
  staff: ["cloud", "devops", "pm"],
};

export default function ManagementUserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => toast.error("Gagal memuat data user"));
  }, []);

  const updateUserRole = async (id: string, role: string, team: string) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, team }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === id
              ? {
                  ...u,
                  role,
                  team,
                  access:
                    role === "staff" && team === "pm" ? u.access ?? [] : [], // ✅ clear access kalau bukan PM
                }
              : u
          )
        );
        toast.success("Role & Team berhasil diperbarui 🎉");
      } else {
        const error = await res.json();
        toast.error(`Gagal update role: ${error.message}`);
      }
    } catch {
      toast.error("Terjadi kesalahan saat update role");
    }
    setLoadingId(null);
  };

  const toggleTeam = async (id: string, selectedAccess: string) => {
    setLoadingId(id);
    try {
      const user = users.find((u) => u.id === id);
      if (!user) return;

      const newAccess = user.access?.includes(selectedAccess)
        ? user.access.filter((t) => t !== selectedAccess)
        : [...(user.access || []), selectedAccess];

      const res = await fetch(`/api/admin/users/${id}/team`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access: newAccess }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, access: newAccess } : u))
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

  const toggleUserStatus = async (id: string, current: boolean) => {
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

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between mb-4">
        <input
          type="text"
          placeholder="Search user..."
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-sky-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded shadow">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              {["Name", "Email", "Role", "Team", "Status", "Action"].map(
                (heading) => (
                  <th
                    key={heading}
                    className="px-5 py-3 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider"
                  >
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <td className="px-5 py-3 text-sm text-gray-700 dark:text-gray-200">
                  {user.name}
                </td>
                <td className="px-5 py-3 text-sm text-gray-700 dark:text-gray-200">
                  {user.email}
                </td>

                {/* Role */}
                <td className="px-5 py-3 text-sm text-gray-700 dark:text-gray-200">
                  <select
                    disabled={loadingId === user.id}
                    value={user.role}
                    onChange={(e) =>
                      updateUserRole(
                        user.id,
                        e.target.value,
                        TEAMS_BY_ROLE[e.target.value][0]
                      )
                    }
                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm rounded"
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Team */}
                <td className="px-5 py-3 text-sm text-gray-700 dark:text-gray-200">
                  <select
                    disabled={loadingId === user.id}
                    value={user.team}
                    onChange={(e) =>
                      updateUserRole(user.id, user.role, e.target.value)
                    }
                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm rounded"
                  >
                    {TEAMS_BY_ROLE[user.role]?.map((team) => (
                      <option key={team} value={team}>
                        {team.charAt(0).toUpperCase() + team.slice(1)}
                      </option>
                    ))}
                  </select>

                  {user.team === "pm" && (
                    <div className="mt-2 space-y-1">
                      {["cloud", "devops"].map((access) => (
                        <label
                          key={access}
                          className="flex items-center text-xs text-gray-600 dark:text-gray-300"
                        >
                          <input
                            type="checkbox"
                            checked={user.access?.includes(access)}
                            onChange={() => toggleTeam(user.id, access)}
                            className="mr-2"
                          />
                          {access.charAt(0).toUpperCase() + access.slice(1)}
                        </label>
                      ))}
                    </div>
                  )}
                </td>

                {/* Status */}
                <td className="px-5 py-3 text-sm">
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

                {/* Action */}
                <td className="px-5 py-3 text-sm">
                  <button
                    disabled={loadingId === user.id}
                    onClick={() => toggleUserStatus(user.id, user.isActive)}
                    className={`px-3 py-2 rounded text-xs font-semibold text-white transition-colors ${
                      user.isActive
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {user.isActive ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-4 text-gray-500 dark:text-gray-300"
                >
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
