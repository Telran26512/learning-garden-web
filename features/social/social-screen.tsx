"use client";

import { useState } from "react";
import type { ActivityFeedItem, Discussion, NotificationItem } from "@/lib/api";

type SocialScreenProps = {
  discussions: Discussion[];
  feed: ActivityFeedItem[];
  notifications: NotificationItem[];
  onCreateDiscussion: (input: { body: string; title: string }) => Promise<void>;
  onMarkNotificationRead: (id: string) => Promise<void>;
  onReplyToDiscussion: (discussionId: string, body: string) => Promise<void>;
};

export function SocialScreen({
  discussions,
  feed,
  notifications,
  onCreateDiscussion,
  onMarkNotificationRead,
  onReplyToDiscussion,
}: SocialScreenProps) {
  const [body, setBody] = useState("想比较正规方程和梯度下降的学习顺序。");
  const [replyBody, setReplyBody] = useState("先学正规方程能更好理解闭式解。");
  const [title, setTitle] = useState("正规方程应该在梯度下降前学吗？");

  const createDiscussion = async () => {
    await onCreateDiscussion({ body, title });
    setBody("");
    setTitle("");
  };

  return (
    <section className="py-8">
      <header className="border-b hair pb-6">
        <div className="sect-label">M4 Social Mock</div>
        <h1 className="mt-2 font-serif text-[34px] font-semibold tracking-[-0.05em]">
          学习动态、讨论和通知
        </h1>
        <p className="mt-2 max-w-[72ch] text-[13px] leading-relaxed text-slate-500">
          当前是 mock API 的同步社交流。实时通知、WebSocket 和搜索由后端接入后再替换。
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px]">
        <div>
          <section className="border-b hair py-6">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-[18px] font-semibold">动态流</h2>
              <span className="sect-label">Activity</span>
            </div>
            <div className="divide-y hair">
              {feed.map((item) => (
                <article className="py-3" key={item.id}>
                  <div className="text-[13px] font-medium">{item.summary}</div>
                  <div className="mt-1 text-[11px] text-slate-400">
                    {item.actor.displayName} · {item.target.label} · {formatShortDate(item.createdAt)}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="py-6">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-[18px] font-semibold">讨论</h2>
              <span className="sect-label">{discussions.length} threads</span>
            </div>
            <div className="grid gap-3 border-y hair py-4">
              <input
                className="inp px-3 py-2 text-[13px] focus:border-garden-600 focus:outline-none"
                onChange={(event) => setTitle(event.target.value)}
                placeholder="讨论标题"
                value={title}
              />
              <textarea
                className="inp px-3 py-2 text-[13px] focus:border-garden-600 focus:outline-none"
                onChange={(event) => setBody(event.target.value)}
                placeholder="写下你的问题或观察"
                rows={3}
                value={body}
              />
              <button
                className="focus-ring justify-self-start rounded-md bg-garden-600 px-4 py-2 text-[12px] font-medium text-white transition hover:bg-garden-700"
                onClick={createDiscussion}
                type="button"
              >
                发布讨论
              </button>
            </div>
            <div className="divide-y hair">
              {discussions.map((discussion) => (
                <article className="py-5" key={discussion.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-[15px] font-semibold">{discussion.title}</h3>
                    <span className="text-[11px] text-slate-400">
                      {discussion.replyCount} 回复 · {discussion.status}
                    </span>
                  </div>
                  <p className="mt-2 max-w-[78ch] text-[13px] leading-relaxed text-slate-600">
                    {discussion.body}
                  </p>
                  {discussion.replies.length > 0 ? (
                    <div className="mt-3 border-l hair pl-4 text-[12px] text-slate-500">
                      {discussion.replies[0]?.body}
                    </div>
                  ) : null}
                  <div className="mt-3 flex gap-2">
                    <input
                      className="inp flex-1 px-3 py-2 text-[12px] focus:border-garden-600 focus:outline-none"
                      onChange={(event) => setReplyBody(event.target.value)}
                      value={replyBody}
                    />
                    <button
                      className="focus-ring rounded-md border hair px-3 py-2 text-[12px] transition hover:bg-slate-50"
                      onClick={() => onReplyToDiscussion(discussion.id, replyBody)}
                      type="button"
                    >
                      回复
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:border-l lg:pl-8 hair">
          <h2 className="mb-3 text-[18px] font-semibold">通知</h2>
          <div className="divide-y hair border-y hair">
            {notifications.map((notification) => (
              <div className="py-3" key={notification.id}>
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-[13px] font-medium">{notification.title}</div>
                  <span className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                    {notification.readAt ? "read" : "new"}
                  </span>
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-slate-500">
                  {notification.body}
                </p>
                {!notification.readAt ? (
                  <button
                    className="mt-2 text-[12px] font-medium text-garden-700 hover:text-garden-800"
                    onClick={() => onMarkNotificationRead(notification.id)}
                    type="button"
                  >
                    标记已读
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric" }).format(
    new Date(value),
  );
}
