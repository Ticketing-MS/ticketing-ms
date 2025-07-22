"use client";

import { useState } from "react";

export default function PengaturanSistemPage() {
  // contoh state sederhana
  const [roles, setRoles] = useState([
    { id: 1, name: "admin", permissions: ["cloud", "devops", "pm"] },
    { id: 2, name: "cloud", permissions: [] },
    { id: 3, name: "devops", permissions: [] },
  ]);

  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: 8,
    requireNumbers: true,
    requireSpecial: false,
  });

  const [sessionTimeout, setSessionTimeout] = useState(30); // menit

  return (
    <div className="p-6 bg-white rounded shadow max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Pengaturan Sistem</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Manajemen Role & Akses</h2>
        {/* Contoh list role dan permissions */}
        {roles.map((role) => (
          <div key={role.id} className="mb-4 p-4 border rounded">
            <h3 className="font-semibold">{role.name}</h3>
            <p>Permissions: {role.permissions.join(", ") || "Tidak ada"}</p>
            {/* Tambah tombol edit/hapus di sini */}
          </div>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Setting Keamanan</h2>

        <label className="block mb-2">
          Password Minimal Panjang:
          <input
            type="number"
            value={passwordPolicy.minLength}
            onChange={(e) =>
              setPasswordPolicy({
                ...passwordPolicy,
                minLength: Number(e.target.value),
              })
            }
            className="ml-2 border px-2 py-1 rounded w-20"
          />
        </label>

        <label className="block mb-2">
          <input
            type="checkbox"
            checked={passwordPolicy.requireNumbers}
            onChange={(e) =>
              setPasswordPolicy({
                ...passwordPolicy,
                requireNumbers: e.target.checked,
              })
            }
            className="mr-2"
          />
          Password Harus Mengandung Angka
        </label>

        <label className="block mb-2">
          <input
            type="checkbox"
            checked={passwordPolicy.requireSpecial}
            onChange={(e) =>
              setPasswordPolicy({
                ...passwordPolicy,
                requireSpecial: e.target.checked,
              })
            }
            className="mr-2"
          />
          Password Harus Mengandung Karakter Khusus
        </label>

        <label className="block mb-4">
          Session Timeout (menit):
          <input
            type="number"
            value={sessionTimeout}
            onChange={(e) => setSessionTimeout(Number(e.target.value))}
            className="ml-2 border px-2 py-1 rounded w-20"
          />
        </label>

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Simpan Pengaturan
        </button>
      </section>
    </div>
  );
}
