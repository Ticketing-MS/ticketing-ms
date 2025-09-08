"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ToggleTheme from "components/ToggleTheme";
import Sidebar from "components/Sidebar";
import Navbar from "components/Navbar";
import { UserLogInProvider } from "hooks/context/UserLogInContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [isOpenSideBar, setIsOpenSidebar] = useState(false);

  useEffect(() => {
    if (!window) return;
    setIsOpenSidebar(window.screen.width >= 1024);
  }, []);

  const toggleSidebar = () => {
    setIsOpenSidebar(!isOpenSideBar);
  };

  return (
    <UserLogInProvider>
      <div className="flex overflow-hidden">
        <Sidebar isOpen={isOpenSideBar} toggleSidebar={toggleSidebar} />

        <div className="flex flex-col flex-1 bg-gray-100 dark:bg-gray-900 overflow-hidden">
          <div
            className={`sticky top-0 z-50 transition-all duration-300 ${
              isOpenSideBar ? "ml-64" : "ml-16"
            }`}
          >
            <Navbar />
          </div>

          <div
            className={`flex-1 overflow-y-auto overflow-x-hidden px-0 py-4 pl-6 ${
              isOpenSideBar ? "ml-64" : "ml-16"
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </UserLogInProvider>
  );
}
