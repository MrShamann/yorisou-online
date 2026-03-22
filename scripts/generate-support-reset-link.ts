import { findAccountByEmail, createPasswordResetToken } from "@/lib/server/yorisouData";

function parseArg(flag: string) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : "";
}

function requireArg(flag: string) {
  const value = parseArg(flag);
  if (!value) {
    throw new Error(`Missing required argument: ${flag}`);
  }
  return value;
}

async function main() {
  const email = requireArg("--email").trim().toLowerCase();
  const locale = parseArg("--locale") === "en" ? "en" : "ja";
  const baseUrl = (parseArg("--base-url") || "https://yorisou.online").replace(/\/$/, "");
  const expiresInMinutes = Number.parseInt(parseArg("--expires-in") || "60", 10);

  const account = await findAccountByEmail(email);

  if (!account) {
    throw new Error(`Account not found for ${email}`);
  }

  const { token, record } = await createPasswordResetToken({
    accountId: account.id,
    email: account.email,
    expiresInMinutes,
  });
  const resetPath = locale === "en" ? "/en/reset-password" : "/reset-password";
  const resetUrl = `${baseUrl}${resetPath}?token=${encodeURIComponent(token)}`;

  console.log(JSON.stringify({
    email: account.email,
    accountId: account.id,
    expiresAt: record.expiresAt,
    resetUrl,
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
