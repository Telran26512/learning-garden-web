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

export function SynapseLinkMark({ size = 16 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      className="syn-link-mark shrink-0"
      fill="none"
      height={size}
      viewBox="0 0 32 32"
      width={size}
    >
      <path
        d="M7.4 19.6C11.2 12 17.1 9.2 24.5 11.1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <circle cx="7.4" cy="19.6" fill="currentColor" r="2.35" />
      <circle cx="24.5" cy="11.1" fill="currentColor" r="2.05" />
    </svg>
  );
}
