import type { ReactNode } from "react";

import type {
  CommunityFeedItem,
  CommunityReadingSession,
} from "../model/community-model";

export function AvatarTile({
  accent,
  children,
  className,
}: {
  accent: CommunityFeedItem["accent"];
  children: ReactNode;
  className: string;
}) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-[var(--syn-radius)] font-semibold ${avatarClass(accent)} ${className}`}
    >
      {children}
    </span>
  );
}

export function avatarClass(accent: CommunityFeedItem["accent"]) {
  switch (accent) {
    case "ink":
      return "border border-[var(--syn-accent)] bg-[var(--syn-accent)] text-white";
    default:
      return "border border-[var(--syn-hairline-light)] bg-[#F7F7F7] text-[var(--syn-reading-ink)]";
  }
}

export function accentText() {
  return "text-[var(--syn-accent)]";
}

export function accentBorder() {
  return "border-l-[var(--syn-hairline-light)]";
}

export function miniAvatarClass(index: number) {
  const classes = [
    "border border-[var(--syn-accent)] bg-[var(--syn-accent)] text-white",
    "border border-[var(--syn-hairline-light)] bg-[#F7F7F7] text-[var(--syn-reading-ink)]",
    "border border-[var(--syn-hairline-light)] bg-[#EFEFEF] text-[var(--syn-reading-ink)]",
    "border border-[var(--syn-hairline-light)] bg-[#F7F7F7] text-[var(--syn-reading-ink)]",
    "border border-[var(--syn-hairline-light)] bg-[#EFEFEF] text-[var(--syn-reading-ink)]",
  ];

  return classes[index] ?? classes[0];
}

export function sessionTone(tone: CommunityReadingSession["tone"]) {
  switch (tone) {
    case "ink":
      return "text-[var(--syn-accent)]";
    default:
      return "text-[var(--syn-reading-secondary)]";
  }
}
