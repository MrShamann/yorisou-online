"use client";

import { useEffect, useMemo, useState } from "react";

type Locale = "ja" | "en";

type LiffProfile = {
  userId?: string;
  displayName?: string;
  pictureUrl?: string;
};

type LiffRuntimeState = {
  phase: "idle" | "loading_sdk" | "initializing" | "ready" | "missing_config" | "error";
  issue: "missing_config" | "endpoint_mismatch" | "sdk_load_failed" | "init_failed" | null;
  liffId: string | null;
  endpointUrl: string | null;
  currentUrl: string | null;
  currentPathname: string | null;
  expectedEndpointPath: string | null;
  isInClient: boolean | null;
  isLoggedIn: boolean | null;
  profile: LiffProfile | null;
  error: string | null;
  endpointOk: boolean | null;
};

type Props = {
  locale?: Locale;
  currentPath: string;
};

declare global {
  interface Window {
    liff?: {
      init: (input: { liffId: string; withLoginOnExternalBrowser?: boolean }) => Promise<void> | void;
      isInClient?: () => boolean;
      isLoggedIn?: () => boolean;
      getProfile?: () => Promise<LiffProfile>;
    };
  }
}

const LIFF_SDK_SRC = "https://static.line-scdn.net/liff/edge/2/sdk.js";

function getEnvLiffId() {
  return (process.env.NEXT_PUBLIC_LIFF_ID || "").trim();
}

function getEnvLiffEndpoint() {
  return (process.env.NEXT_PUBLIC_LIFF_ENDPOINT_URL || "").trim();
}

function normalizePathname(pathname: string) {
  if (!pathname) {
    return "/";
  }

  const normalized = pathname.replace(/\/+$/, "");
  return normalized || "/";
}

function resolveEndpointCompatibility(endpointUrl: string, currentUrl: string) {
  if (!endpointUrl) {
    return {
      compatible: false,
      expectedEndpointPath: null,
      currentPathname: normalizePathname(new URL(currentUrl).pathname),
    };
  }

  try {
    const expectedEndpointPath = normalizePathname(new URL(endpointUrl).pathname);
    const currentPathname = normalizePathname(new URL(currentUrl).pathname);
    return {
      compatible: currentPathname === expectedEndpointPath,
      expectedEndpointPath,
      currentPathname,
    };
  } catch {
    return {
      compatible: false,
      expectedEndpointPath: null,
      currentPathname: null,
    };
  }
}

function loadLiffSdk() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("window_unavailable"));
  }

  if (window.liff) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-yorisou-liff-sdk="true"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("liff_sdk_load_failed")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = LIFF_SDK_SRC;
    script.async = true;
    script.dataset.yorisouLiffSdk = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("liff_sdk_load_failed"));
    document.head.appendChild(script);
  });
}

