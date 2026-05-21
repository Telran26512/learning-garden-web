import type { PortfolioPaperColumn } from "../model/portfolio-model";
import type { PortfolioViewData } from "../api/portfolio-live-data";
import { SectionHeading } from "./portfolio-section-heading";
import { MiniSparkline } from "./portfolio-visuals";

export function ReadingDesk({
  paperColumns,
}: {
  paperColumns: readonly PortfolioPaperColumn[];
}) {
  return (
    <section>
      <SectionHeading eyebrow="reading desk" title="论文阅读桌">
        论文不再按彩色状态卡展示,而是像书桌上的几摞材料:
        等待读、正在读、已经写完笔记。
      </SectionHeading>

      <div className="mt-10 space-y-12">
        {paperColumns.map((column) => (
          <section key={column.key}>
            <h3 className="border-b border-[var(--syn-hairline-light)] pb-3 [font-family:var(--font-display)] text-[24px] font-medium text-[var(--syn-reading-ink)]">
              {column.label}
            </h3>
            <ol className="divide-y divide-[var(--syn-hairline-light)]">
              {column.papers.map((paper) => (
                <li
                  className="grid gap-4 py-6 md:grid-cols-[150px_minmax(0,1fr)]"
                  key={paper.title}
                >
                  <p className="font-mono text-[12px] text-[var(--syn-reading-muted)]">
                    arXiv:{paper.arxiv}
                    <br />
                    {paper.year} · {paper.venue}
                  </p>
                  <div>
                    <h4 className="text-[19px] font-medium leading-7 text-[var(--syn-reading-ink)]">
                      {paper.title}
                    </h4>
                    <p className="mt-2 text-[14px] leading-6 text-[var(--syn-reading-secondary)]">
                      {paper.authors}
                      {paper.notes ? ` · ${paper.notes} notes` : ""}
                      {paper.highlights
                        ? ` · ${paper.highlights} highlights`
                        : ""}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-[var(--syn-reading-secondary)]">
                      {paper.tags.map((tag) => (
                        <span key={tag}>#{tag}</span>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </section>
  );
}

export function ExperimentLog({
  experiments,
}: {
  experiments: PortfolioViewData["experiments"];
}) {
  return (
    <section>
      <SectionHeading eyebrow="lab log" title="实验记录">
        这里只保留假设、分支和目前读数,避免把研究过程包装成运行状态大屏。
      </SectionHeading>

      <div className="mt-10 divide-y divide-[var(--syn-hairline-light)] border-y border-[var(--syn-hairline-light)]">
        {experiments.map((experiment) => (
          <article
            className="grid gap-5 py-6 md:grid-cols-[110px_minmax(0,1fr)_180px]"
            key={experiment.index}
          >
            <div className="font-mono text-[12px] text-[var(--syn-reading-muted)]">
              {experiment.index}
              <br />
              {experiment.when}
            </div>
            <div>
              <h3 className="text-[18px] font-medium text-[var(--syn-reading-ink)]">
                {experiment.name}
              </h3>
              <p className="mt-2 max-w-[680px] text-[15px] leading-[1.7] text-[var(--syn-reading-secondary)]">
                {experiment.hypothesis}
              </p>
              <p className="mt-3 font-mono text-[12px] text-[var(--syn-reading-secondary)]">
                {experiment.branch}
              </p>
            </div>
            <div className="md:text-right">
              <MiniSparkline curve={experiment.curve} />
              <p className="mt-3 text-[15px] font-medium text-[var(--syn-reading-ink)]">
                {experiment.metricValue}
              </p>
              <p className="text-[12px] text-[var(--syn-reading-secondary)]">
                {experiment.metricLabel}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
