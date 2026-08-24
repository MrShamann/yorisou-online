import Ux1Shell from "../_lib/Ux1Shell";
import ReadingSurface from "./ReadingSurface";

// Surface 3 — the current reading ("いまの読み").
//
// Rendered in the PRIVATE register: this is the person's own layer, and the
// register change is the privacy signal. The reading is a period, never a type;
// it carries its source, an honest non-numeric certainty, an explicit
// "what this does not mean", and — the centre of the whole direction — a
// correction that visibly reorganises the field.

export default function Ux1ResultPage() {
  return (
    <Ux1Shell register="private">
      <ReadingSurface />
    </Ux1Shell>
  );
}
