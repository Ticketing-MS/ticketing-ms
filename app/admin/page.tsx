"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SidebarAdmin from "components/SidebarAdmin";
import Navbar from "components/Navbar";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) return router.push("/");

    const user = JSON.parse(rawUser);
    if (user.role !== "admin") router.push("/");
  }, []);

  return (
    <div className="flex">
      <SidebarAdmin />

      <main className="ml-64 w-full min-h-screen bg-gray-100 p-6">
        <Navbar />

        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Admin Dashboard
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white shadow p-4 rounded-lg text-gray-700">
            Statistik
          </div>
          <div className="bg-white shadow p-4 rounded-lg text-gray-700">
            Manajemen User
          </div>
          <div className="bg-white shadow p-4 rounded-lg text-gray-700">
            Pengaturan
          </div>
        </div>
      </main>
    </div>
  );
}
