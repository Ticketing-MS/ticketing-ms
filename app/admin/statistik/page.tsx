import { db } from "db";
import { tickets } from "db/schema";
import SummaryCard from "components/SummaryCard";

export default async function StatistikPage() {
  const allTickets = await db.select().from(tickets);

  const getStats = (team: string) => {
    const teamTickets = allTickets.filter((t) => t.team === team);
    return {
      team,
      total: teamTickets.length,
      selesai: teamTickets.filter((t) => t.status === "done").length,
      inProgress: teamTickets.filter((t) => t.status === "in_progress").length,
      pending: teamTickets.filter((t) => t.status === "open").length,
    };
  };

  const combinedStats = [getStats("cloud"), getStats("devops")];

  const summaryData = combinedStats.flatMap((stats) => [
    {
      title: `Total Tiket (${stats.team})`,
      value: stats.total,
    },
    {
      title: `Selesai (${stats.team})`,
      value: stats.selesai,
    },
    {
      title: `Dalam Proses (${stats.team})`,
      value: stats.inProgress,
    },
    {
      title: `Pending (${stats.team})`,
      value: stats.pending,
    },
  ]);

  return (
    <div className="p-6 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-semibold mb-6">Statistik Tiket per Tim</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ">
        {summaryData.map((item, index) => (
          <SummaryCard key={index} title={item.title} value={item.value} />
        ))}
      </div>
    </div>
  );
}
