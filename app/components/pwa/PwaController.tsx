"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// APP-1 — service-worker registration + install / update UX.
// - Registers /sw.js (public-safe offline shell; SW never caches private data).
// - Install hint is small, dismissible, and NEVER shown in standalone mode.
// - Update is USER-CONTROLLED and calm; it never auto-reloads and never
//   interrupts an active 120Q (the SW waits until the user accepts).

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
    document.referrer.startsWith("android-app://")
  );
}

const INSTALL_DISMISSED_KEY = "yorisou.pwa.installHintDismissed.v1";

export default function PwaController() {
  const pathname = usePathname();
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [updateReady, setUpdateReady] = useState<ServiceWorkerRegistration | null>(null);
  const [installDismissed, setInstallDismissed] = useState(true);
  const [standalone, setStandalone] = useState(true);
  // Only reload when the USER accepted an update — never on the initial SW
  // clients.claim() (which also fires controllerchange).
  const updateAcceptedRef = useRef(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- intentional: read
       display-mode + dismissal from the browser once after mount so the install
       hint is absent from SSR/first paint (defaults true → no hydration flash). */
    setStandalone(isStandalone());
    try {
      setInstallDismissed(window.localStorage.getItem(INSTALL_DISMISSED_KEY) === "1");
    } catch {
      setInstallDismissed(true);
    }
    /* eslint-enable react-hooks/set-state-in-effect */

    if (!("serviceWorker" in navigator)) return;

    let reg: ServiceWorkerRegistration | null = null;
    const onLoad = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
          reg = registration;
          if (registration.waiting && navigator.serviceWorker.controller) {
            setUpdateReady(registration);
          }
          registration.addEventListener("updatefound", () => {
            const worker = registration.installing;
            if (!worker) return;
            worker.addEventListener("statechange", () => {
              if (worker.state === "installed" && navigator.serviceWorker.controller) {
                setUpdateReady(registration);
              }
            });
          });
        })
        .catch(() => undefined);
    };

    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    // reload once the new worker takes control — but ONLY after the user
    // accepted an update (never on the initial SW claim on first load).
    let refreshed = false;
    const onControllerChange = () => {
      if (refreshed || !updateAcceptedRef.current) return;
      refreshed = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
      void reg;
    };
  }, []);

  async function doInstall() {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice.catch(() => undefined);
    setInstallEvent(null);
  }

  function dismissInstall() {
    setInstallEvent(null);
    setInstallDismissed(true);
    try {
      window.localStorage.setItem(INSTALL_DISMISSED_KEY, "1");
    } catch {
      /* non-fatal */
    }
  }

  function applyUpdate() {
    updateAcceptedRef.current = true; // now a controllerchange means "reload into the new version"
    updateReady?.waiting?.postMessage({ type: "SKIP_WAITING" });
    setUpdateReady(null);
  }

  // Do NOT surface an update prompt mid-assessment (the SW is waiting anyway).
  const inActiveCheck = pathname === "/check-in";

  const showInstall = !standalone && !installDismissed && Boolean(installEvent);
  const showUpdate = Boolean(updateReady) && !inActiveCheck;

  if (!showInstall && !showUpdate) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] flex justify-center px-3 pb-3" role="region" aria-label="アプリの案内">
      {showUpdate ? (
        <div className="pointer-events-auto w-full max-w-[30rem] rounded-[14px] border border-[var(--yr-hair-2,rgba(228,240,233,0.17))] bg-[rgba(18,22,19,0.96)] p-3.5 text-[color:var(--yr-text,#eef4ef)] shadow-[0_18px_44px_rgba(0,0,0,0.5)] backdrop-blur">
          <p className="text-[13px] leading-6">新しいバージョンが利用できます。今のチェックは中断されません。</p>
          <div className="mt-2.5 flex gap-2">
            <button type="button" onClick={applyUpdate} className="aix2-btn aix2-btn-primary !min-h-[40px] !text-[13px]">
              更新する
            </button>
            <button type="button" onClick={() => setUpdateReady(null)} className="aix2-btn aix2-btn-ghost !min-h-[40px] !text-[13px]">
              あとで
            </button>
          </div>
        </div>
      ) : showInstall ? (
        <div className="pointer-events-auto w-full max-w-[30rem] rounded-[14px] border border-[var(--yr-hair-2,rgba(228,240,233,0.17))] bg-[rgba(18,22,19,0.96)] p-3.5 text-[color:var(--yr-text,#eef4ef)] shadow-[0_18px_44px_rgba(0,0,0,0.5)] backdrop-blur">
          <p className="text-[13px] font-semibold">YORISOU をアプリとして追加</p>
          <p className="mt-1 text-[12px] leading-6 text-[color:var(--yr-text-mut,#adc0b6)]">
            任意です。独立したYORISOUのウィンドウで開けます。この端末の記録はそのまま残ります。あとで通常の操作で削除できます。
          </p>
          <div className="mt-2.5 flex gap-2">
            <button type="button" onClick={doInstall} className="aix2-btn aix2-btn-primary !min-h-[40px] !text-[13px]">
              追加する
            </button>
            <button type="button" onClick={dismissInstall} className="aix2-btn aix2-btn-ghost !min-h-[40px] !text-[13px]">
              今はしない
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
