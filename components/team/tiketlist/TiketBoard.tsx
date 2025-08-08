"use client";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { AddColumnButton } from "./AddColumnButton";
import { toast } from "sonner";

type Ticket = {
  id: string;
  title: string;
  slug: string;
  description: string;
  updatedAt: string;
  labels: string[];
  projectSlug: string;
  statusId: string;
};

type Status = {
  id: string;
  name: string;
  order: string | null;
};

type Props = {
  tickets: Ticket[];
  statuses: Status[];
  projectSlug: string;
  team: string;
};

export function TicketBoard({ tickets, statuses, projectSlug, team }: Props) {
  const [columns, setColumns] = useState<Record<string, Ticket[]>>(() => {
    const grouped: Record<string, Ticket[]> = {};
    for (const status of statuses) grouped[status.id] = [];
    for (const t of tickets) {
      if (grouped[t.statusId]) grouped[t.statusId].push(t);
    }
    return grouped;
  });

  const [allStatuses, setAllStatuses] = useState<Status[]>(statuses);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);

  const [confirmDeleteFor, setConfirmDeleteFor] = useState<{
    statusId: string;
    hasTickets: boolean;
  } | null>(null);

  // close kebab menu saat klik di luar
  useEffect(() => {
    const onBodyClick = () => setMenuOpenFor(null);
    window.addEventListener("click", onBodyClick);
    return () => window.removeEventListener("click", onBodyClick);
  }, []);

  const handleAddStatus = (newStatus: Status) => {
    setAllStatuses((prev) => [...prev, newStatus]);
    setColumns((prev) => ({ ...prev, [newStatus.id]: [] }));
  };

  const updateStatusName = async (statusId: string, newName: string) => {
    if (!newName.trim()) return;
    try {
      const res = await fetch("/api/ticket/update-status", {
        method: "PUT",
        body: JSON.stringify({ statusId, newName }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error();

      setAllStatuses((prev) =>
        prev.map((s) => (s.id === statusId ? { ...s, name: newName } : s))
      );
      setEditingStatus(null);
      toast.success("Column renamed");
    } catch {
      toast.error("Failed to rename column");
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceCol = [...(columns[source.droppableId] ?? [])];
    const [moved] = sourceCol.splice(source.index, 1);
    moved.statusId = destination.droppableId;

    const destCol = [...(columns[destination.droppableId] ?? [])];
    destCol.splice(destination.index, 0, moved);

    setColumns((prev) => ({
      ...prev,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol,
    }));

    try {
      const res = await fetch("/api/ticket/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: moved.id,
          newStatusId: destination.droppableId,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Ticket moved");
    } catch (err) {
      toast.error("Failed to move ticket");
      // optional: rollback UI (nggak aku lakukan biar simpel)
    }
  };

  const handleDeleteStatus = async (statusId: string, moveTo?: string) => {
    try {
      let endpoint = `/api/project/status/${statusId}`;
      if (moveTo) endpoint += `?moveTo=${encodeURIComponent(moveTo)}`;

      const res = await fetch(endpoint, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to delete column");

      // update UI
      if (moveTo && columns[statusId]?.length) {
        setColumns((prev) => {
          const copy = { ...prev };
          const movedTickets = copy[statusId] ?? [];
          copy[moveTo] = [...(copy[moveTo] ?? []), ...movedTickets];
          delete copy[statusId];
          return copy;
        });
      } else {
        setColumns((prev) => {
          const copy = { ...prev };
          delete copy[statusId];
          return copy;
        });
      }
      setAllStatuses((prev) => prev.filter((s) => s.id !== statusId));
      setConfirmDeleteFor(null);
      toast.success("Column deleted");
    } catch (e: any) {
      toast.error(e.message || "Delete failed");
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="w-full overflow-x-auto">
          <div className="flex gap-4 min-h-[calc(50vh-300px)] pb-4">
            {allStatuses.map((status) => (
              <Droppable key={status.id} droppableId={status.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="w-[300px] flex-shrink-0 bg-gray-100 dark:bg-gray-800 p-3 rounded"
                    onClick={(e) => e.stopPropagation()} // biar click di dalam gak nutup menu
                  >
                    <div className="mb-2 flex items-center justify-between">
                      {editingStatus === status.id ? (
                        <input
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          onBlur={() => updateStatusName(status.id, tempName)}
                          onKeyDown={(e) =>
                            e.key === "Enter" &&
                            updateStatusName(status.id, tempName)
                          }
                          autoFocus
                          className="text-sm font-semibold w-full bg-white dark:bg-gray-700 rounded px-2 py-1"
                        />
                      ) : (
                        <h3
                          onClick={() => {
                            setEditingStatus(status.id);
                            setTempName(status.name);
                          }}
                          className="font-semibold capitalize text-gray-700 dark:text-white cursor-pointer hover:underline"
                          title="Rename column"
                        >
                          {status.name}
                        </h3>
                      )}

                      {/* ⋮ kebab */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpenFor(
                              menuOpenFor === status.id ? null : status.id
                            );
                          }}
                          className="rounded px-2 py-1 text-gray-500 hover:bg-white/10"
                          aria-haspopup="menu"
                          aria-expanded={menuOpenFor === status.id}
                          title="Menu"
                        >
                          ⋮
                        </button>

                        {menuOpenFor === status.id && (
                          <div
                            className="absolute right-0 z-40 mt-1 w-44 rounded border bg-white py-1 text-sm shadow dark:border-gray-700 dark:bg-gray-800"
                            role="menu"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => {
                                setMenuOpenFor(null);
                                const hasTickets =
                                  (columns[status.id]?.length ?? 0) > 0;
                                setConfirmDeleteFor({
                                  statusId: status.id,
                                  hasTickets,
                                });
                              }}
                              className="block w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                              role="menuitem"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tickets */}
                    {columns[status.id]?.map((ticket, index) => (
                      <Draggable key={ticket.id} draggableId={ticket.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white dark:bg-gray-900 p-3 rounded shadow mb-2"
                          >
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {ticket.title}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Updated {formatDistanceToNow(new Date(ticket.updatedAt))} ago
                            </p>
                            <div className="flex gap-1 flex-wrap">
                              {ticket.labels.map((label) => (
                                <span
                                  key={label}
                                  className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded"
                                >
                                  {label}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}

                    {/* New Ticket Button */}
                    <Link
                      href={`/dashboard/${team}/project/${projectSlug}/tiket/new?statusId=${status.id}`}
                      className="mt-3 block text-sm text-center text-blue-600 bg-blue-100 hover:bg-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:hover:bg-blue-900 py-1 rounded"
                    >
                      + Add Ticket
                    </Link>
                  </div>
                )}
              </Droppable>
            ))}

            {/* Add Column button */}
            <div className="w-[300px] flex-shrink-0 bg-gray-100 dark:bg-gray-800 p-3 rounded">
              <AddColumnButton projectSlug={projectSlug} onAdd={handleAddStatus} />
            </div>
          </div>
        </div>
      </DragDropContext>

      {/* Confirm Delete Dialog */}
      {confirmDeleteFor && (
        <ConfirmDeleteDialog
          statusId={confirmDeleteFor.statusId}
          hasTickets={confirmDeleteFor.hasTickets}
          statuses={allStatuses}
          onCancel={() => setConfirmDeleteFor(null)}
          onConfirm={(moveTo?: string) =>
            handleDeleteStatus(confirmDeleteFor.statusId, moveTo)
          }
        />
      )}
    </>
  );
}

/** Dialog konfirmasi hapus column */
function ConfirmDeleteDialog({
  statusId,
  hasTickets,
  statuses,
  onCancel,
  onConfirm,
}: {
  statusId: string;
  hasTickets: boolean;
  statuses: { id: string; name: string }[];
  onCancel: () => void;
  onConfirm: (moveTo?: string) => void;
}) {
  const [moveTo, setMoveTo] = useState("");
  const targets = statuses.filter((s) => s.id !== statusId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded bg-white p-5 shadow dark:bg-gray-900">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Hapus Kolom
        </h3>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Benarkah Anda mau hapus column ini?
        </p>

        {hasTickets && (
          <div className="mt-4">
            <p className="text-sm text-amber-600 dark:text-amber-400">
              Kolom ini memiliki tiket. Pilih kolom tujuan untuk memindahkan tiket terlebih dahulu.
            </p>
            <select
              className="mt-2 w-full rounded border px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              value={moveTo}
              onChange={(e) => setMoveTo(e.target.value)}
            >
              <option value="">-- Pilih kolom tujuan --</option>
              {targets.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded px-3 py-1.5 text-sm text-gray-700 hover:underline dark:text-gray-300"
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(hasTickets ? (moveTo || undefined) : undefined)}
            disabled={hasTickets && !moveTo}
            className="rounded bg-red-600 px-3 py-1.5 text-sm text-white disabled:opacity-50"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
