// DCI-1 §19 — governed event CONTRACT for daily-check-in.
//
// EMISSION IS DEFERRED in DCI-1: the existing governed event infrastructure
// (lib/server/relationship-intelligence) is scoped to the open-testing surfaces
// with a closed event-name union; widening it for this gated method would be an
// unrelated-subsystem change. This module records the bounded contract so a
// future package can wire emission without redesign. No analytics subsystem is
// created here and nothing is emitted.
//
// Payload boundary (canonical): NO raw state selections, NO memo text, NO result
// content, NO personally sensitive free text — event name + timing only.

export const DAILY_CHECK_IN_EVENTS = [
  "state_check_started",
  "state_check_completed",
  "private_state_saved",
  "state_record_corrected",
  "state_record_deleted",
  "return_visit",
] as const;

export type DailyCheckInEventName = (typeof DAILY_CHECK_IN_EVENTS)[number];

export type DailyCheckInEvent = {
  name: DailyCheckInEventName;
  occurredAt: string; // ISO timestamp only — never state content
};

export function isDailyCheckInEventName(value: string): value is DailyCheckInEventName {
  return (DAILY_CHECK_IN_EVENTS as readonly string[]).includes(value);
}
