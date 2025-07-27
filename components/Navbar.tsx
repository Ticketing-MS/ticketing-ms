"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  function getInitials(name: string): string {
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0]?.toUpperCase() ?? "";
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  function getRoleLabel(role: string): string {
    const roles: Record<string, string> = {
      admin: "Admin",
      cloud: "Cloud",
      devops: "DevOps",
      pm: "Project Manager",
    };
    return roles[role] || role;
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name || "");
      setUserRole(user.role || "");
    }
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <h2 className="text-xl font-semibold text-gray-800">{getTitle()}</h2>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpenDropdown(!openDropdown)}
          className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold hover:bg-blue-600 focus:outline-none transition-all duration-300"
        >
          {getInitials(userName || "U")}
        </button>

        {openDropdown && (
          <div className="absolute right-0 mt-2 w-56 bg-white border rounded-md shadow-lg animate-fade-in z-50">
            <Link href="/profile">
              <div className="px-4 py-3 border-b">
                <p className="text-gray-800 font-semibold">{userName}</p>

                <p className="text-gray-500 text-sm">
                  {getRoleLabel(userRole || "")}
                </p>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-red-100 text-gray-800 hover:text-red-600 focus:bg-red-100 focus:text-red-600 transition-all duration-200"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
