import Link from "next/link";

import { trackWriting } from "../model/portfolio-copy";
import type { PortfolioNote, PortfolioTrack } from "../model/portfolio-model";
import { SectionHeading } from "./portfolio-section-heading";

export function TrackSection({
  description,
  tracks,
}: {
  description: string;
  tracks: readonly PortfolioTrack[];
}) {
  return (
    <section>
      <SectionHeading eyebrow="tracks in progress" title="正在推进的研究线索">
        {description}
      </SectionHeading>

      <div className="mt-10 divide-y divide-[var(--syn-hairline-light)] border-y border-[var(--syn-hairline-light)]">
        {tracks.map((track) => {
          const writing = trackWriting[track.title] ?? {
            context: track.description,
            excerpt: track.description,
          };

          return (
            <article
              className="grid gap-6 py-8 md:grid-cols-[220px_minmax(0,1fr)] md:py-10"
              key={track.title}
            >
              <div>
                <h3 className="[font-family:var(--font-display)] text-[26px] font-medium leading-[1.12] text-[var(--syn-reading-ink)]">
                  {track.title}
                </h3>
                <p className="mt-4 font-mono text-[11px] text-[var(--syn-reading-muted)]">
                  updated {track.updated}
                </p>
              </div>
              <div className="max-w-[760px]">
                <p className="text-[16px] leading-[1.8] text-[#4F463D]">
                  {writing.context}
                </p>
                <blockquote className="mt-5 border-l border-[var(--syn-hairline-light)] pl-5 text-[17px] leading-[1.75] text-[var(--syn-reading-ink)]">
                  “{writing.excerpt}”
                </blockquote>
                <Link
                  className="mt-6 inline-flex border-b border-[var(--syn-accent)] pb-0.5 text-[13px] text-[var(--syn-accent)] transition hover:border-[var(--syn-accent-hover)] hover:text-[var(--syn-accent-hover)]"
                  href="/app?view=portfolio&tab=notes"
                >
                  Read related notes
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function NotesTimeline({
  description,
  notesToShow,
}: {
  description: string;
  notesToShow: readonly PortfolioNote[];
}) {
  return (
    <section>
      <SectionHeading eyebrow="recent notes" title="最近发布和更新">
        {description}
      </SectionHeading>

      <ol className="mt-10 border-l border-[#D1C8BC]">
        {notesToShow.map((note) => (
          <li className="relative pl-7" key={`${note.title}-${note.time}`}>
            <span className="absolute -left-[4.5px] top-2 size-[8px] rounded-full bg-[var(--syn-accent)]" />
            <article className="border-b border-[var(--syn-hairline-light)] pb-8 pt-0 first:pt-0 [&+&]:pt-8">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <time className="font-mono text-[12px] text-[var(--syn-reading-muted)]">
                  {note.time}
                </time>
                <span className="text-[13px] text-[#A09689]">/</span>
                <span className="text-[13px] text-[var(--syn-accent)]">
                  {note.track}
                </span>
              </div>
              <h3 className="mt-2 [font-family:var(--font-display)] text-[24px] font-medium leading-[1.2] text-[var(--syn-reading-ink)]">
                {note.title}
              </h3>
              <p className="mt-3 max-w-[760px] text-[15px] leading-[1.75] text-[var(--syn-reading-secondary)]">
                {note.excerpt}
              </p>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
