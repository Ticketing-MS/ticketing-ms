"use client";

import { useState } from "react";
import { toast } from "sonner";

type Props = {
  projectSlug: string;
  onAdd: (newStatus: { id: string; name: string; order: string | null }) => void;
};

export function AddColumnButton({ projectSlug, onAdd }: Props) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return toast.error("Status name is required");
    setLoading(true);
    try {
      const res = await fetch("/api/project/add-status", {
        method: "POST",
        body: JSON.stringify({ projectSlug, name }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (res.ok && data.success && data.status) {
        toast.success("New column added");
        onAdd(data.status); // 🔥 push status baru ke parent
        setAdding(false);
        setName("");
      } else {
        toast.error(data.error || "Failed to add status");
      }
    } catch (err) {
      console.error("Add column error:", err);
      toast.error("Unexpected error");
    } finally {
      setLoading(false);
    }
  };
  

  if (!adding) {
    return (
      <button
        onClick={() => setAdding(true)}
        className="text-sm mt-2 text-blue-600 dark:text-blue-400 hover:underline"
      >
        + Add Column
      </button>
    );
  }

  return (
    <div className="mt-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Column name"
        className="w-full text-sm border rounded px-2 py-1 mb-1 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      />
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add"}
        </button>
        <button
          onClick={() => setAdding(false)}
          className="text-xs text-gray-600 dark:text-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
