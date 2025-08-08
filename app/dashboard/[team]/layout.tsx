"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "components/SidebarAdmin";
import Navbar from "components/Navbar";

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [team, setTeam] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const res = await fetch("/api/jwt", { credentials: "include" });
      if (!res.ok) {
        router.push("/login");
        return;
      }

      const { user } = await res.json();
      setTeam(user.team); // digunakan kalau sidebar perlu tahu team
    };

    checkUser();
  }, []);

  if (!team) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar onToggleWidth={(collapsed) => setIsSidebarOpen(!collapsed)} />

      <div className="flex flex-col flex-1 bg-gray-100 dark:bg-gray-900 overflow-hidden">
        <div
          className={`sticky top-0 z-50 transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-16"
          }`}
        >
          <Navbar />
        </div>

        <div
          className={`flex-1 overflow-y-auto overflow-x-hidden px-0 py-4 ${
            isSidebarOpen ? "ml-64" : "ml-16"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
