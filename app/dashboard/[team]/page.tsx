import DashboardContent from "components/dashboard/DashboardContent";

type Props = {
  params: { team: string };
};

export default function Page({ params }: Props) {
  return <DashboardContent team={params.team} />;
}
