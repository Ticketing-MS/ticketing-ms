"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterUserForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [team, setTeam] = useState("");
  const [access, setAccess] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role, team, access }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message);
      return;
    }

    toast.success("User berhasil dibuat");
    router.push("/admin");
  };

  const toggleAccess = (module: string) => {
    setAccess((prev) =>
      prev.includes(module)
        ? prev.filter((m) => m !== module)
        : [...prev, module]
    );
  };

  return (
    <div className="w-full px-4 py-6">
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Register User Baru
        </h1>

        {message && (
          <div className="text-sm text-red-600 dark:text-red-400 text-center mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Masukkan nama"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Masukkan email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Masukkan password"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="admin">Admin</option>
              <option value="cloud">Staff</option>
            </select>
          </div>

          {/* Team */}
          <div>
            <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
              Team
            </label>
            <select
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {role === "admin" ? (
                <option value="admin">Admin</option>
              ) : (
                <>
                  <option value="cloud">Cloud</option>
                  <option value="devops">DevOps</option>
                  <option value="pm">Project Manager</option>
                </>
              )}
            </select>
          </div>

          {/* Access for PM */}
          {team === "pm" && (
            <div className="flex gap-4">
              <label className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={access.includes("cloud")}
                  onChange={() => toggleAccess("cloud")}
                  className="mr-2"
                />
                Cloud
              </label>
              <label className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={access.includes("devops")}
                  onChange={() => toggleAccess("devops")}
                  className="mr-2"
                />
                DevOps
              </label>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-md transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
