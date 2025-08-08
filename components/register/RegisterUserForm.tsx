"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterUserForm() {
  const router = useRouter();

  // defaults yang aman
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "staff">("staff");
  const [team, setTeam] = useState<"admin" | "cloud" | "devops" | "pm">("cloud");
  const [access, setAccess] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  // jaga konsistensi role/team
  useEffect(() => {
    if (role === "admin") {
      setTeam("admin");
      setAccess([]); // admin ga perlu access
    } else {
      // role = staff
      if (!["cloud", "devops", "pm"].includes(team)) {
        setTeam("cloud");
      }
    }
  }, [role]); // eslint-disable-line

  useEffect(() => {
    // kalau bukan PM, kosongkan access
    if (team !== "pm" && access.length) setAccess([]);
  }, [team]); // eslint-disable-line

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, team, access }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Gagal membuat user");
        return;
      }

      toast.success("User berhasil dibuat");
      // pindah ke dashboard admin
      router.replace("/dashboard/admin");

      // reset form biar bersih kalau balik lagi
      setName("");
      setEmail("");
      setPassword("");
      setRole("staff");
      setTeam("cloud");
      setAccess([]);
      setMessage("");
    } catch (err) {
      setMessage("Terjadi kesalahan saat membuat user");
    }
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
              onChange={(e) => setRole(e.target.value as "admin" | "staff")}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          {/* Team */}
          <div>
            <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
              Team
            </label>
            <select
              value={team}
              onChange={(e) =>
                setTeam(e.target.value as "admin" | "cloud" | "devops" | "pm")
              }
              disabled={role === "admin"}
              className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                role === "admin" ? "opacity-70 cursor-not-allowed" : ""
              }`}
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
          {role === "staff" && team === "pm" && (
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
