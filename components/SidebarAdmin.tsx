"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";

interface SidebarProps {
  onToggleWidth?: (collapsed: boolean) => void;
}

export default function SidebarAdmin({ onToggleWidth }: SidebarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<{ role: string; access?: string[] } | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggleWidth?.(!newState); // true = collapsed
  };

  const roleBasedMenus: Record<string, { name: string; href: string }[]> = {
    admin: [
      { name: "Dashboard", href: "/admin" },
      { name: "Semua Tiket", href: "/admin/tiket" },
      { name: "Cloud", href: "/admin/cloud" },
      { name: "DevOps", href: "/admin/devops" },
      { name: "Project Manager", href: "/admin/pm" },
      { name: "Statistik & Laporan", href: "/admin/statistik" },
      { name: "Management User", href: "/admin/management-user" },
      { name: "Register User", href: "/admin/register-user" },
    ],
    cloud: [
      { name: "Dashboard Cloud", href: "/cloud" },
      { name: "My Tickets", href: "/cloud/tiket" },
    ],
    devops: [
      { name: "Dashboard DevOps", href: "/devops" },
      { name: "My Tickets", href: "/devops/tiket" },
    ],
    pm: [
      { name: "Dashboard PM", href: "/pm" },
      { name: "Overview", href: "/pm/overview" },
    ],
  };

  if (!user) return null;

  const combinedMenus = [
    ...(roleBasedMenus[user.role] || []),
    ...(user.access?.flatMap((r) => roleBasedMenus[r] || []) || []),
  ].filter((menu, index, self) => self.findIndex((m) => m.href === menu.href) === index);

  const roleTitleMap: Record<string, string> = {
    admin: "Admin Panel",
    cloud: "Cloud Panel",
    devops: "DevOps Panel",
    pm: "PM Panel",
  };

  return (
    <aside
      className={clsx(
        "bg-white dark:bg-gray-900 shadow-lg border-r border-gray-200 dark:border-gray-800 transition-all duration-300",
        "fixed top-0 left-0 z-40 min-h-screen h-full",
        isOpen ? "w-64" : "w-16"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-gray-500 dark:text-gray-300">
        {isOpen && (
          <h2 className="text-lg font-bold text-gray-800 dark:text-white truncate">
            {/* {roleTitleMap[user.role] ?? "Dashboard"} */}
          </h2>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <svg viewBox="0 0 512 512" className="w-5 h-5 fill-current">
            <path d="M400 144H112a16 16 0 0 1 0-32h288a16 16 0 0 1 0 32zm0 112H112a16 16 0 0 1 0-32h288a16 16 0 0 1 0 32zm0 112H112a16 16 0 0 1 0-32h288a16 16 0 0 1 0 32z" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 px-2">
        {combinedMenus.map((item, index) => {
          const isAdminExtra =
            user.role === "admin" &&
            (item.name === "Statistik & Laporan" ||
              item.name === "Management User" ||
              item.name === "Register User");

          const isFirstAdminExtra =
            isAdminExtra &&
            combinedMenus.findIndex((i) => i.name === "Statistik & Laporan") === index;

          return (
            <div key={item.href}>
              {isFirstAdminExtra && isOpen && (
                <>
                  <hr className="my-2 border-gray-300 dark:border-gray-600" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 px-4 mb-1">
                    Admin Section
                  </p>
                </>
              )}
              <Link
                href={item.href}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm transition",
                  pathname === item.href
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-blue-100 dark:text-gray-300 dark:hover:bg-gray-700",
                  !isOpen && "justify-center"
                )}
              >
                {isOpen ? item.name : item.name.charAt(0)}
              </Link>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
