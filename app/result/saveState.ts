export const YORISOU_SAVED_RESULT_KEY = "yorisou.savedResult.v0_2";
const YORISOU_SAVED_RESULT_EVENT = "yorisou:saved-result-updated";

export type SavedResultRecord = {
  savedAt: string;
  resultType: string;
  resultLabel: string;
  baseResultId?: string;
  overlayId?: string;
  confidenceBand?: "low" | "medium";
  recognitionLine?: string;
  traitChips?: [string, string, string];
  source: "local-browser";
  version: "v0.2";
  resultPath: string;
  continuePath: string;
  context: "public-result" | "private-insight";
};

let cachedSavedResultRaw: string | null = null;
let cachedSavedResultParsed: SavedResultRecord | null = null;

function parseSavedResultRecord(rawValue: string | null): SavedResultRecord | null {
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<SavedResultRecord>;
    if (
      parsed &&
      typeof parsed.savedAt === "string" &&
      typeof parsed.resultType === "string" &&
      typeof parsed.resultLabel === "string" &&
      (typeof parsed.baseResultId === "undefined" || typeof parsed.baseResultId === "string") &&
      (typeof parsed.overlayId === "undefined" || typeof parsed.overlayId === "string") &&
      (parsed.confidenceBand === undefined || parsed.confidenceBand === "low" || parsed.confidenceBand === "medium") &&
      (typeof parsed.recognitionLine === "undefined" || typeof parsed.recognitionLine === "string") &&
      (typeof parsed.traitChips === "undefined" ||
        (Array.isArray(parsed.traitChips) &&
          parsed.traitChips.length === 3 &&
          parsed.traitChips.every((item) => typeof item === "string"))) &&
      parsed.source === "local-browser" &&
      parsed.version === "v0.2" &&
      typeof parsed.resultPath === "string" &&
      typeof parsed.continuePath === "string" &&
      (parsed.context === "public-result" || parsed.context === "private-insight")
    ) {
      return parsed as SavedResultRecord;
    }
  } catch {
    return null;
  }

  return null;
}

function syncSavedResultSnapshot(rawValue: string | null) {
  if (rawValue === cachedSavedResultRaw) {
    return cachedSavedResultParsed;
  }

  cachedSavedResultRaw = rawValue;
  cachedSavedResultParsed = parseSavedResultRecord(rawValue);
  return cachedSavedResultParsed;
}

export function saveResultRecord(record: SavedResultRecord) {
  if (typeof window === "undefined") {
    return;
  }

  const rawValue = JSON.stringify(record);
  window.localStorage.setItem(YORISOU_SAVED_RESULT_KEY, rawValue);
  syncSavedResultSnapshot(rawValue);
  window.dispatchEvent(new Event(YORISOU_SAVED_RESULT_EVENT));
}

export function readSavedResultRecord(): SavedResultRecord | null {
  if (typeof window === "undefined") {
    return cachedSavedResultParsed;
  }

  const rawValue = window.localStorage.getItem(YORISOU_SAVED_RESULT_KEY);
  return syncSavedResultSnapshot(rawValue);
}

export function subscribeSavedResult(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = (event: Event) => {
    if (event instanceof StorageEvent && event.key && event.key !== YORISOU_SAVED_RESULT_KEY) {
      return;
    }

    onStoreChange();
  };

  window.addEventListener("storage", handleChange);
  window.addEventListener(YORISOU_SAVED_RESULT_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(YORISOU_SAVED_RESULT_EVENT, handleChange);
  };
}
