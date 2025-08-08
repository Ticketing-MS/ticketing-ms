"use client";

import { useState } from "react";
import { toast } from "sonner";

type Props = {
  statusId: string;
  currentName: string;
  onRename: (newName: string) => void;
};

export function EditColumnButton({ statusId, currentName, onRename }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!name.trim()) return toast.error("Name cannot be empty");
    setLoading(true);
    try {
      const res = await fetch("/api/update-status", {
        method: "PUT",
        body: JSON.stringify({ statusId, newName: name }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Status name updated");
        onRename(name);
        setEditing(false);
      } else {
        toast.error(data.error || "Update failed");
      }
    } catch (err) {
      toast.error("Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="text-xs text-gray-500 hover:underline"
      >
        ✏️
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="text-sm border px-2 py-0.5 rounded dark:bg-gray-800 dark:border-gray-600"
      />
      <button
        onClick={handleUpdate}
        disabled={loading}
        className="text-xs text-blue-600 hover:underline disabled:opacity-50"
      >
        Save
      </button>
      <button
        onClick={() => {
          setEditing(false);
          setName(currentName);
        }}
        className="text-xs text-gray-500 hover:underline"
      >
        Cancel
      </button>
    </div>
  );
}
