"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterUserPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("cloud");
  const [access, setAccess] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role, access }),
    });

    const data = await res.json();
    if (!res.ok) {
      return setMessage(data.message);
    }

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
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold mb-2 text-gray-900">
                Register User Baru
              </h1>
              {message && (
                <p className="text-red-500 text-sm mb-4">{message}</p>
              )}
            </div>

            <div className="divide-y divide-gray-200">
              <div className="py-8 space-y-4 text-gray-700 sm:text-base">
                {/* Name */}
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-sky-600"
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all
                      peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                      peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600
                      peer-focus:text-sm"
                  >
                    Name
                  </label>
                </div>

                {/* Email */}
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-sky-600"
                  />
                  <label htmlFor="email" className="floating-label">
                    Email
                  </label>
                </div>

                {/* Password */}
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-sky-600"
                  />
                  <label htmlFor="password" className="floating-label">
                    Password
                  </label>
                </div>

                {/* Role */}
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full border-b-2 border-gray-300 bg-transparent text-gray-900 focus:outline-none focus:border-sky-600"
                  >
                    <option value="admin">Admin</option>
                    <option value="cloud">Cloud</option>
                    <option value="devops">DevOps</option>
                    <option value="pm">Project Manager</option>
                  </select>
                  <label className="text-sm text-gray-500">Role</label>
                </div>

                {/* Access Checkbox */}
                {role === "pm" && (
                  <div className="flex gap-4 pt-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={access.includes("cloud")}
                        onChange={() => toggleAccess("cloud")}
                        className="mr-2"
                      />
                      Cloud
                    </label>
                    <label className="flex items-center">
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
                <div className="relative">
                  <button
                    type="submit"
                    className="bg-cyan-500 text-white rounded-md px-4 py-2 mt-4 w-full hover:bg-cyan-600 transition"
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
