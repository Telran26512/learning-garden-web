export function SynapseLogo({ size = 24 }: { size?: number }) {
  const gradientId = `synapse-logo-${size}`;

  return (
    <svg
      aria-hidden="true"
      className="shrink-0"
      fill="none"
      height={size}
      viewBox="0 0 32 32"
      width={size}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="32" y1="0" y2="32">
          <stop offset="0%" stopColor="var(--brand-cyan)" />
          <stop offset="55%" stopColor="var(--brand-violet)" />
          <stop offset="100%" stopColor="var(--brand-pink)" />
        </linearGradient>
      </defs>
      <circle cx="6" cy="6" fill={`url(#${gradientId})`} r="3" />
      <circle cx="26" cy="6" fill={`url(#${gradientId})`} r="3" />
      <circle cx="16" cy="16" fill={`url(#${gradientId})`} r="4" />
      <circle cx="6" cy="26" fill={`url(#${gradientId})`} r="3" />
      <circle cx="26" cy="26" fill={`url(#${gradientId})`} r="3" />
      <path
        d="M6 6 L16 16 L26 6 M6 26 L16 16 L26 26"
        opacity="0.72"
        stroke={`url(#${gradientId})`}
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}
