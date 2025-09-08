"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

type MenuItem = {
  name: string;
  href: string;
  icon?: string;
};

type RoleMenuMap = {
  [key: string]: MenuItem[];
};

const roleBasedMenus: RoleMenuMap = {
  admin: [
    { name: "Dashboard", href: "/dashboard", icon: "🏠" },
    {
      name: "Manage Users",
      href: "/manage-user",
      icon: "👥",
    },
    { name: "Statistik", href: "/dashboard/admin/statistik", icon: "📊" },
    {
      name: "Register User",
      href: "/dashboard/admin/register-user",
      icon: "📝",
    },
  ],
  cloud: [
    { name: "Dashboard Cloud", href: "/dashboard/cloud", icon: "☁️" },
    { name: "My Tickets", href: "/dashboard/cloud/project", icon: "🎫" },
  ],
  devops: [
    { name: "Dashboard DevOps", href: "/dashboard/devops", icon: "🔧" },
    { name: "My Tickets", href: "/dashboard/devops/project", icon: "🎫" },
  ],
  pm: [
    { name: "Dashboard PM", href: "/dashboard/pm", icon: "📊" },
    { name: "My Tickets", href: "/dashboard/pm/project", icon: "🎫" },
  ],
};

type User = {
  role: string;
  team?: string;
  access?: string[];
};

export default function SidebarAdmin({
  onToggleWidth,
}: {
  onToggleWidth?: (collapsed: boolean) => void;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/jwt", { credentials: "include" });
        if (!res.ok) return;
        const { user } = await res.json();
        setUser(user);
      } catch {}
    };

    fetchUser();
  }, []);

  const toggleSidebar = () => {
    setIsOpen((prev) => {
      const newVal = !prev;
      if (onToggleWidth) onToggleWidth(!newVal);
      return newVal;
    });
  };

  if (!user) return null;

  const mainMenus =
    roleBasedMenus[user.role] || roleBasedMenus[user.team ?? ""] || [];
  const accessMenus =
    user.access?.flatMap((team) => roleBasedMenus[team] || []) || [];

  const allMenus: MenuItem[] = [];
  const seen = new Set<string>();
  [...mainMenus, ...accessMenus].forEach((menu) => {
    if (!seen.has(menu.href)) {
      allMenus.push(menu);
      seen.add(menu.href);
    }
  });

  return (
    <aside
      className={[
        "h-screen fixed top-0 left-0 z-50 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-md transition-all duration-300 overflow-y-auto",
        isOpen ? "w-64" : "w-16",
      ].join(" ")}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {isOpen && <span className="text-lg font-semibold">Menu</span>}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>

      <nav className="p-2 space-y-1">
        {allMenus.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-blue-100 dark:text-gray-300 dark:hover:bg-gray-700",
              !isOpen && "justify-center",
            ].join(" ")}
          >
            <span>{item.icon || "📁"}</span>
            {isOpen && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
