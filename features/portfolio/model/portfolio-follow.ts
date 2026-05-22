import { followUser, unfollowUser } from "../../../lib/api/p4";

type FollowProfile = typeof followUser;
type UnfollowProfile = typeof unfollowUser;

export async function updatePortfolioFollow({
  follow = followUser,
  followed,
  handle,
  unfollow = unfollowUser,
}: {
  follow?: FollowProfile;
  followed: boolean;
  handle: string;
  unfollow?: UnfollowProfile;
}) {
  const normalizedHandle = handle.trim().replace(/^@/u, "");
  if (!normalizedHandle) {
    throw new Error("Profile handle is missing");
  }
  if (followed) {
    await unfollow(normalizedHandle);
    return false;
  }
  await follow(normalizedHandle);
  return true;
}
