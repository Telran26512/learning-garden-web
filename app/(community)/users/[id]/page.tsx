import { UserProfileRoute } from "@/features/community/user-profile-route";

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <UserProfileRoute id={id} />;
}
