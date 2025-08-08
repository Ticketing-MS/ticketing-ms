"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import "styles/mdeditor-custom.css";
import Select from "react-select";
import { customStyles, labelOptions } from "components/LabelOptions";
import { toast } from "sonner";
import { SmartBackButton } from "components/SmartBackButton";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type Props = {
  projectId: string;
  userId: string;
  team: string;
  access?: string[];
  projectSlug: string;
  defaultStatusId?: string;
};

export function TiketForm({
  projectId,
  userId,
  team,
  access = [],
  projectSlug,
  defaultStatusId,
}: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignee: "",
    labels: [] as string[],
    dueDate: "",
    team,
    projectId,
    userId,
    statusId: defaultStatusId || "",
  });

  const [availableTeams, setAvailableTeams] = useState<string[]>(
    team === "pm" ? ["cloud", "devops"] : [team]
  );

  const [mode, setMode] = useState<"preview" | "edit">("edit");
  const [pastedImages, setPastedImages] = useState<File[]>([]);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [assigneeOptions, setAssigneeOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      userId,
      team,
      projectId,
      statusId: defaultStatusId || prev.statusId,
    }));
  }, [userId, team, projectId, defaultStatusId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.userId ||
      !form.projectId
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const uploadedURLs: string[] = [];

      for (const file of pastedImages) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload-ticket", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) uploadedURLs.push(data.url);
      }

      let updatedDesc = form.description;
      const blobUrls = [
        ...form.description.matchAll(/!\[.*?\]\((blob:[^)]+)\)/g),
      ].map((m) => m[1]);
      if (blobUrls.length !== uploadedURLs.length) {
        toast.error("Some pasted images failed to upload.");
        setIsSubmitting(false);
        return;
      }

      blobUrls.forEach((blob, idx) => {
        updatedDesc = updatedDesc.replace(blob, uploadedURLs[idx]);
      });

      const res = await fetch("/api/ticket", {
        method: "POST",
        body: JSON.stringify({ ...form, description: updatedDesc }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Ticket created successfully!");
        window.history.back();
        router.refresh();
      } else {
        toast.error(data.error || "Failed to create ticket");
      }
    } catch (error) {
      console.error("🚨 Submit error:", error);
      toast.error("Unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchAssignees = async () => {
      if (!form.team) return;
      const res = await fetch(`/api/assignees?team=${form.team}`);
      const data = await res.json();
      setAssigneeOptions(data);
    };
    fetchAssignees();
  }, [form.team]);

  useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.includes("image")) {
          const file = item.getAsFile();
          if (file) {
            setPastedImages((prev) => [...prev, file]);
            const localUrl = URL.createObjectURL(file);
            setForm((prev) => ({
              ...prev,
              description: `${prev.description}\n\n![pasted image](${localUrl})\n\n`,
            }));
          }
        }
      }
    };
    const current = editorRef.current;
    current?.addEventListener("paste", handler);
    return () => current?.removeEventListener("paste", handler);
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded shadow dark:bg-gray-900 space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        New Ticket
      </h2>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </div>

      {/* Description */}
      <div data-color-mode="light" ref={editorRef}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <div className="border rounded-md dark:border-gray-700">
          <MDEditor
            value={form.description}
            onChange={(val = "") => setForm({ ...form, description: val })}
            height={300}
            preview={mode}
          />
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 px-2 py-1 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <button
              type="button"
              onClick={() =>
                setMode((prev) => (prev === "edit" ? "preview" : "edit"))
              }
              className="hover:underline text-sm"
            >
              {mode === "edit" ? "Switch to preview" : "Switch to edit"}
            </button>
            <span className="text-xs">M↓</span>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Assignee */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Assignee
          </label>
          <select
            value={form.assignee}
            onChange={(e) => setForm({ ...form, assignee: e.target.value })}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="">Unassigned</option>
            {assigneeOptions.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        {/* Team */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Team
          </label>
          <select
            value={form.team}
            onChange={(e) => setForm({ ...form, team: e.target.value })}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            {availableTeams.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Due Date
          </label>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        {/* Labels */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Labels
          </label>
          <Select
            isMulti
            placeholder="Select label"
            options={labelOptions}
            value={labelOptions.filter((o) => form.labels.includes(o.value))}
            onChange={(selected) =>
              setForm({ ...form, labels: selected.map((s) => s.value) })
            }
            styles={customStyles}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create Ticket"}
        </button>
        <SmartBackButton
          fallbackUrl={`/cloud/project/${projectSlug}/tiket`}
          className="text-sm text-gray-600 dark:text-gray-300 underline"
        />
      </div>
    </form>
  );
}
