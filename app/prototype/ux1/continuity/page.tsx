import Ux1Shell from "../_lib/Ux1Shell";
import ContinuityView from "./ContinuityView";

// Surface 4 — "わたしの今" (continuity).
//
// Not a dashboard and not a card wall: one trajectory, what changed, what the
// person themselves corrected, a small number of reasoned suggestions, and the
// controls over memory and visibility. The Companion element here is explicitly
// labelled PROTOTYPE_VISUAL_DIRECTION_ONLY — there is no Companion runtime.

export default function Ux1ContinuityPage() {
  return (
    <Ux1Shell register="private">
      <ContinuityView />
    </Ux1Shell>
  );
}
