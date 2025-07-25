import ProfileUserForm from "components/ProfileUserForm";
import { getCurrentUser } from "lib/auth";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return <p className="text-center text-red-500">User tidak ditemukan</p>;
  }

  return <ProfileUserForm user={user} />;
}
