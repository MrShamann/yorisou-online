# APP-1 — macOS Desktop Installation & Acceptance (YORISOU PWA)

YORISOU is delivered as an **installable Progressive Web App** (not Electron/Tauri,
not an App Store binary). Installing it creates a standalone **YORISOU** window with
its own Dock icon, backed by the same Preview build. This document is the exact
Founder acceptance procedure. **The app is not installed on your desktop until you
perform the final install action in your browser** (steps 2–3 below).

## Prerequisites
- A supported browser: **Google Chrome**, **Microsoft Edge**, or **Arc** on macOS.
  (Safari on macOS does not currently offer PWA install; use Chrome/Edge/Arc.)
- The YORISOU **Preview URL** from PR #113 (Vercel preview deployment for the
  latest commit on `feat/aix-1-ai-native-experience`).

## Steps

### 1. Open the Preview URL
Open the Preview URL in Chrome/Edge/Arc. Confirm the page loads and the tab shows
the **YORISOU nestle-mark favicon**.

### 2. Install YORISOU
- **Chrome/Edge:** click the **install icon** in the address bar (a monitor with a
  down-arrow), or menu **⋮ → Cast, save, and share → Install page as app… / Install YORISOU…**.
- **Arc:** menu **… → Create App** (or the address-bar install control).
- A small in-app hint ("YORISOU をアプリとして追加") may also appear at the bottom —
  it is optional and dismissible.
- In the install dialog, confirm the name **YORISOU** and the app icon, then **Install**.

### 3. Confirm the standalone app window
After install, a **separate YORISOU window** opens with **no browser tab/URL bar**
(standalone display). The window title/traffic-lights belong to a YORISOU app, not a
browser tab.

### 4. Confirm the YORISOU icon + Dock launch
- The **YORISOU nestle-mark icon** appears in **Launchpad** and (while running) in the **Dock**.
- Right-click the Dock icon → **Options → Keep in Dock** to pin it.
- Quit and relaunch from the **Dock** — YORISOU opens directly in its standalone window.

### 5. Confirm persistence after closing and reopening
- Start a journey (e.g. `/start` → a quick reflection, or begin the 120Q check).
- Save a result to the device, or answer a few 120Q questions.
- **Quit** the YORISOU app (⌘Q) and **relaunch** from the Dock.
- Confirm your device-local state is still there: the 120Q resume prompt (前回の続き),
  and any saved result on **マイよりそう** (`/my-yorisou`). Device-local data lives on
  this device only and is not sent anywhere unless you upgrade/link an account.

### 6. Uninstall
- **Chrome/Edge:** open the YORISOU app → menu **⋮ → Uninstall YORISOU…** (or
  `chrome://apps` → right-click YORISOU → Remove).
- **Arc:** remove the created app from Arc's app list.
- Uninstalling removes the standalone app + Dock icon. Device-local data can also be
  cleared from within YORISOU (マイよりそう → この端末の記録を削除する).

## Troubleshooting installability
- **No install control appears:** ensure you are on Chrome/Edge/Arc (not Safari), the
  page is served over HTTPS (the Vercel Preview is), and you loaded the top-level URL.
  Reload once; the service worker registers on first load.
- **Icon looks generic:** hard-reload (⌘⇧R) so the manifest + icons re-fetch.
- **"Update available" banner:** a new version is ready; click **更新する** — it will not
  interrupt an in-progress 120Q (the update waits until you accept).
- **Offline:** if the network drops, YORISOU shows a calm public offline page; your
  in-progress/saved device-local state is preserved and resumes when you reconnect.

## What this delivery is / is not
- **Is:** an installable standalone macOS desktop PWA with a real YORISOU app window,
  Dock icon (from the approved brand mark), offline-safe public shell, and user-controlled
  updates — backed by the Preview build.
- **Is not:** a native macOS binary, an Electron/Tauri app, or an App Store release. No
  such claim is made. Production is unchanged (main @ `70da80a`); this is Preview-only.

**Founder action still required:** the final browser **Install** click (step 2) is yours to
perform — the assistant does not and cannot install the app on your desktop for you.
