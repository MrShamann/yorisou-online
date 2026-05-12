export const YORISOU_REPORT_INTENT_KEY = "yorisou.reportIntent.v0_2";
const YORISOU_REPORT_INTENT_EVENT = "yorisou:report-intent-updated";

export type ReportIntentRecord = {
  expressedAt: string;
  reportType: string;
  source: "local-browser";
  version: "v0.2";
  path: "/report-preview";
  resultId?: string;
  overlayId?: string;
  confidenceBand?: "low" | "medium";
  payloadKey?: string;
};

let cachedReportIntentRaw: string | null = null;
let cachedReportIntentParsed: ReportIntentRecord | null = null;

function parseReportIntent(rawValue: string | null): ReportIntentRecord | null {
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<ReportIntentRecord>;
    if (
      parsed &&
      typeof parsed.expressedAt === "string" &&
      typeof parsed.reportType === "string" &&
      parsed.source === "local-browser" &&
      parsed.version === "v0.2" &&
      parsed.path === "/report-preview"
    ) {
      const record: ReportIntentRecord = {
        expressedAt: parsed.expressedAt,
        reportType: parsed.reportType,
        source: parsed.source,
        version: parsed.version,
        path: parsed.path,
      };

      if (typeof parsed.resultId === "string") {
        record.resultId = parsed.resultId;
      }

      if (typeof parsed.overlayId === "string") {
        record.overlayId = parsed.overlayId;
      }

      if (parsed.confidenceBand === "low" || parsed.confidenceBand === "medium") {
        record.confidenceBand = parsed.confidenceBand;
      }

      if (typeof parsed.payloadKey === "string") {
        record.payloadKey = parsed.payloadKey;
      }

      return record;
    }
  } catch {
    return null;
  }

  return null;
}

function syncReportIntentSnapshot(rawValue: string | null) {
  if (rawValue === cachedReportIntentRaw) {
    return cachedReportIntentParsed;
  }

  cachedReportIntentRaw = rawValue;
  cachedReportIntentParsed = parseReportIntent(rawValue);
  return cachedReportIntentParsed;
}

export function saveReportIntent(record: ReportIntentRecord) {
  if (typeof window === "undefined") {
    return;
  }

  const rawValue = JSON.stringify(record);
  window.localStorage.setItem(YORISOU_REPORT_INTENT_KEY, rawValue);
  syncReportIntentSnapshot(rawValue);
  window.dispatchEvent(new Event(YORISOU_REPORT_INTENT_EVENT));
}

export function readReportIntent(): ReportIntentRecord | null {
  if (typeof window === "undefined") {
    return cachedReportIntentParsed;
  }

  const rawValue = window.localStorage.getItem(YORISOU_REPORT_INTENT_KEY);
  return syncReportIntentSnapshot(rawValue);
}

export function subscribeReportIntent(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = (event: Event) => {
    if (event instanceof StorageEvent && event.key && event.key !== YORISOU_REPORT_INTENT_KEY) {
      return;
    }

    onStoreChange();
  };

  window.addEventListener("storage", handleChange);
  window.addEventListener(YORISOU_REPORT_INTENT_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(YORISOU_REPORT_INTENT_EVENT, handleChange);
  };
}
