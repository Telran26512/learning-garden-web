export function SynapseLogo({ size = 24 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      className="shrink-0"
      fill="none"
      height={size}
      viewBox="0 0 32 32"
      width={size}
    >
      <circle cx="6" cy="6" fill="currentColor" opacity="0.76" r="3" />
      <circle cx="26" cy="6" fill="currentColor" opacity="0.46" r="3" />
      <circle cx="16" cy="16" fill="currentColor" r="4" />
      <circle cx="6" cy="26" fill="currentColor" opacity="0.46" r="3" />
      <circle cx="26" cy="26" fill="currentColor" opacity="0.76" r="3" />
      <path
        d="M6 6 L16 16 L26 6 M6 26 L16 16 L26 26"
        opacity="0.72"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}
