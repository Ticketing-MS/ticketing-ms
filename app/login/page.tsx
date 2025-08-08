"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "components/theme-provider";
import { Sun, Moon } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) return setError(data.message);

    // ✅ REDIRECT sesuai struktur baru
    if (data.role === "admin") {
      const validTeams = ["admin"];
      const team = validTeams.includes(data.team) ? data.team : "";
      router.push(`/dashboard/${team}`);
    } else if (data.role === "staff") {
      const validTeams = ["cloud", "devops", "pm"];
      const team = validTeams.includes(data.team) ? data.team : "";
      router.push(`/dashboard/${team}`);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex justify-center items-center">
      {/* Toggle theme di pojok kanan atas */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        {theme === "light" ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </button>

      <div className="max-w-screen-xl bg-white dark:bg-gray-800 shadow sm:rounded-lg flex w-full sm:m-10">
        {/* Form section */}
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Sign in</h1>
            <form onSubmit={handleSubmit} className="w-full mt-8 space-y-4">
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full py-3 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600 transition duration-300 flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <path d="M20 8v6M23 11h-6" />
                </svg>
                Sign In
              </button>
            </form>
          </div>
        </div>

        {/* Right image */}
        <div className="flex-1 bg-indigo-100 dark:bg-indigo-900 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
            }}
          />
        </div>
      </div>
    </div>
  );
}
