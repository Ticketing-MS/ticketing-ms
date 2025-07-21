"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow rounded-lg px-6 py-4 mb-6 flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-800">Dashboard Admin</h2>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
      >
        Logout
      </button>
    </nav>
  );
}
