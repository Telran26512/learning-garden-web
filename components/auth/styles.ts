export function tabClass(isActive: boolean) {
  return [
    "flex h-9 items-center border-b-2 px-0 text-[13px] font-medium transition-colors",
    isActive
      ? "border-[var(--syn-accent)] text-auth-ink"
      : "border-transparent text-auth-ink/58 hover:text-auth-ink",
  ].join(" ");
}

export function inputClass() {
  return "h-10 w-full border border-auth-subtle bg-white/[0.03] px-3 text-[14px] text-auth-ink outline-none transition placeholder:text-auth-ink/35 focus:border-[var(--syn-accent)]";
}
