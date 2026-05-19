"use client";

import type { ReviewCard } from "@/lib/api";
import { cn } from "@/lib/utils/cn";

type ReviewScreenProps = {
  cards: ReviewCard[];
  userCode: string;
  setUserCode: (value: string) => void;
  showCompare: boolean;
  onCompare: () => void;
};

export function ReviewScreen({
  cards,
  userCode,
  setUserCode,
  showCompare,
  onCompare,
}: ReviewScreenProps) {
  const currentCard = cards[0];

  if (!currentCard) {
    return (
      <section className="py-6">
        <div className="rounded-[18px] border hair bg-white/45 p-6">
          <div className="sect-label">Review Queue</div>
          <h1 className="mt-2 text-[22px] font-bold">今天没有待复习卡片</h1>
          <p className="mt-2 text-[13px] text-slate-500">继续完成 Workspace 中的训练任务。</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b hair pb-3">
        <div>
          <h1 className="text-[22px] font-bold">代码纠错复习</h1>
          <p className="mt-1 text-[12px] text-slate-500">
            这里不只是回忆概念,而是重新写一次你上次写错的实现。
          </p>
        </div>
        <span className="text-[12px] text-slate-500">
          复习对象来自你的错因记录和实现题提交结果
        </span>
      </div>

      <div className="grid grid-cols-1 gap-x-9 gap-y-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="border-b hair pb-5">
            <div className="mb-2 flex items-center justify-between text-[12px] text-slate-500">
              <span>
                今日纠错队列 · 第 <b className="text-slate-700">1</b> / 6 题
              </span>
              <span>代码实现题 · 来自「线性回归」</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-garden-600" style={{ width: "16%" }} />
            </div>
          </div>

          <div className="border-b hair py-5">
            <div className="grid grid-cols-1 gap-x-7 gap-y-4 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="sect-label mb-1.5">本题要纠正的错误</div>
                <div className="text-[17px] font-semibold leading-relaxed">
                  {currentCard.errorSummary}
                </div>
              </div>
              <div className="text-[12px] lg:col-span-5 lg:border-l lg:pl-6 hair">
                <div className="sect-label mb-1.5">推导锚点</div>
                <div className="space-y-1.5 text-slate-600">
                  <div>截距项转成一列常数 1</div>
                  <div>正规方程和矩阵维度对应</div>
                  <div>直接求逆的数值稳定风险</div>
                </div>
              </div>
            </div>
          </div>

          <div className="py-5">
            <div className="mb-1 text-[15px] font-medium leading-relaxed">
              {currentCard.prompt}
            </div>
            <p className="mb-3 text-[12px] text-slate-500">
              先自己修正,再和参考实现对比。对比结束后,再判断这次到底是“记住了”还是“只是看懂了”。
            </p>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="sect-label">你的修正</span>
              <span className="text-[11px] text-slate-400">
                Python · 或{" "}
                <button className="text-garden-600" type="button">
                  上传 .py 文件
                </button>
              </span>
            </div>
            <textarea
              className="inp w-full px-3 py-2.5 font-mono text-[12px] focus:border-garden-600 focus:outline-none"
              onChange={(event) => setUserCode(event.target.value)}
              rows={9}
              value={userCode}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {!showCompare ? (
                <button
                  className="focus-ring rounded-md bg-garden-600 px-5 py-2 text-[13px] font-medium text-white transition hover:bg-garden-700"
                  onClick={onCompare}
                  type="button"
                >
                  对比参考答案
                </button>
              ) : null}
              <button
                className="focus-ring rounded-md border hair px-4 py-2 text-[13px] transition hover:bg-slate-50"
                type="button"
              >
                查看推导提示
              </button>
            </div>

            {showCompare ? <CompareResult card={currentCard} userCode={userCode} /> : null}
          </div>

          <div className="border-t hair pt-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[15px] font-semibold">今日纠错队列</h3>
              <span className="sect-label">按错因优先级排序</span>
            </div>
            <QueueList cards={cards} />
          </div>
        </div>
        <ReviewSidebar cards={cards} />
      </div>
    </section>
  );
}

function CompareResult({ card, userCode }: { card: ReviewCard; userCode: string }) {
  return (
    <div className="mt-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <div className="sect-label mb-1.5">你的实现</div>
          <pre className="h-[150px] overflow-x-auto rounded-md bg-slate-900 p-3 text-[11px] leading-relaxed text-slate-100">
            {userCode}
          </pre>
        </div>
        <div>
          <div className="sect-label mb-1.5">参考答案</div>
          <pre className="h-[150px] overflow-x-auto rounded-md bg-slate-900 p-3 text-[11px] leading-relaxed text-slate-100">
            {card.referenceCode}
          </pre>
        </div>
      </div>
      <div className="mt-3 border-l-2 border-amber-400 bg-amber-50 px-3 py-3 text-[12px] text-amber-800">
        <b>这次的关键错因</b>:你的实现缺少偏置列{" "}
        <code className="rounded bg-white/70 px-1">np.c_[np.ones(...), X]</code>
        ,模型将没有截距项 b,只能拟合过原点的直线。
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 text-[13px] md:grid-cols-3">
        {[
          ["还不会", "明天再做一次", "hover:bg-red-50 hover:border-red-200"],
          ["看懂了", "3 天后再检验", "hover:bg-amber-50 hover:border-amber-200"],
          ["能写对", "7 天后回放", "hover:bg-garden-50 hover:border-garden-200"],
        ].map(([title, sub, hover]) => (
          <button
            className={cn("focus-ring rounded-md border hair py-3 transition", hover)}
            key={title}
            type="button"
          >
            {title}
            <div className="text-[10px] text-slate-400">{sub}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function QueueList({ cards }: { cards: ReviewCard[] }) {
  return (
    <div>
      {cards.map((card, index) => (
        <div className="flex items-center gap-2.5 border-b hair py-2 last:border-0" key={card.id}>
          <span className="w-5 text-[11px] text-slate-300">{index + 1}</span>
          <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-600">
            代码纠错
          </span>
          <span className={cn("flex-1", index === 0 ? "font-medium" : "text-slate-600")}>
            {card.errorSummary}
          </span>
          <span className={cn("text-[11px]", index === 0 ? "font-medium text-garden-600" : "text-slate-400")}>
            {index === 0 ? "当前" : card.status}
          </span>
        </div>
      ))}
    </div>
  );
}

function ReviewSidebar({ cards }: { cards: ReviewCard[] }) {
  const dueCount = cards.filter((card) => card.status === "due").length;

  return (
    <aside className="lg:col-span-4 lg:border-l lg:pl-8 hair">
      <div className="border-b hair pb-5">
        <h3 className="mb-2.5 text-[15px] font-semibold">本轮纠错目标</h3>
        <div className="grid grid-cols-2 gap-y-3 border-b hair pb-4">
          <ReviewStat value={String(dueCount)} label="今日待纠错" />
          <ReviewStat value="34" label="本周已回放" />
          <ReviewStat value="82%" label="最近修正成功率" green />
          <ReviewStat value="3" label="重复错误点" />
        </div>
        <h3 className="mb-3 mt-4 text-[15px] font-semibold">错误类型分布</h3>
        <div className="space-y-2.5 border-b hair pb-4">
          {[
            { color: "#1f8a47", count: dueCount, title: "偏置项/截距处理" },
            { color: "#f59e0b", count: 2, title: "矩阵维度与转置" },
            { color: "#94a3b8", count: 1, title: "评估指标理解" },
          ].map(({ color, count, title }) => (
            <div key={title}>
              <div className="mb-1 flex justify-between text-[12px]">
                <span>{title}</span>
                <span className="text-slate-400">{count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.min(100, count * 18)}%`, background: color }}
                />
              </div>
            </div>
          ))}
        </div>
        <h3 className="mb-3 mt-4 text-[15px] font-semibold">最近 7 天回放量</h3>
        <div className="flex h-14 items-end gap-1.5">
          {["55%", "80%", "35%", "95%", "70%", "60%", "25%"].map((height, index) => (
            <div
              className={cn(
                "flex-1 rounded-sm",
                index === 3 || index === 4
                  ? "bg-garden-500"
                  : index === 6
                    ? "bg-slate-100"
                    : "bg-garden-200",
              )}
              key={height}
              style={{ height }}
            />
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-slate-300">
          {["一", "二", "三", "四", "五", "六", "日"].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
      </div>
      <div className="pt-5">
        <h3 className="mb-2.5 text-[15px] font-semibold">这题对应的推导锚点</h3>
        <div className="divide-y divide-slate-100 text-[12px]">
          {["为什么截距项要转成一列常数 1", "正规方程和矩阵维度如何对应", "什么时候不能直接求逆,需要更稳的解法"].map(
            (item) => (
              <div className="py-2" key={item}>
                {item}
              </div>
            ),
          )}
        </div>
      </div>
    </aside>
  );
}

function ReviewStat({ value, label, green }: { value: string; label: string; green?: boolean }) {
  return (
    <div>
      <div className={cn("num text-[21px] font-bold", green && "text-garden-600")}>{value}</div>
      <div className="text-[11px] text-slate-400">{label}</div>
    </div>
  );
}
