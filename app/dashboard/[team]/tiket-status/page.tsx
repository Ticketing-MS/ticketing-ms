"use client";

import { useEffect, useState } from "react";

type Status = {
  id: string;
  name: string;
  order: string;
};

type Props = {
  projectId: string;
};

export function StatusManager({ projectId }: Props) {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const fetchStatuses = async () => {
      const res = await fetch(`/api/project/${projectId}/statuses`);
      const data = await res.json();
      setStatuses(data);
    };
    fetchStatuses();
  }, [projectId]);

  const handleAdd = async () => {
    if (!newName.trim()) return;

    const res = await fetch(`/api/project/${projectId}/statuses`, {
      method: "POST",
      body: JSON.stringify({ name: newName }),
      headers: { "Content-Type": "application/json" },
    });
    const added = await res.json();
    setStatuses((prev) => [...prev, added]);
    setNewName("");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Ticket Statuses</h2>

      <ul className="space-y-1">
        {statuses.map((s) => (
          <li key={s.id} className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded text-sm text-gray-800 dark:text-gray-100">
            {s.name}
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="border px-3 py-1 rounded w-full"
          placeholder="New status name"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    </div>
  );
}
