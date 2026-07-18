"use client";

import { useSyncExternalStore } from "react";

import { EMPTY_GUEST_JOURNEY, readGuestJourney, subscribeGuestJourney, type GuestJourneyState } from "./guestJourney";

// Stable server/first-paint snapshot — the same reference every call so
// useSyncExternalStore does not loop during hydration. Real device-local state
// is read on the client after mount.
export function useGuestJourney(): GuestJourneyState {
  return useSyncExternalStore(subscribeGuestJourney, readGuestJourney, () => EMPTY_GUEST_JOURNEY);
}
