import type { GraphSideListRow } from "@/lib/types/synapse";
import { getAttentionGraph } from "../../data/attention-graph";
import {
  GRAPH_LEGEND_ITEMS,
  RECENT_LINK_ROWS,
  TOP_HUB_ROWS,
} from "../../data/graph-demo";
import { ForceGraph } from "../force-graph";

const LEGEND_DOT_CLASSES: Record<string, string> = {
  Math: "sn-legend-dot-math",
  Code: "sn-legend-dot-code",
  Paper: "sn-legend-dot-paper",
  Concept: "sn-legend-dot-concept",
};

export function LandingGraphDemo() {
  const graph = getAttentionGraph();

  return (
    <section id="graph" className="sn-section sn-reveal">
      <div className="sn-shell">
        <div className="sn-graph-layout">
          <div className="sn-card sn-graph-card">
            <div className="sn-graph-toolbar">
              <div className="sn-graph-meta">
                <span className="sn-live-label">● LIVE</span>
                <span>u/zhe-li · Transformer 精读 · 28 nodes · 41 edges</span>
              </div>
            </div>
            <div className="sn-graph-canvas-shell">
              <ForceGraph
                nodes={graph.nodes}
                links={graph.links}
                width={720}
                height={440}
              />
            </div>
          </div>

          <div className="sn-graph-side">
            <GraphLegend />
            <SideList title="Top hubs" rows={TOP_HUB_ROWS} />
            <SideList title="Recent Links" rows={RECENT_LINK_ROWS} accent />
          </div>
        </div>
      </div>
    </section>
  );
}

function GraphLegend() {
  return (
    <div className="sn-card sn-panel-card">
      <div className="sn-panel-kicker">Legend</div>
      <div className="sn-legend-list">
        {GRAPH_LEGEND_ITEMS.map(([name]) => (
          <div key={name} className="sn-legend-item">
            <span
              className={["sn-legend-dot", LEGEND_DOT_CLASSES[name] ?? ""].join(
                " ",
              )}
            />
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}

function SideList({
  title,
  rows,
  accent = false,
}: {
  title: string;
  rows: readonly GraphSideListRow[];
  accent?: boolean;
}) {
  return (
    <div className="sn-card sn-panel-card">
      <div className="sn-panel-kicker">{title}</div>
      {rows.map(([left, right, time]) => (
        <div key={left} className="sn-side-row">
          <div
            className={[
              "sn-side-row-body",
              accent ? "sn-side-row-body-accent" : "",
            ].join(" ")}
          >
            <span>{left}</span>
            <span
              className={[
                "sn-num sn-side-row-meta",
                accent ? "sn-side-row-meta-accent" : "",
              ].join(" ")}
            >
              {right}
              <span className="sn-side-row-time"> · {time}</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
