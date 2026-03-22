export const PASSWORD_RULES = [
  {
    key: "length",
    ja: "12文字以上",
    en: "At least 12 characters",
    test: (value: string) => value.length >= 12,
  },
  {
    key: "uppercase",
    ja: "英大文字を1文字以上",
    en: "At least 1 uppercase letter",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    key: "lowercase",
    ja: "英小文字を1文字以上",
    en: "At least 1 lowercase letter",
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    key: "number",
    ja: "数字を1文字以上",
    en: "At least 1 number",
    test: (value: string) => /\d/.test(value),
  },
  {
    key: "symbol",
    ja: "記号を1文字以上",
    en: "At least 1 symbol",
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
] as const;

export function getPasswordRuleChecks(password: string) {
  return PASSWORD_RULES.map((rule) => ({
    ...rule,
    ok: rule.test(password),
  }));
}

export function isStrongPassword(password: string) {
  return getPasswordRuleChecks(password).every((rule) => rule.ok);
}

export function getPasswordPolicyMessage(locale: "ja" | "en") {
  return locale === "ja"
    ? "パスワードは12文字以上で、大文字・小文字・数字・記号をそれぞれ1文字以上含めてください。"
    : "Use 12+ characters including uppercase, lowercase, number, and symbol.";
}
