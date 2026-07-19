// SR-1 — guest journey continuity (public-safe, device-local).
//
// One unified device-local model for the stranger-ready service journey. It is
// PUBLIC-SAFE BY CONSTRUCTION: it stores only need selections, chosen routes,
// public result identity (family + public result id/label/path), saved/tried
// service-catalogue item ids, coarse feedback signals, a return path, and
// consent acknowledgements. It NEVER stores raw answers, private notes, payload
// scoring internals, account identifiers, or any personal data.
//
// It follows the RTR-1 saveState.ts pattern (localStorage + a custom event +
// subscribe) so it composes with React via useSyncExternalStore, and it is
// additive — it does not replace or change the existing single-result save
// (app/result/saveState.ts) or the pending-save login bridge (pendingSave.ts).

export const SR1_GUEST_JOURNEY_KEY = "yorisou.sr1.journey.v1";
const SR1_GUEST_JOURNEY_EVENT = "yorisou:sr1-journey-updated";

// The scope a piece of information actually lives in — surfaced to the user so
// persistence is never implied to be more than it is (§9.2 persistence truth).
export type PersistenceScope = "session" | "device" | "account" | "line" | "public";

export const PERSISTENCE_SCOPE_LABEL: Record<PersistenceScope, string> = {
  session: "この画面を閉じるまで（保存されません）",
  device: "この端末にのみ保存（いつでも削除できます）",
  account: "ログイン後のアカウントに保存",
  line: "LINE連携で引き継ぎ",
  public: "公開してもよい内容",
};

// The ordinary-language needs the service router begins from (§8.1). These are
// user-facing needs, not internal test names.
export type GuestNeedId =
  | "organize-self"
  | "where-to-start"
  | "relationship-distance"
  | "work-life-rhythm"
  | "shift-mood"
  | "find-fit"
  | "continue-previous";

export type GuestPace = "quick" | "deep";

export type GuestFeedbackSignal = "useful" | "not_now" | "tried" | "hide" | "saved";

export type GuestJourneyResult = {
  family: string; // e.g. "imairo", "relationship-fatigue"
  resultId?: string; // public result id only (e.g. "MS-KI")
  label?: string; // public display label
  resultPath?: string; // canonical public path to re-open the result
  savedAt: string;
};

export type GuestFeedbackEntry = {
  itemId: string;
  signal: GuestFeedbackSignal;
  at: string;
};

export type GuestJourneyState = {
  version: "sr1.v1";
  updatedAt: string;
  need?: GuestNeedId;
  routedTo?: string; // destination route the router chose
  pace?: GuestPace;
  returning?: boolean;
  lastResult?: GuestJourneyResult;
  savedItemIds: string[]; // service-catalogue item ids
  triedItemIds: string[];
  hiddenItemIds: string[];
  feedback: GuestFeedbackEntry[];
  lastReturnPath?: string;
  consent: { localSaveAcknowledged?: boolean };
};

export function emptyGuestJourney(): GuestJourneyState {
  return {
    version: "sr1.v1",
    updatedAt: "",
    savedItemIds: [],
    triedItemIds: [],
    hiddenItemIds: [],
    feedback: [],
    consent: {},
  };
}

const NEED_IDS: GuestNeedId[] = [
  "organize-self",
  "where-to-start",
  "relationship-distance",
  "work-life-rhythm",
  "shift-mood",
  "find-fit",
  "continue-previous",
];

let cachedRaw: string | null = null;
let cachedParsed: GuestJourneyState | null = null;

// A single stable empty snapshot. useSyncExternalStore requires getSnapshot to
// return a referentially-stable value while the store is unchanged; returning a
// fresh emptyGuestJourney() each call would loop forever (React error #185).
export const EMPTY_GUEST_JOURNEY: GuestJourneyState = emptyGuestJourney();

function asStringArray(value: unknown, max = 200): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string").slice(0, max);
}

function parseResult(value: unknown): GuestJourneyResult | undefined {
  if (!value || typeof value !== "object") return undefined;
  const v = value as Record<string, unknown>;
  if (typeof v.family !== "string" || typeof v.savedAt !== "string") return undefined;
  return {
    family: v.family,
    resultId: typeof v.resultId === "string" ? v.resultId : undefined,
    label: typeof v.label === "string" ? v.label : undefined,
    resultPath: typeof v.resultPath === "string" && v.resultPath.startsWith("/") ? v.resultPath : undefined,
    savedAt: v.savedAt,
  };
}

function parseJourney(rawValue: string | null): GuestJourneyState | null {
  if (!rawValue) return null;
  try {
    const parsed = JSON.parse(rawValue) as Partial<GuestJourneyState>;
    if (!parsed || parsed.version !== "sr1.v1") return null;
    const feedback: GuestFeedbackEntry[] = Array.isArray(parsed.feedback)
      ? parsed.feedback
          .filter(
            (f): f is GuestFeedbackEntry =>
              !!f &&
              typeof (f as GuestFeedbackEntry).itemId === "string" &&
              typeof (f as GuestFeedbackEntry).at === "string" &&
              ["useful", "not_now", "tried", "hide", "saved"].includes((f as GuestFeedbackEntry).signal),
          )
          .slice(-100)
      : [];
    return {
      version: "sr1.v1",
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
      need: NEED_IDS.includes(parsed.need as GuestNeedId) ? (parsed.need as GuestNeedId) : undefined,
      routedTo: typeof parsed.routedTo === "string" && parsed.routedTo.startsWith("/") ? parsed.routedTo : undefined,
      pace: parsed.pace === "quick" || parsed.pace === "deep" ? parsed.pace : undefined,
      returning: typeof parsed.returning === "boolean" ? parsed.returning : undefined,
      lastResult: parseResult(parsed.lastResult),
      savedItemIds: asStringArray(parsed.savedItemIds),
      triedItemIds: asStringArray(parsed.triedItemIds),
      hiddenItemIds: asStringArray(parsed.hiddenItemIds),
      feedback,
      lastReturnPath:
        typeof parsed.lastReturnPath === "string" && parsed.lastReturnPath.startsWith("/")
          ? parsed.lastReturnPath
          : undefined,
      consent:
        parsed.consent && typeof parsed.consent === "object"
          ? { localSaveAcknowledged: Boolean((parsed.consent as { localSaveAcknowledged?: unknown }).localSaveAcknowledged) }
          : {},
    };
  } catch {
    return null;
  }
}

