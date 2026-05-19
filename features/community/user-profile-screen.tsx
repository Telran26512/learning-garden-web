"use client";

import Link from "next/link";
import { Avatar } from "@/components/layout/top-nav";
import type { PublicProfile } from "@/lib/api";

export function UserProfileScreen({ profile }: { profile: PublicProfile }) {
  return (
    <section className="py-6">
      <Link
        className="text-[12px] font-medium text-garden-700 hover:text-garden-800"
        href="/community"
      >
        ← 返回社区
      </Link>
      <div className="mt-4 rounded-[24px] border hair bg-white/70 p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar size="lg" />
          <div className="min-w-0 flex-1">
            <div className="sect-label">Public Profile</div>
            <h1 className="mt-1 text-[28px] font-bold tracking-[-0.04em]">{profile.displayName}</h1>
            <p className="mt-2 max-w-[62ch] text-[13px] leading-relaxed text-slate-600">
              {profile.bio}
            </p>
          </div>
          <button
            className="rounded-md border border-garden-600 px-4 py-2 text-[12px] font-medium text-garden-700"
            type="button"
          >
            {profile.isFollowing ? "已关注" : "关注"}
          </button>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <ProfileMetric label="等级" value={`Lv.${profile.level}`} />
          <ProfileMetric label="关注者" value={String(profile.followerCount)} />
          <ProfileMetric label="正在关注" value={String(profile.followingCount)} />
          <ProfileMetric label="公开内容" value={String(profile.publicContentCount)} />
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {profile.stats.map((stat) => (
          <ProfileMetric key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>
    </section>
  );
}

function ProfileMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border hair bg-white/60 p-4">
      <div className="num text-[20px] font-bold">{value}</div>
      <div className="mt-1 text-[11px] text-slate-400">{label}</div>
    </div>
  );
}
