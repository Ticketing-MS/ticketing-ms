"use client";

import { useState } from "react";
import SidebarAdmin from "components/SidebarAdmin";
import Navbar from "components/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarAdmin
        onToggleWidth={(collapsed) => setIsSidebarOpen(!collapsed)}
      />

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
