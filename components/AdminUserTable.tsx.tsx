"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
};

export default function AdminUserTable() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const toggleUserStatus = async (id: number, current: boolean) => {
    await fetch("/api/admin/users", {
      method: "POST",
      body: JSON.stringify({ id, isActive: !current }),
      headers: { "Content-Type": "application/json" },
    });

    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, isActive: !current } : user
      )
    );
  };

  return (
    <div className="bg-white rounded shadow p-4 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Manajemen User</h2>
      <table className="min-w-[600px] w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-1 md:p-2">Nama</th>
            <th className="p-1 md:p-2">Email</th>
            <th className="p-1 md:p-2">Role</th>
            <th className="p-1 md:p-2">Status</th>
            <th className="p-1 md:p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="p-1 md:p-2">{user.name}</td>
              <td className="p-1 md:p-2">{user.email}</td>
              <td className="p-1 md:p-2">{user.role}</td>
              <td className="p-1 md:p-2">
                {user.isActive ? (
                  <span className="text-green-600">Aktif</span>
                ) : (
                  <span className="text-red-600">Nonaktif</span>
                )}
              </td>
              <td className="p-1 md:p-2">
                <button
                  onClick={() => toggleUserStatus(user.id, user.isActive)}
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
