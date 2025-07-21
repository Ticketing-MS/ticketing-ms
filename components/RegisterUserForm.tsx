"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterUserForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("cloud");
  const [access, setAccess] = useState<string[]>([]);
  const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role, access }),
    });

    const data = await res.json();
    if (!res.ok) {
      return setMessage(data.message);
    }

    router.push("/admin"); 
  };

  const toggleAccess = (module: string) => {
    setAccess((prev) =>
      prev.includes(module)
        ? prev.filter((m) => m !== module)
        : [...prev, module]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <h2 className="text-xl font-bold mb-2">Register User Baru</h2>

      <input
        type="text"
        placeholder="Name"
        className="w-full p-2 border rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <select
        className="w-full p-2 border rounded"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="admin">Admin</option>
        <option value="cloud">Cloud</option>
        <option value="devops">DevOps</option>
        <option value="pm">Project Manager</option>
      </select>

      {role === "pm" && (
        <div className="flex gap-4">
          <label>
            <input
              type="checkbox"
              checked={access.includes("cloud")}
              onChange={() => toggleAccess("cloud")}
            />
            <span className="ml-2">Cloud</span>
          </label>
          <label>
            <input
              type="checkbox"
              checked={access.includes("devops")}
              onChange={() => toggleAccess("devops")}
            />
            <span className="ml-2">DevOps</span>
          </label>
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Register
      </button>

      {message && <p className="text-sm text-green-600">{message}</p>}
    </form>
  );
}
