export const YORISOU_FEEDBACK_KEY = "yorisou.feedback.v0_2";
const YORISOU_FEEDBACK_EVENT = "yorisou:feedback-updated";

export type FeedbackValue =
  | "helpful"
  | "somewhat-helpful"
  | "not-sure-yet"
  | "not-a-fit"
  | "want-to-revisit";

export type FeedbackSurface = "private-insight" | "report-preview" | "recommendation-signal";

export type FeedbackRecord = {
  submittedAt: string;
  surface: FeedbackSurface;
  feedbackValue: FeedbackValue;
  source: "local-browser";
  version: "v0.2";
  consentNoticeSeen: true;
};

let cachedFeedbackRaw: string | null = null;
let cachedFeedbackParsed: FeedbackRecord | null = null;

function parseFeedbackRecord(rawValue: string | null): FeedbackRecord | null {
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<FeedbackRecord>;
    if (
      parsed &&
      typeof parsed.submittedAt === "string" &&
      (parsed.surface === "private-insight" ||
        parsed.surface === "report-preview" ||
        parsed.surface === "recommendation-signal") &&
      (parsed.feedbackValue === "helpful" ||
        parsed.feedbackValue === "somewhat-helpful" ||
        parsed.feedbackValue === "not-sure-yet" ||
        parsed.feedbackValue === "not-a-fit" ||
        parsed.feedbackValue === "want-to-revisit") &&
      parsed.source === "local-browser" &&
      parsed.version === "v0.2" &&
      parsed.consentNoticeSeen === true
    ) {
      return parsed as FeedbackRecord;
    }
  } catch {
    return null;
  }

  return null;
}

function syncFeedbackSnapshot(rawValue: string | null) {
  if (rawValue === cachedFeedbackRaw) {
    return cachedFeedbackParsed;
  }

  cachedFeedbackRaw = rawValue;
  cachedFeedbackParsed = parseFeedbackRecord(rawValue);
  return cachedFeedbackParsed;
}

export function saveFeedbackRecord(record: FeedbackRecord) {
  if (typeof window === "undefined") {
    return;
  }

  const rawValue = JSON.stringify(record);
  window.localStorage.setItem(YORISOU_FEEDBACK_KEY, rawValue);
  syncFeedbackSnapshot(rawValue);
  window.dispatchEvent(new Event(YORISOU_FEEDBACK_EVENT));
}

export function readFeedbackRecord(): FeedbackRecord | null {
  if (typeof window === "undefined") {
    return cachedFeedbackParsed;
  }

  const rawValue = window.localStorage.getItem(YORISOU_FEEDBACK_KEY);
  return syncFeedbackSnapshot(rawValue);
}

export function subscribeFeedbackRecord(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = (event: Event) => {
    if (event instanceof StorageEvent && event.key && event.key !== YORISOU_FEEDBACK_KEY) {
      return;
    }

    onStoreChange();
  };

  window.addEventListener("storage", handleChange);
  window.addEventListener(YORISOU_FEEDBACK_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(YORISOU_FEEDBACK_EVENT, handleChange);
  };
}
