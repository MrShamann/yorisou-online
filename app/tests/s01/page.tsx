import { redirect } from "next/navigation";

// AIX-3D-2 — /tests/s01 consolidated. The "今日のおみくじ" (omikuji / daily fortune)
// draw is fortune-telling, which the platform explicitly is not. Not in the
// canonical catalogue. Redirect to the Understand entry; engine preserved in lib/.
export default function S01Page() {
  redirect("/tests");
}
