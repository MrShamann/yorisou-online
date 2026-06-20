type MiniAppLocale = "ja" | "en";

type MiniAppSearchParams = Record<string, string | string[] | undefined>;

function safeRedirectPath(value: string | null | undefined, fallback: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }
  return value;
}

function readFirstString(value: string | string[] | undefined) {
  if (typeof value === "string") {
    return value;
  }

  return "";
}

export function buildMiniAppResultHandoffHref(input: {
  locale: MiniAppLocale;
  searchParams: MiniAppSearchParams;
}) {
  const locale = input.locale;
  const targetPath = locale === "en" ? "/en/result" : "/result";
  const params = new URLSearchParams();

  params.set("entry_source", "mini_app");

  const returnTo = safeRedirectPath(
    readFirstString(input.searchParams.returnTo),
    locale === "en" ? "/en/support" : "/support",
  );
  params.set("returnTo", returnTo);

  const sessionContextFlags = readFirstString(input.searchParams.session_context_flags);
  if (sessionContextFlags) {
    params.set("session_context_flags", sessionContextFlags);
  }

  const lineStatus = readFirstString(input.searchParams.line_status);
  if (lineStatus) {
    params.set("line_status", lineStatus);
  }

  const lineError = readFirstString(input.searchParams.line_error);
  if (lineError) {
    params.set("line_error", lineError);
  }

  const lineFriendship = readFirstString(input.searchParams.line_friendship);
  if (lineFriendship) {
    params.set("line_friendship", lineFriendship);
  }

  const query = params.toString();
  return query ? `${targetPath}?${query}` : targetPath;
}

export function buildMiniAppCheckInHandoffHref(input: {
  locale: MiniAppLocale;
  searchParams: MiniAppSearchParams;
}) {
  const locale = input.locale;
  const targetPath = locale === "en" ? "/en/check-in" : "/check-in";
  const params = new URLSearchParams();

  params.set("source", "mini_app");
  params.set("entry_source", "mini_app");

  const sessionContextFlags = readFirstString(input.searchParams.session_context_flags);
  if (sessionContextFlags) {
    params.set("session_context_flags", sessionContextFlags);
  }

  const lineStatus = readFirstString(input.searchParams.line_status);
  if (lineStatus) {
    params.set("line_status", lineStatus);
  }

  const lineError = readFirstString(input.searchParams.line_error);
  if (lineError) {
    params.set("line_error", lineError);
  }

  const lineFriendship = readFirstString(input.searchParams.line_friendship);
  if (lineFriendship) {
    params.set("line_friendship", lineFriendship);
  }

  const query = params.toString();
  return query ? `${targetPath}?${query}` : targetPath;
}
