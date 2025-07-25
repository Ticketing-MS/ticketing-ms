"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProfileUserForm({ user }: { user: any }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    });

    if (!res.ok) {
      const text = await res.text();
      setErrorMessage(text || "Terjadi kesalahan saat update.");
      toast.error("Gagal update profil.");
      return;
    }

    const data = await res.json();
    toast.success("Berhasil update profil!");

    const role = data.user?.role; // ✅ ambil dari user.role
    if (role === "admin") router.push("/admin");
    else if (role === "cloud") router.push("/cloud");
    else if (role === "devops") router.push("/devops");
    else if (role === "pm") router.push("/pm");
    else router.push("/");
  };

  return (
    <div className="w-full px-4 py-6">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Update Profile
        </h1>

        {errorMessage && (
          <div className="text-sm text-red-600 text-center mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Masukkan nama"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Masukkan email"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-md transition"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
}
