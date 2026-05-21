export function MiniSparkline({ curve }: { curve: readonly number[] }) {
  const max = Math.max(...curve);
  const min = Math.min(...curve);
  const span = Math.max(1, max - min);
  const points = curve
    .map((value, index) => {
      const x = (index / Math.max(1, curve.length - 1)) * 140;
      const y = 44 - ((value - min) / span) * 36;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg aria-hidden="true" className="ml-auto h-12 w-36" viewBox="0 0 140 52">
      <polyline
        fill="none"
        points={points}
        stroke="var(--syn-accent)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
      <line
        stroke="var(--syn-hairline-light)"
        x1="0"
        x2="140"
        y1="48"
        y2="48"
      />
    </svg>
  );
}

export function heatmapColor(level: 0 | 1 | 2 | 3 | 4) {
  switch (level) {
    case 0:
      return "bg-[#F2F2F2]";
    case 1:
      return "bg-[#E5E5E5]";
    case 2:
      return "bg-[#CCCCCC]";
    case 3:
      return "bg-[#888888]";
    case 4:
      return "bg-[#3F3329]";
    default:
      return "bg-[#F2F2F2]";
  }
}
