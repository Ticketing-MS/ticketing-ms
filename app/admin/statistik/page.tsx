import { db } from "db";
import { tickets } from "db/schema";
import { eq } from "drizzle-orm";
import SummaryCard from "components/SummaryCard";

export default async function StatistikPage() {
  const allTickets = await db.select().from(tickets);

  const cloudTickets = allTickets.filter((t) => t.team === "cloud");
  const devopsTickets = allTickets.filter((t) => t.team === "devops");

  const getStats = (data: typeof allTickets) => ({
    total: data.length,
    selesai: data.filter((t) => t.status === "done").length,
    inProgress: data.filter((t) => t.status === "in_progress").length,
    pending: data.filter((t) => t.status === "open").length,
  });

  const cloudStats = getStats(cloudTickets);
  const devopsStats = getStats(devopsTickets);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold font-bold text-gray-900 mb-6 ">Statistik Tiket per Tim</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-600 mb-4">Tim Cloud</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SummaryCard title="Total Tiket" value={cloudStats.total} />
          <SummaryCard title="Selesai" value={cloudStats.selesai} />
          <SummaryCard title="Dalam Proses" value={cloudStats.inProgress} />
          <SummaryCard title="Pending" value={cloudStats.pending} />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-600 mb-4">Tim DevOps</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SummaryCard title="Total Tiket" value={devopsStats.total} />
          <SummaryCard title="Selesai" value={devopsStats.selesai} />
          <SummaryCard title="Dalam Proses" value={devopsStats.inProgress} />
          <SummaryCard title="Pending" value={devopsStats.pending} />
        </div>
      </div>
    </div>
  );
}