import { useState } from "react";

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

  const targets = statuses.filter(s => s.id !== statusId);

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
                <option key={s.id} value={s.id}>{s.name}</option>
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
