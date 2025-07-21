"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";

type User = {
  role: string;
  access?: string[]; // untuk PM: ["cloud", "devops"]
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const fullMenu = [
    { name: "Dashboard", href: "/admin", role: "admin" },
    { name: "Cloud", href: "/admin/cloud", role: "cloud" },
    { name: "DevOps", href: "/admin/devops", role: "devops" },
    { name: "Project Manager", href: "/admin/pm", role: "pm" },
  ];

  if (!user) return null;

  const visibleMenu = fullMenu.filter((item) => {
    if (user.role === "admin") return true;
    if (user.role === item.role) return true;
    if (user.role === "pm" && user.access?.includes(item.role)) return true;
    return false;
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r shadow-sm px-6 py-8 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          {user.role.toUpperCase()} Panel
        </h2>

        <nav className="flex flex-col gap-2">
          {visibleMenu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "text-base px-4 py-2 rounded-md hover:bg-blue-100 transition",
                pathname === item.href
                  ? "bg-blue-500 text-white"
                  : "text-gray-700"
              )}
            >
              {item.name}
            </Link>
          ))}

          {user.role === "admin" && (
            <Link
              href="/admin/register-user"
              className={clsx(
                "text-base px-4 py-2 rounded-md hover:bg-blue-100 transition",
                pathname === "/admin/register-user"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700"
              )}
            >
              Register User
            </Link>
          )}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 text-red-600 px-4 py-2 rounded-md hover:bg-red-100 transition text-left"
      >
        Logout
      </button>
    </aside>
  );
}