export default function ResultLiffBridge({ locale = "ja", currentPath }: Props) {
  const [state, setState] = useState<LiffRuntimeState>({
    phase: "idle",
    issue: null,
    liffId: null,
    endpointUrl: null,
    currentUrl: null,
    currentPathname: null,
    expectedEndpointPath: null,
    isInClient: null,
    isLoggedIn: null,
    profile: null,
    error: null,
    endpointOk: null,
  });

  const copy = useMemo(
    () => ({
      ja: {
        title: "LIFF smoke check",
        ready: "LIFF 初期化済み",
        inClient: "LINE内",
        external: "外部ブラウザ",
        loggedIn: "ログイン済み",
        loggedOut: "未ログイン",
        profileReady: "プロフィール取得済み",
        profilePending: "プロフィール未取得",
        missingConfig: "LIFF ID が未設定です",
        readOnly: "この表示は確認用です。結果データは変更しません。",
        endpoint: "エンドポイント",
      },
      en: {
        title: "LIFF smoke check",
        ready: "LIFF initialized",
        inClient: "Inside LINE",
        external: "External browser",
        loggedIn: "Logged in",
        loggedOut: "Not logged in",
        profileReady: "Profile fetched",
        profilePending: "Profile not fetched",
        missingConfig: "LIFF ID is not configured",
        readOnly: "This is a verification view only. It never mutates result data.",
        endpoint: "Endpoint",
      },
    }),
    [],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!currentPath.startsWith("/result")) {
      return;
    }

    const liffId = getEnvLiffId();
    const endpointUrl = getEnvLiffEndpoint();
    const currentUrl = window.location.href;
    const endpointStatus = resolveEndpointCompatibility(endpointUrl, currentUrl);

    if (!liffId) {
      setState({
        phase: "missing_config",
        issue: "missing_config",
        liffId: null,
        endpointUrl: endpointUrl || null,
        currentUrl,
        currentPathname: endpointStatus.currentPathname,
        expectedEndpointPath: endpointStatus.expectedEndpointPath,
        isInClient: null,
        isLoggedIn: null,
        profile: null,
        error: endpointUrl ? `endpoint:${endpointUrl}` : null,
        endpointOk: endpointStatus.compatible,
      });
      return;
    }

    let cancelled = false;

    async function initLiff() {
      try {
        setState({
          phase: "loading_sdk",
          issue: endpointStatus.compatible ? null : "endpoint_mismatch",
          liffId,
          endpointUrl: endpointUrl || null,
          currentUrl,
          currentPathname: endpointStatus.currentPathname,
          expectedEndpointPath: endpointStatus.expectedEndpointPath,
          isInClient: null,
          isLoggedIn: null,
          profile: null,
          error: null,
          endpointOk: endpointStatus.compatible,
        });

        await loadLiffSdk();
        if (cancelled) {
          return;
        }

        const liff = window.liff;
        if (!liff || typeof liff.init !== "function") {
          throw new Error("liff_sdk_unavailable");
        }

        setState((current) => ({
          ...current,
          phase: "initializing",
        }));

        await liff.init({
          liffId,
          withLoginOnExternalBrowser: true,
        });

        if (cancelled) {
          return;
        }

        const isInClient = typeof liff.isInClient === "function" ? liff.isInClient() : null;
        const isLoggedIn = typeof liff.isLoggedIn === "function" ? liff.isLoggedIn() : null;

        let profile: LiffProfile | null = null;
        if (isLoggedIn && typeof liff.getProfile === "function") {
          try {
            profile = await liff.getProfile();
          } catch {
            profile = null;
          }
        }

        if (cancelled) {
          return;
        }

        setState({
          phase: "ready",
          issue: endpointStatus.compatible ? null : "endpoint_mismatch",
          liffId,
          endpointUrl: endpointUrl || null,
          currentUrl,
          currentPathname: endpointStatus.currentPathname,
          expectedEndpointPath: endpointStatus.expectedEndpointPath,
          isInClient,
          isLoggedIn,
          profile,
          error: null,
          endpointOk: endpointStatus.compatible,
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        const errorMessage = error instanceof Error ? error.message : "liff_initialization_failed";
        const issue =
          errorMessage === "liff_sdk_load_failed" || errorMessage === "liff_sdk_unavailable"
            ? "sdk_load_failed"
            : endpointStatus.compatible
              ? "init_failed"
              : "endpoint_mismatch";

        setState({
          phase: "error",
          issue,
          liffId,
          endpointUrl: endpointUrl || null,
          currentUrl,
          currentPathname: endpointStatus.currentPathname,
          expectedEndpointPath: endpointStatus.expectedEndpointPath,
          isInClient: null,
          isLoggedIn: null,
          profile: null,
          error: errorMessage,
          endpointOk: endpointStatus.compatible,
        });
      }
    }

    void initLiff();

    return () => {
      cancelled = true;
    };
  }, [currentPath]);

  if (!currentPath.startsWith("/result")) {
    return null;
  }

  const t = copy[locale];
  const runtimeLabel =
    state.phase === "ready"
      ? t.ready
      : state.phase === "loading_sdk"
        ? "SDK loading"
        : state.phase === "initializing"
          ? "Initializing"
          : state.phase === "missing_config"
            ? t.missingConfig
            : state.phase === "error"
              ? state.issue === "endpoint_mismatch"
                ? "Endpoint mismatch"
                : "LIFF error"
              : "Idle";
  const environmentLabel =
    state.isInClient === null ? "—" : state.isInClient ? t.inClient : t.external;
  const loginLabel =
    state.isLoggedIn === null ? "—" : state.isLoggedIn ? t.loggedIn : t.loggedOut;
  const profileLabel = state.profile?.displayName || t.profilePending;
  const endpointUrl = getEnvLiffEndpoint();
  const endpointLabel = state.endpointOk === null ? "—" : state.endpointOk ? "OK" : "Mismatch";
  const issueLabel =
    state.issue === "missing_config"
      ? "Missing config"
      : state.issue === "endpoint_mismatch"
        ? "Endpoint mismatch"
        : state.issue === "sdk_load_failed"
          ? "SDK load failed"
          : state.issue === "init_failed"
            ? "LIFF init failed"
            : "None";

  return (
    <section className="mx-auto mt-6 max-w-6xl rounded-[2rem] border border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.96)] px-6 py-5 shadow-[0_14px_28px_rgba(47,35,33,0.04)]">
      <div className="service-kicker">{t.title}</div>
      <div className="mt-3 flex flex-wrap gap-3 text-sm">
        <RuntimeChip label="Init" value={runtimeLabel} />
        <RuntimeChip label="Context" value={environmentLabel} />
        <RuntimeChip label="Login" value={loginLabel} />
        <RuntimeChip label="Profile" value={profileLabel} />
        <RuntimeChip label="LIFF ID" value={state.liffId || getEnvLiffId() || "—"} />
        <RuntimeChip label="Endpoint" value={endpointLabel} />
        <RuntimeChip label="Issue" value={issueLabel} />
      </div>
      <p className="mt-3 text-xs leading-6 text-[var(--muted)]">{t.readOnly}</p>
      <div className="mt-4 text-[11px] leading-6 text-[var(--muted)]">
        <span className="font-semibold text-[var(--text)]">{t.endpoint}:</span>{" "}
        {endpointUrl || "NEXT_PUBLIC_LIFF_ENDPOINT_URL"}
      </div>
      <div className="mt-2 grid gap-2 text-[11px] leading-6 text-[var(--muted)] sm:grid-cols-2">
        <div>
          <span className="font-semibold text-[var(--text)]">Current URL:</span>{" "}
          {state.currentUrl || "window.location.href"}
        </div>
        <div>
          <span className="font-semibold text-[var(--text)]">Current path:</span>{" "}
          {state.currentPathname || "—"}
        </div>
        <div>
          <span className="font-semibold text-[var(--text)]">Expected path:</span>{" "}
          {state.expectedEndpointPath || "—"}
        </div>
      </div>
      {state.error ? (
        <p className="mt-2 text-xs leading-6 text-[var(--muted)]">
          error: {issueLabel}
          {state.error ? ` — ${state.error}` : ""}
        </p>
      ) : null}
    </section>
  );
}

function RuntimeChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1rem] border border-[color:var(--line-soft)] bg-white/80 px-4 py-3">
      <div className="text-[11px] tracking-[0.18em] text-[var(--muted)]">{label}</div>
      <div className="mt-1 text-sm font-semibold text-[var(--text)]">{value}</div>
    </div>
  );
}
