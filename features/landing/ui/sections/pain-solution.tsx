export function LandingPainSolution() {
  return (
    <section id="product" className="sn-section sn-reveal">
      <div className="sn-shell">
        <h2 className="m-0 max-w-[1080px] text-[clamp(32px,4vw,40px)] leading-[1.14] font-semibold tracking-normal text-balance [color:var(--text-primary)] [font-family:var(--font-sans)]">
          读完三遍论文还是想不起来 §3.2 那一步——这不是你的问题，是工具的问题。
        </h2>
        <div className="mt-[60px] grid items-center gap-10 lg:grid-cols-[minmax(0,720px)_minmax(320px,1fr)]">
          <div className="max-w-[720px] text-[18px] leading-[1.7] text-text-soft">
            <p className="m-0">
              论文堆在 Zotero 里读完就忘。代码散落在 GitHub
              仓库里，半年回看搜不回是哪一步的推导。笔记孤立在 Notion
              里，公式截图既无法被检索，也不能被他人引用。
            </p>
            <p className="mt-7 mb-0">
              三个工具中间，永远缺一座桥——Synapse 是这座桥。
            </p>
          </div>
          <ProblemBridgeDiagram />
        </div>
      </div>
    </section>
  );
}

function ProblemBridgeDiagram() {
  return (
    <svg
      aria-hidden="true"
      className="h-auto w-full text-text-primary"
      viewBox="0 0 420 260"
    >
      <g fontFamily="Inter, system-ui, sans-serif" fontSize="12">
        {[
          ["Zotero", 24, 34],
          ["GitHub", 24, 106],
          ["Notion", 24, 178],
        ].map(([label, x, y]) => (
          <g key={label}>
            <rect
              fill="rgba(255,255,255,0.035)"
              height="46"
              rx="6"
              stroke="rgba(255,255,255,0.16)"
              width="92"
              x={x}
              y={y}
            />
            <text
              fill="rgba(244,244,247,0.72)"
              x={Number(x) + 18}
              y={Number(y) + 29}
            >
              {label}
            </text>
          </g>
        ))}

        {[
          "M126 57 C166 57 174 62 204 74",
          "M126 129 C164 129 176 128 204 126",
          "M126 201 C166 201 174 190 204 178",
        ].map((path, index) => (
          <path
            d={path}
            fill="none"
            key={path}
            stroke="rgba(255,255,255,0.28)"
            strokeDasharray="8 9"
            strokeLinecap="round"
            strokeWidth="1.4"
            opacity={index === 1 ? 0.9 : 0.62}
          />
        ))}

        <g transform="translate(234 42)">
          <path
            d="M74 26 L34 66 L82 106 L124 70 M82 106 L58 156 M82 106 L132 156 M34 66 L18 132"
            fill="none"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="1.4"
          />
          {[
            ["Paper", 74, 26, 15],
            ["Math", 34, 66, 13],
            ["Code", 82, 106, 17],
            ["Note", 124, 70, 13],
            ["Quote", 18, 132, 12],
            ["Run", 58, 156, 12],
            ["Link", 132, 156, 12],
          ].map(([label, cx, cy, r]) => (
            <g key={label}>
              <circle
                cx={cx}
                cy={cy}
                fill="rgba(255,255,255,0.1)"
                r={r}
                stroke="rgba(255,255,255,0.42)"
                strokeWidth="1.2"
              />
              <text
                fill="rgba(244,244,247,0.82)"
                fontSize="10"
                textAnchor="middle"
                x={cx}
                y={Number(cy) + Number(r) + 14}
              >
                {label}
              </text>
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}
