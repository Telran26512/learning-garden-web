import { PublicContentDetailRoute } from "@/features/community/public-content-detail-route";

export default async function PublicContentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PublicContentDetailRoute slug={slug} />;
}
