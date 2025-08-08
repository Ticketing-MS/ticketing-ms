"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export function ProjectForm() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    team: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/jwt", { credentials: "include" });
      if (!res.ok) return;

      const { user } = await res.json();
      setForm((prev) => ({ ...prev, team: user.team }));
    };

    fetchUser();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/project", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Project created successfully");
        window.location.href = `/dashboard/${form.team}/project`;
      } else {
        toast.error(data.error || "Failed to create project");
      }
    } catch (err) {
      toast.error("Unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Create New Project
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white dark:bg-gray-900 p-6 rounded shadow"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="Name the project..."
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 bg-white text-black dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Describe the project..."
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 bg-white text-black dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
          <button
            type="button"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
