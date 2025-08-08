"use client";

import { useState } from "react";
import { toast } from "sonner";

type Props = {
  projectSlug: string;
  onAdd: (newStatus: {
    id: string;
    name: string;
    order: string | null;
  }) => void;
};

export function AddFirstStatusUI({ projectSlug, onAdd }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddStatus = async () => {
    if (!name.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/project/add-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectSlug, name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create status");

      toast.success("New column added");
      onAdd(data.status);
      setIsOpen(false);
    } catch (err: any) {
      toast.error("Unexpected error");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[300px] flex-shrink-0 bg-gray-100 dark:bg-gray-800 p-3 rounded">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full text-left text-sm text-gray-700 dark:text-white bg-white/20 dark:bg-gray-700 px-3 py-2 rounded hover:bg-white/30 dark:hover:bg-gray-600 transition"
        >
          + Add a list
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <input
            className="w-full border rounded px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter list name..."
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddStatus}
              disabled={loading}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add list"}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-sm text-gray-600 dark:text-gray-300 hover:underline"
            >
              Cancel
            </button>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )}
    </div>
  );
}
