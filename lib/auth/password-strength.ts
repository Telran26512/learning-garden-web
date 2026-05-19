export type PasswordStrength = {
  score: 0 | 1 | 2 | 3 | 4;
  label: "弱" | "一般" | "良好" | "强";
  hint: string;
};

export function analyzePasswordStrength(password: string): PasswordStrength {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 14) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const normalized = Math.min(4, score) as PasswordStrength["score"];
  if (normalized <= 1) {
    return {
      score: normalized,
      label: "弱",
      hint: "建议至少 8 位，混合数字与字母",
    };
  }
  if (normalized === 2) {
    return {
      score: normalized,
      label: "一般",
      hint: "再加入大小写或符号会更稳",
    };
  }
  if (normalized === 3) {
    return { score: normalized, label: "良好", hint: "已满足基础安全要求" };
  }
  return { score: normalized, label: "强", hint: "适合作为长期账号密码" };
}
