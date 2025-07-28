"use client";

import { useState } from "react";
import { createTicket } from "lib/action/tikets";
import { useRouter } from "next/navigation";

export default function TicketCreateForm({ categories, priorities }: {
  categories: { id: string; name: string }[];
  priorities: { id: string; level: string }[];
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryId: "",
    priorityId: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTicket(form); // Simpan ke DB
    router.push("/cloud/tiket"); // Redirect ke halaman tiket
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Judul Tiket"
        className="w-full p-2 rounded border dark:bg-gray-800"
        required
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Deskripsi"
        className="w-full p-2 rounded border dark:bg-gray-800"
        required
      />

      <select
        name="priorityId"
        value={form.priorityId}
        onChange={handleChange}
        className="w-full p-2 rounded border dark:bg-gray-800"
        required
      >
        <option value="">Pilih Prioritas</option>
        {priorities.map((p) => (
          <option key={p.id} value={p.id}>{p.level}</option>
        ))}
      </select>

      <select
        name="categoryId"
        value={form.categoryId}
        onChange={handleChange}
        className="w-full p-2 rounded border dark:bg-gray-800"
        required
      >
        <option value="">Pilih Kategori</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
}