// Pure parser exposed for contract tests (window-free; strips any non-typed
// field so raw answers / PII can never round-trip through the journey store).
export function parseGuestJourney(rawValue: string | null): GuestJourneyState | null {
  return parseJourney(rawValue);
}

function syncSnapshot(rawValue: string | null): GuestJourneyState | null {
  if (rawValue === cachedRaw) return cachedParsed;
  cachedRaw = rawValue;
  cachedParsed = parseJourney(rawValue);
  return cachedParsed;
}

export function readGuestJourney(): GuestJourneyState {
  if (typeof window === "undefined") return cachedParsed ?? EMPTY_GUEST_JOURNEY;
  const rawValue = window.localStorage.getItem(SR1_GUEST_JOURNEY_KEY);
  return syncSnapshot(rawValue) ?? EMPTY_GUEST_JOURNEY;
}

// Returns true only when a journey has actually been started (has content).
export function hasGuestJourney(): boolean {
  const j = readGuestJourney();
  return Boolean(
    j.updatedAt &&
      (j.need || j.routedTo || j.lastResult || j.savedItemIds.length || j.triedItemIds.length || j.feedback.length),
  );
}

function persist(next: GuestJourneyState) {
  if (typeof window === "undefined") return;
  const withStamp: GuestJourneyState = { ...next, version: "sr1.v1", updatedAt: new Date().toISOString() };
  const rawValue = JSON.stringify(withStamp);
  window.localStorage.setItem(SR1_GUEST_JOURNEY_KEY, rawValue);
  syncSnapshot(rawValue);
  window.dispatchEvent(new Event(SR1_GUEST_JOURNEY_EVENT));
}

// Merge-patch the journey. Never stores anything beyond the typed public-safe
// fields; unknown keys are dropped by parseJourney on the next read.
export function updateGuestJourney(patch: Partial<GuestJourneyState>) {
  const current = readGuestJourney();
  persist({ ...current, ...patch });
}

export function recordNeed(need: GuestNeedId, pace?: GuestPace, returning?: boolean) {
  const current = readGuestJourney();
  persist({ ...current, need, pace: pace ?? current.pace, returning: returning ?? current.returning });
}

export function recordRoute(routedTo: string) {
  if (!routedTo.startsWith("/")) return;
  updateGuestJourney({ routedTo, lastReturnPath: routedTo });
}

export function recordResult(result: GuestJourneyResult) {
  updateGuestJourney({ lastResult: result, lastReturnPath: result.resultPath });
}

export function toggleSavedItem(itemId: string): boolean {
  const current = readGuestJourney();
  const has = current.savedItemIds.includes(itemId);
  const savedItemIds = has ? current.savedItemIds.filter((id) => id !== itemId) : [...current.savedItemIds, itemId];
  persist({ ...current, savedItemIds, hiddenItemIds: current.hiddenItemIds.filter((id) => id !== itemId) });
  return !has;
}

export function markTriedItem(itemId: string) {
  const current = readGuestJourney();
  if (current.triedItemIds.includes(itemId)) return;
  persist({ ...current, triedItemIds: [...current.triedItemIds, itemId] });
}

export function hideItem(itemId: string) {
  const current = readGuestJourney();
  if (current.hiddenItemIds.includes(itemId)) return;
  persist({
    ...current,
    hiddenItemIds: [...current.hiddenItemIds, itemId],
    savedItemIds: current.savedItemIds.filter((id) => id !== itemId),
  });
}

export function recordFeedback(entry: Omit<GuestFeedbackEntry, "at">) {
  const current = readGuestJourney();
  persist({ ...current, feedback: [...current.feedback, { ...entry, at: new Date().toISOString() }].slice(-100) });
}

export function acknowledgeLocalSave() {
  const current = readGuestJourney();
  persist({ ...current, consent: { ...current.consent, localSaveAcknowledged: true } });
}

export function setReturnPath(path: string) {
  if (!path.startsWith("/")) return;
  updateGuestJourney({ lastReturnPath: path });
}

// APP-2 WS-B — reset only the signals that reprioritize/suppress the adaptive
// list (coarse feedback, hidden items, tried markers). Keeps the visitor's
// explicit keepers: their need, pace, last result, and saved items. This makes
// the adaptation fully reversible without discarding what they chose to save.
export function resetAdaptationSignals() {
  const current = readGuestJourney();
  persist({ ...current, feedback: [], hiddenItemIds: [], triedItemIds: [] });
}

export function clearGuestJourney() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SR1_GUEST_JOURNEY_KEY);
  syncSnapshot(null);
  window.dispatchEvent(new Event(SR1_GUEST_JOURNEY_EVENT));
}

export function subscribeGuestJourney(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const handleChange = (event: Event) => {
    if (event instanceof StorageEvent && event.key && event.key !== SR1_GUEST_JOURNEY_KEY) return;
    onStoreChange();
  };
  window.addEventListener("storage", handleChange);
  window.addEventListener(SR1_GUEST_JOURNEY_EVENT, handleChange);
  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(SR1_GUEST_JOURNEY_EVENT, handleChange);
  };
}
