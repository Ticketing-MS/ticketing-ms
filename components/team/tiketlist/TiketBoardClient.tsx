"use client";

import { useEffect, useState } from "react";
import { TicketBoard } from "./TiketBoard";
import { AddFirstStatusUI } from "./AddFirstStatusUI";

type Props = {
  projectSlug: string;
  team: string
};

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

export function TicketBoardClient({ projectSlug, team }: Props) {
  const [data, setData] = useState<{
    tickets: Ticket[];
    statuses: Status[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/project/by-slug/${projectSlug}/tickets`);

        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Failed to fetch board data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectSlug]);

  if (loading)
    return <p className="text-sm text-gray-500">Loading tickets...</p>;

  if (!data?.statuses?.length) {
    return (
      <AddFirstStatusUI
        projectSlug={projectSlug}
        onAdd={(newStatus) => {
          setData((prev) =>
            prev
              ? {
                  ...prev,
                  statuses: [...prev.statuses, newStatus],
                }
              : null
          );
        }}
      />
    );
  }

  return (
    <TicketBoard
      tickets={data.tickets}
      statuses={data.statuses}
      projectSlug={projectSlug}
      team={team}
    />
  );
}
