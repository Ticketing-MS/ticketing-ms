"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "components/theme-provider";
import { Sun, Moon } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/jwt", {
        credentials: "include",
      });
      if (!res.ok) return;
      const { user } = await res.json();
      setUserName(user.name || "");
      setUserRole(user.role || "");
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as any).contains(event.target)
      ) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const sendHeartbeat = async () => {
      const res = await fetch("/api/heartbeat", {
        method: "POST",
        credentials: "include",
      });
      if (res.status === 401) {
        router.push("/login");
      }
    };
    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 30_000);
    return () => clearInterval(interval);
  }, []);

  const getInitials = (name: string) => {
    const words = name.trim().split(" ");
    return words.length === 1
      ? words[0][0]?.toUpperCase() ?? ""
      : (words[0][0] + words[1][0]).toUpperCase();
  };

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      admin: "Admin",
      cloud: "Cloud",
      devops: "DevOps",
      pm: "Project Manager",
    };
    return roles[role] || role;
  };

  const getTitle = () => {
    if (pathname.startsWith("/admin")) {
      if (pathname === "/admin") return "Dashboard Admin";
      if (pathname.startsWith("/admin/tiket")) return "Semua Tiket";
      if (pathname.startsWith("/admin/cloud")) return "Cloud";
      if (pathname.startsWith("/admin/devops")) return "DevOps";
      if (pathname.startsWith("/admin/pm")) return "Project Manager";
      if (pathname.startsWith("/admin/statistik")) return "Statistik & Laporan";
      if (pathname.startsWith("/admin/management-user"))
        return "Management User";
      if (pathname.startsWith("/admin/pengaturan")) return "Pengaturan Sistem";
      if (pathname.startsWith("/admin/register-user")) return "Register User";
      return "Admin Panel";
    }
    if (pathname.startsWith("/cloud")) return "Cloud Panel";
    if (pathname.startsWith("/devops")) return "DevOps Panel";
    if (pathname.startsWith("/pm")) return "PM Panel";
    return "Dashboard";
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
        {getTitle()}
      </h2>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold hover:bg-blue-600"
          >
            {getInitials(userName || "U")}
          </button>

          {openDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg z-50">
              <Link href="/profile">
                <div className="px-4 py-3 border-b dark:border-gray-700 cursor-pointer">
                  <p className="text-gray-800 dark:text-white font-semibold">
                    {userName}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {getRoleLabel(userRole || "")}
                  </p>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-red-100 dark:hover:bg-red-900 text-gray-800 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
