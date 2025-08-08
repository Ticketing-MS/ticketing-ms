"use client";

import { useState, useEffect } from "react";

type Status = {
  id: string;
  name: string;
  order: number;
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
    const res = await fetch(`/api/project/${projectId}/statuses`, {
      method: "POST",
      body: JSON.stringify({ name: newName }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setStatuses((prev) => [...prev, data]);
    setNewName("");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Ticket Statuses</h2>

      <ul className="space-y-1">
        {statuses.map((s) => (
          <li key={s.id} className="p-2 bg-gray-100 rounded">
            {s.name}
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="border rounded px-3 py-1"
          placeholder="New status name"
        />
        <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-1 rounded">
          Add
        </button>
      </div>
    </div>
  );
}