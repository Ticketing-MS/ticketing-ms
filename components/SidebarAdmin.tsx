"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";

export default function SidebarAdmin() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ role: string; access?: string[] } | null>(
    null
  );

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const mainMenu = [
    { name: "Dashboard", href: "/admin", role: "admin" },
    { name: "Semua Tiket", href: "/admin/tiket", role: "admin" },
    { name: "Cloud", href: "/admin/cloud", role: "cloud" },
    { name: "DevOps", href: "/admin/devops", role: "devops" },
    { name: "Project Manager", href: "/admin/pm", role: "pm" },
  ];

  const adminOnlyMenu = [
    { name: "Statistik & Laporan", href: "/admin/statistik", role: "admin" },
    { name: "Pengaturan Sistem", href: "/admin/pengaturan", role: "admin" },
  ];

  if (!user) return null;

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-4 z-50">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
      </div>

      <nav className="flex flex-col gap-2">
        {/* MAIN MENU */}
        {mainMenu
          .filter(
            (item) =>
              user.role === "admin" ||
              item.role === user.role ||
              (user.role === "pm" && user.access?.includes(item.role))
          )
          .map((item) => (
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

        {/* JEDA / SECTION BREAK */}
        <div className="my-4 border-t border-gray-300"></div>

        {/* LABEL UNTUK BAGIAN LAINNYA */}
        {user.role === "admin" && (
          <>
            <div className="mb-2 text-sm text-gray-500 font-semibold uppercase tracking-wide">
              Lainnya
            </div>

            {adminOnlyMenu.map((item) => (
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

            {/* REGISTER USER */}
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
          </>
        )}
      </nav>
    </aside>
  );
}
