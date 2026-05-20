export function tabClass(isActive: boolean) {
  return [
    "flex h-9 items-center border-b-2 px-0 text-[13px] font-medium transition-colors",
    isActive
      ? "border-auth-ink text-auth-ink"
      : "border-transparent text-text-secondary hover:text-slate-hover",
  ].join(" ");
}

export function inputClass() {
  return "h-10 w-full border border-auth-ink/18 bg-white px-3 text-[14px] text-auth-ink outline-none transition placeholder:text-auth-ink/35 focus:border-auth-ink";
}
