"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleProfile = () => {
    router.push("/profile");
  };

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
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none transition-all duration-300"
        >
          Akun
        </button>

        {openDropdown && (
          <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg animate-fade-in z-50">
            <button
              onClick={handleProfile}
              className="w-full text-left px-4 py-2 hover:bg-blue-100 text-gray-800 hover:text-blue-700 focus:bg-blue-100 focus:text-blue-700 transition-all duration-200"
            >
              👤 Profile
            </button>
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
