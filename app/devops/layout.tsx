"use client";

import { useState } from "react";
import SidebarAdmin from "components/SidebarAdmin";
import Navbar from "components/Navbar";

export default function CloudLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsSidebarOpen(!collapsed);
  };
  return (
    <div className="flex">
      <SidebarAdmin onToggleWidth={handleSidebarToggle} />
      <main
        className={`transition-all duration-300 min-h-screen flex-1 bg-gray-100 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <Navbar />
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
