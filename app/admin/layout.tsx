"use client";

import { useState } from "react";
import Navbar from "components/Navbar";
import SidebarAdmin from "components/SidebarAdmin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsSidebarOpen(!collapsed);
  };

  return (
    <div className="flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <SidebarAdmin onToggleWidth={handleSidebarToggle} />
      <main
        className={`transition-all duration-300 flex-1 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        } bg-gray-100 dark:bg-gray-900`}
      >
        <Navbar />
        <div>{children}</div>
      </main>
    </div>
  );
}
