import { SectionEyebrow } from "../primitives/section-eyebrow";
import { WORKFLOW_EVENTS } from "../data/workflow";
import { blockColor } from "../utils/block-color";

export function LandingWorkflow() {
  return (
    <section id="workflow" className="sn-section sn-section-quiet sn-reveal">
      <div className="sn-shell">
        <div className="sn-workflow-head">
          <div>
            <SectionEyebrow>04 / 使用流</SectionEyebrow>
            <h2 className="sn-section-title sn-section-title-small">
              一条 Track 是这样长出来的。
            </h2>
          </div>
          <p>
            不把步骤包装成营销流程，只保留产品里会留下的真实事件：导入、锚定、实现、发布。
          </p>
        </div>

        <div className="sn-workflow-log sn-reveal sn-reveal-list">
          {WORKFLOW_EVENTS.map((event) => (
            <article key={event.time} className="sn-workflow-event">
              <div className="sn-workflow-time">{event.time}</div>
              <div
                className="sn-workflow-dot"
                style={{ background: blockColor(event.kind) }}
              />
              <div className="sn-workflow-body">
                <div className="sn-workflow-label">{event.label}</div>
                <h3>{event.title}</h3>
                <p>{event.detail}</p>
                <div className="sn-workflow-meta">
                  {event.meta.map((item, index) => (
                    <span key={item}>
                      {index > 0 ? "· " : ""}
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
