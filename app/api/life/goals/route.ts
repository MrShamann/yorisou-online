import { NextResponse } from "next/server";
import { createGoal, getGoal, listGoals, setGoalStatus } from "@/lib/server/lifeOs/store";
import { buildMemoryCandidates } from "@/lib/server/lifeOs/aiBoundary";
import { auditLifeOs } from "@/lib/server/lifeOs/audit";
import { lifeApiError, requireLifeViewer } from "@/lib/server/lifeOs/guard";
import { GOAL_STATUSES, LifeOsInputError, parseGoalInput, type GoalStatus, parseUuid } from "@/lib/life-os/contract";

export const dynamic = "force-dynamic";

// A Goal here is LIFE DIRECTION / INTENTION. There is deliberately no due date, no reminder, no
// progress value and no completion action on this endpoint — see lib/server/lifeOs/store.ts.

export async function GET() {
  const gate = await requireLifeViewer({ mutation: false });
  if ("refusal" in gate) return gate.refusal;
  try {
    return NextResponse.json({ goals: await listGoals(gate.viewer.accountId) });
  } catch (error) {
    return lifeApiError(error);
  }
}

export async function POST(request: Request) {
  const gate = await requireLifeViewer({ mutation: true });
  if ("refusal" in gate) return gate.refusal;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  try {
    const id = await createGoal(gate.viewer.accountId, parseGoalInput(body));
    await auditLifeOs({
      ownerAccountId: gate.viewer.accountId,
      action: "yorisou.life.goal.created",
      entityKind: "goal",
      entityRef: id,
      reason: "user_created",
    });
    const goal = await getGoal(gate.viewer.accountId, id);
    return NextResponse.json(
      { id, memoryCandidates: goal ? buildMemoryCandidates({ goal }) : [] },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof LifeOsInputError) return NextResponse.json({ error: error.code }, { status: 422 });
    return lifeApiError(error);
  }
}

export async function PATCH(request: Request) {
  const gate = await requireLifeViewer({ mutation: true });
  if ("refusal" in gate) return gate.refusal;
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const status = body.status as GoalStatus;
  if (!GOAL_STATUSES.includes(status)) return NextResponse.json({ error: "goal_status_invalid" }, { status: 422 });
  // Validated as a uuid at the edge: an unparseable id can never match a row, so sending it to the
  // database would only turn a caller typo into a 500.
  let goalId: string;
  try {
    goalId = parseUuid(body.id, "goal_id_required");
  } catch (error) {
    if (error instanceof LifeOsInputError) return NextResponse.json({ error: error.code }, { status: 422 });
    throw error;
  }
  try {
    // Owner scope is enforced in the RPC's WHERE clause; `false` means not found OR not yours, and
    // the response cannot tell those apart — no existence oracle.
    const updated = await setGoalStatus(gate.viewer.accountId, goalId, status);
    if (!updated) return NextResponse.json({ error: "goal_not_found" }, { status: 404 });
    await auditLifeOs({
      ownerAccountId: gate.viewer.accountId,
      action: "yorisou.life.goal.status_changed",
      entityKind: "goal",
      entityRef: goalId,
      reason: status,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return lifeApiError(error);
  }
}
