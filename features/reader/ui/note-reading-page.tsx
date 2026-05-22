"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  addComment,
  fetchReadingDocument,
  followUser,
  recordView,
  unfollowUser,
  type P4Comment,
  type P4ReadingDocument,
} from "@/lib/api/p4";
import {
  fetchRelatedContent,
  type P6SearchHit,
  type P6SearchResult,
} from "@/lib/api/p6";
import {
  parseReaderMarkdown,
  type ReaderMarkdownBlock,
} from "../model/reader-markdown";
import { runReaderAction, type ReaderAction } from "../model/reading-actions";
import {
  ReaderMarkdownContent,
  type ReaderMarginPreview,
} from "./reader-markdown-content";

export function NoteReadingPage({ noteId }: { noteId: string }) {
  const router = useRouter();
  const [document, setDocument] = useState<P4ReadingDocument | null>(null);
  const [related, setRelated] = useState<P6SearchResult | null>(null);
  const [commentBody, setCommentBody] = useState("");
  const [loadError, setLoadError] = useState("");
  const [relatedError, setRelatedError] = useState("");
  const [notice, setNotice] = useState("");
  const [pendingAction, setPendingAction] = useState<ReaderAction | null>(null);
  const [activePreview, setActivePreview] =
    useState<ReaderMarginPreview | null>(null);

  useEffect(() => {
    if (!noteId) return;
    let cancelled = false;
    fetchReadingDocument(noteId)
      .then((next) => {
        if (!cancelled) {
          setDocument(next);
          setLoadError("");
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setDocument(null);
          setLoadError(
            error instanceof Error ? error.message : "公开 Note 加载失败",
          );
        }
      });
    recordView(noteId).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [noteId]);

  useEffect(() => {
    if (!noteId) return;
    let cancelled = false;
    fetchRelatedContent(noteId, { limit: 8 })
      .then((next) => {
        if (!cancelled) {
          setRelated(next);
          setRelatedError("");
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setRelated(null);
          setRelatedError(
            error instanceof Error ? error.message : "相关内容加载失败",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [noteId]);

  const markdownBlocks = useMemo(
    () =>
      parseReaderMarkdown(document?.document.item.body ?? "", {
        stripFirstH1: true,
      }),
    [document],
  );

  if (!noteId) {
    return <ReaderEmptyState message="缺少 Note ID。" />;
  }

  if (!document) {
    return (
      <ReaderEmptyState
        message={
          loadError
            ? `公开 Note 加载失败：${loadError}`
            : "正在加载公开 Note..."
        }
      />
    );
  }

  const { author } = document;
  const { counts, item, viewer } = document.document;
  const apiToc = document.document.toc.filter(
    (entry) => entry.title.trim() !== item.title.trim(),
  );
  const toc = apiToc.length > 0 ? apiToc : createTocFromBlocks(markdownBlocks);
  const readMinutes = estimateReadMinutes(item.body);
  const publishedDate = formatFullDate(item.createdAt || item.updatedAt);

  async function refresh() {
    const next = await fetchReadingDocument(noteId);
    setDocument(next);
  }

  async function handleFollow() {
    await runReaderAction({
      action: "follow",
      execute: () =>
        viewer.following
          ? unfollowUser(author.handle)
          : followUser(author.handle),
      refresh,
      setNotice,
      setPendingAction,
    });
  }

  async function handleCommentSubmit() {
    const body = commentBody.trim();
    if (!body) return;
    const ok = await runReaderAction({
      action: "comment",
      execute: () => addComment(noteId, body),
      refresh,
      setNotice,
      setPendingAction,
    });
    if (ok) {
      setCommentBody("");
    }
  }

  return (
    <section className="syn-reading-mode min-h-[calc(100dvh-3.5rem)] bg-[var(--syn-reading-bg)] text-[var(--syn-reading-ink)]">
      <div className="grid max-w-none gap-8 px-4 py-10 sm:px-5 xl:grid-cols-[280px_minmax(0,1fr)] xl:px-6">
        <main className="order-1 min-w-0 xl:order-2">
          <button
            className="mb-5 text-[13px] italic text-text-muted transition hover:text-[var(--syn-accent)] hover:underline hover:decoration-[0.5px] hover:underline-offset-4"
            onClick={() => router.push("/app?view=explore")}
            type="button"
          >
            ← Explore
          </button>

          <article className="border-b border-[var(--syn-hairline-light)] pb-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-muted">
              {formatKindLabel(item.kind)}
            </p>
            <h1 className="syn-title mt-2 text-[36px] leading-tight text-[var(--syn-reading-ink)]">
              {item.title}
            </h1>
            <AuthorHeaderMeta
              author={author}
              counts={counts}
              disabled={pendingAction !== null}
              following={viewer.following}
              onFollow={handleFollow}
              pending={pendingAction === "follow"}
              publishedDate={publishedDate}
              readMinutes={readMinutes}
            />
            <p className="mt-6 max-w-[900px] text-[16px] leading-[1.8] text-[var(--syn-reading-secondary)]">
              {item.summary}
            </p>
            {notice ? (
              <p className="mt-3 text-[12px] text-[var(--syn-accent)]">
                {notice}
              </p>
            ) : null}
          </article>

          <ReaderMarkdownContent
            blocks={markdownBlocks}
            onPreviewChange={setActivePreview}
          />

          <DiscussionPanel
            commentBody={commentBody}
            comments={document.document.comments}
            disabled={pendingAction !== null || !commentBody.trim()}
            onChange={setCommentBody}
            onSubmit={handleCommentSubmit}
            pending={pendingAction === "comment"}
          />
        </main>

        <aside className="order-2 min-w-0 xl:order-1">
          <div className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-auto pr-1 text-[13px] leading-6 text-[#555]">
            <TocPanel toc={toc} />
            <MarginPreviewPanel preview={activePreview} />
            <ReferencePanel
              items={document.document.cites.map((row) => row.item)}
              title="Cites"
            />
            <ReferencePanel
              items={document.document.citedBy.map((row) => row.source)}
              title="Cited by"
            />
            <RelatedPanel
              error={relatedError}
              items={related?.items ?? []}
              title="Related"
            />
          </div>
        </aside>
      </div>
    </section>
  );
}

function AuthorHeaderMeta({
  author,
  counts,
  disabled,
  following,
  onFollow,
  pending,
  publishedDate,
  readMinutes,
}: {
  author: P4ReadingDocument["author"];
  counts: P4ReadingDocument["document"]["counts"];
  disabled: boolean;
  following: boolean;
  onFollow: () => void;
  pending: boolean;
  publishedDate: string;
  readMinutes: number;
}) {
  return (
    <div className="mt-5 grid grid-cols-[32px_minmax(0,1fr)] gap-3">
      <div className="grid size-8 place-items-center rounded-[var(--syn-radius)] bg-[var(--syn-accent)] font-mono text-[11px] text-white">
        {getInitials(author.displayName || author.handle)}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[14px] leading-5">
          <span className="font-medium text-[var(--syn-reading-ink)]">
            {author.displayName || author.handle}
          </span>
          <span className="italic text-text-muted">@{author.handle}</span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] italic text-text-muted">
          <span>· {publishedDate}</span>
          <span>· {readMinutes} min read</span>
          <span>·</span>
          <button
            className="h-6 border border-[var(--syn-accent)] bg-transparent px-3 text-[12px] leading-none text-[var(--syn-accent)] transition hover:bg-[var(--syn-accent-soft)] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={disabled}
            onClick={onFollow}
            type="button"
          >
            {pending ? "..." : following ? "Following" : "+ Follow"}
          </button>
        </div>
        <p className="mt-2 font-mono text-[12px] leading-5 text-text-muted">
          {counts.views} reads · {counts.comments} replies · {counts.likes}{" "}
          likes
        </p>
      </div>
    </div>
  );
}

function MarginPreviewPanel({
  preview,
}: {
  preview: ReaderMarginPreview | null;
}) {
  return (
    <section className="border-b border-[var(--syn-hairline-light)] py-6">
      <MarginHeading>Margin preview</MarginHeading>
      {preview ? (
        <div className="mt-4">
          <p className="font-mono text-[11px] text-text-muted">
            {preview.kicker}
          </p>
          <h2 className="mt-2 text-[15px] font-semibold text-[var(--syn-reading-ink)]">
            {preview.title}
          </h2>
          <p className="mt-2 text-[13px] leading-6 text-[#555]">
            {preview.body}
          </p>
        </div>
      ) : (
        <p className="mt-4 text-[12px] italic text-text-muted">
          hover a concept, paper, or cross-reference
        </p>
      )}
    </section>
  );
}

function DiscussionPanel({
  commentBody,
  comments,
  disabled,
  onChange,
  onSubmit,
  pending,
}: {
  commentBody: string;
  comments: P4Comment[];
  disabled: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  pending: boolean;
}) {
  return (
    <section className="mt-14 border-t border-[var(--syn-hairline-light)] pt-7">
      <h2 className="text-[13px] italic text-text-muted">
        discussion · {comments.length} replies
      </h2>

      <div className="mt-6">
        <textarea
          className="min-h-20 w-full resize-none border-0 border-b border-[var(--syn-hairline-light)] bg-transparent px-0 text-[15px] leading-7 text-[var(--syn-reading-ink)] outline-none transition placeholder:italic placeholder:text-text-muted focus:border-[var(--syn-accent)]"
          onChange={(event) => onChange(event.target.value)}
          placeholder="add a comment, derivation, or citable question..."
          value={commentBody}
        />
        <div className="mt-3 flex items-center justify-between gap-4">
          <span className="text-[12px] text-[var(--syn-reading-muted)]">
            支持 @mention, 发布后会进入通知流。
          </span>
          <button
            className={[
              "h-8 border px-4 text-[13px] transition",
              disabled
                ? "cursor-not-allowed border-[var(--syn-hairline-light)] text-text-muted"
                : "border-[var(--syn-accent)] bg-transparent text-[var(--syn-accent)] hover:bg-[var(--syn-accent-soft)]",
            ].join(" ")}
            disabled={disabled}
            onClick={onSubmit}
            type="button"
          >
            {pending ? "posting..." : "post →"}
          </button>
        </div>
      </div>

      <div className="mt-7">
        {comments.length === 0 ? (
          <p className="text-[13px] italic text-text-muted">
            no discussion yet
          </p>
        ) : (
          comments.map((comment) => (
            <article
              className="grid grid-cols-[34px_minmax(0,1fr)] gap-3 border-t border-[var(--syn-hairline-light)] py-5"
              key={comment.id}
            >
              <div className="grid size-8 place-items-center rounded-[var(--syn-radius)] bg-[var(--syn-accent-soft)] font-mono text-[11px] text-[var(--syn-accent)]">
                {getInitials(comment.authorName || comment.authorHandle)}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-text-muted">
                  <div className="truncate">
                    {comment.authorName || comment.authorHandle}
                  </div>
                  <span>·</span>
                  <div>{formatShortDate(comment.createdAt)}</div>
                </div>
                <p className="mt-2 text-[15px] leading-7 text-[var(--syn-reading-secondary)]">
                  {comment.body}
                </p>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function MarginHeading({ children }: { children: string }) {
  return <h2 className="text-[12px] italic text-text-muted">{children}</h2>;
}

function TocPanel({
  toc,
}: {
  toc: { id: string; level: number; title: string }[];
}) {
  return (
    <section className="border-b border-[var(--syn-hairline-light)] pb-6 pt-0">
      <MarginHeading>目录</MarginHeading>
      <nav className="mt-4 space-y-2">
        {toc.map((entry, index) => (
          <a
            className={[
              "block truncate border-l py-1 text-[12px] transition hover:border-[var(--syn-accent)] hover:text-[var(--syn-accent)]",
              index === 0
                ? "border-[var(--syn-accent)] text-[var(--syn-reading-ink)]"
                : "border-transparent text-[#555]",
            ].join(" ")}
            href={`#${entry.id}`}
            key={entry.id}
            style={{ paddingLeft: 8 + (entry.level - 1) * 12 }}
          >
            {entry.title}
          </a>
        ))}
      </nav>
    </section>
  );
}

function RelatedPanel({
  error,
  items,
  title,
}: {
  error: string;
  items: P6SearchHit[];
  title: string;
}) {
  return (
    <section className="border-b border-[var(--syn-hairline-light)] py-6">
      <MarginHeading>{title}</MarginHeading>
      <div className="mt-4 space-y-3">
        {error ? (
          <p className="text-[12px] italic leading-5 text-text-muted">
            相关内容接口请求失败：{error}
          </p>
        ) : null}
        {!error && items.length === 0 ? (
          <p className="text-[12px] italic text-text-muted">
            no related notes yet
          </p>
        ) : null}
        {items.map((item) => (
          <a
            className="block text-[13px] leading-5 text-[#555] transition hover:text-[var(--syn-accent)]"
            href={`/app?view=note&id=${encodeURIComponent(item.noteId)}`}
            key={item.id}
          >
            <span className="block font-medium text-[var(--syn-reading-ink)]">
              {formatRelatedTitle(item.title)}
            </span>
            <span className="mt-1 line-clamp-2 block font-mono text-[11px] text-text-muted">
              {item.kind}
              {item.blockKind ? ` · ${item.blockKind}` : ""} · {item.preview}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function ReferencePanel({
  items,
  title,
}: {
  items: { id: string; title: string }[];
  title: string;
}) {
  return (
    <section className="border-b border-[var(--syn-hairline-light)] py-6">
      <MarginHeading>{title}</MarginHeading>
      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <p className="text-[12px] italic text-text-muted">no citations yet</p>
        ) : (
          items.map((item) => (
            <a
              className="block text-[13px] leading-5 text-[#555] hover:text-[var(--syn-accent)]"
              href={`/app?view=note&id=${encodeURIComponent(item.id)}`}
              key={item.id}
            >
              {item.title}
            </a>
          ))
        )}
      </div>
    </section>
  );
}

function ReaderEmptyState({ message }: { message: string }) {
  return (
    <section className="grid min-h-[calc(100dvh-3.5rem)] place-items-center bg-[var(--syn-reading-bg)] text-[var(--syn-reading-secondary)]">
      {message}
    </section>
  );
}

function getInitials(value: string) {
  const normalized = value.trim();
  if (!normalized) return "U";
  return normalized
    .split(/[\s_-]+/u)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatShortDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("zh-CN", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
  }).format(date);
}

function formatFullDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "2026-05-21";

  return date.toISOString().slice(0, 10);
}

function estimateReadMinutes(markdown: string) {
  const text = markdown
    .replace(/::[a-z]+(?:\{[^}]*\})?/giu, "")
    .replace(/::concept\[([^\]]+)\]/gu, "$1")
    .replace(/[#>*_`]/gu, "")
    .trim();
  const units = Math.max(text.length / 420, text.split(/\s+/u).length / 180);

  return Math.max(1, Math.round(units));
}

function formatKindLabel(kind: string) {
  if (kind === "paper") return "PAPER NOTE";
  if (kind === "experiment") return "EXPERIMENT";
  if (kind === "track") return "TRACK";

  return "CONCEPT";
}

function formatRelatedTitle(title: string) {
  return title.replace(/\s+\d{8,}(?=\s|$)/gu, "");
}

function createTocFromBlocks(blocks: ReaderMarkdownBlock[]) {
  return blocks
    .filter(
      (block): block is Extract<ReaderMarkdownBlock, { type: "heading" }> =>
        block.type === "heading",
    )
    .map((block) => ({
      id: block.id,
      level: block.level - 1,
      title: block.text,
    }));
}
