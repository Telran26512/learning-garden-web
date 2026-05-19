"use client";

import Link from "next/link";
import Image from "next/image";
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
      <header className="mt-5 border-b hair pb-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Image
            alt={`${profile.displayName} avatar`}
            className="h-20 w-20 rounded-full object-cover"
            height={80}
            src={profile.avatarUrl}
            width={80}
          />
          <div className="min-w-0 flex-1">
            <div className="sect-label">Public Profile</div>
            <h1 className="mt-1 text-[28px] font-bold tracking-[-0.04em]">{profile.displayName}</h1>
            <p className="mt-2 max-w-[62ch] text-[13px] leading-relaxed text-slate-600">
              {profile.bio}
            </p>
          </div>
          <div className="text-[12px] font-medium text-slate-500">
            公开主页 · follow 操作将在 M4 接入
          </div>
        </div>
        <div className="mt-7 grid grid-cols-2 border-y hair py-4 md:grid-cols-4">
          <ProfileMetric label="等级" value={`Lv.${profile.level}`} />
          <ProfileMetric label="关注者" value={String(profile.followerCount)} />
          <ProfileMetric label="正在关注" value={String(profile.followingCount)} />
          <ProfileMetric label="公开内容" value={String(profile.publicContentCount)} />
        </div>
      </header>
      <div className="grid gap-0 border-b hair sm:grid-cols-2 lg:grid-cols-4">
        {profile.stats.map((stat) => (
          <ProfileMetric key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>
    </section>
  );
}

function ProfileMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r hair px-4 py-4 last:border-r-0">
      <div className="num text-[20px] font-bold">{value}</div>
      <div className="mt-1 text-[11px] text-slate-400">{label}</div>
    </div>
  );
}
