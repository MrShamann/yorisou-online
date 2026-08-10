// §14 B — the transport readiness probe. A readiness FLAG says what an operator believes; this
// proves what the deployment can actually do right now.
import assert from "node:assert/strict";
import test from "node:test";

import {
  probeErasureTransport,
  STRONG_ERASURE_RPC,
  type RpcTransportResponse,
} from "../por1ErasureTransportReadiness";

const pgrst = (message: string, code = "P0001") => JSON.stringify({ code, message });

/** Records every RPC name and argument set the probe touches. */
function recorder(reply: RpcTransportResponse | (() => never)) {
  const calls: Array<{ fn: string; args: Record<string, unknown> }> = [];
  return {
    calls,
    callRpc: async (fn: string, args: Record<string, unknown>): Promise<RpcTransportResponse> => {
      calls.push({ fn, args });
      if (typeof reply === "function") reply();
      return reply as RpcTransportResponse;
    },
  };
}

test("the expected fake-job refusal means READY", async () => {
  const r = recorder({ status: 400, bodyText: pgrst("account_deletion_erase_not_authorized") });
  assert.deepEqual(await probeErasureTransport({ callRpc: r.callRpc }), { ready: true });
});

test("a job-not-found refusal also proves the wrapper ran", async () => {
  const r = recorder({ status: 400, bodyText: pgrst("account_deletion_job_not_found") });
  assert.deepEqual(await probeErasureTransport({ callRpc: r.callRpc }), { ready: true });
});

test("PGRST202 / function-not-found means UNREADY", async () => {
  const r = recorder({
    status: 404,
    bodyText: JSON.stringify({ code: "PGRST202", message: "Could not find the function" }),
  });
  assert.deepEqual(await probeErasureTransport({ callRpc: r.callRpc }), {
    ready: false,
    reason: "erasure_rpc_unavailable",
  });
});

test("401 means UNREADY", async () => {
  const r = recorder({ status: 401, bodyText: JSON.stringify({ message: "no api key" }) });
  assert.deepEqual(await probeErasureTransport({ callRpc: r.callRpc }), {
    ready: false,
    reason: "erasure_rpc_unauthorized",
  });
});

test("403 means UNREADY", async () => {
  const r = recorder({ status: 403, bodyText: JSON.stringify({ message: "permission denied" }) });
  assert.deepEqual(await probeErasureTransport({ callRpc: r.callRpc }), {
    ready: false,
    reason: "erasure_rpc_forbidden",
  });
});

test("a network failure means UNREADY, never ready-by-default", async () => {
  const r = recorder(() => {
    throw new Error("ECONNRESET");
  });
  assert.deepEqual(await probeErasureTransport({ callRpc: r.callRpc }), {
    ready: false,
    reason: "erasure_rpc_unreachable",
  });
});

test("an unexpected 400 that names no governed family means UNREADY", async () => {
  const r = recorder({ status: 400, bodyText: JSON.stringify({ code: "42883", message: "syntax error" }) });
  assert.deepEqual(await probeErasureTransport({ callRpc: r.callRpc }), {
    ready: false,
    reason: "erasure_rpc_unexpected_response",
  });
});

test("an unexpected SUCCESS is UNREADY — an invented identity must never match", async () => {
  const r = recorder({ status: 200, bodyText: "{}" });
  assert.deepEqual(await probeErasureTransport({ callRpc: r.callRpc }), {
    ready: false,
    reason: "erasure_rpc_unexpected_response",
  });
});

// ── what the probe is NOT allowed to do ─────────────────────────────────────

test("the probe calls ONLY the strong four-argument signature, never the weak owner-only one", async () => {
  const r = recorder({ status: 400, bodyText: pgrst("account_deletion_erase_not_authorized") });
  await probeErasureTransport({ callRpc: r.callRpc });

  assert.equal(r.calls.length, 1, "exactly one RPC");
  assert.equal(r.calls[0].fn, STRONG_ERASURE_RPC);

  const args = r.calls[0].args;
  assert.deepEqual(
    Object.keys(args).sort(),
    ["p_executor_generation", "p_executor_token_hash", "p_job_id", "p_owner_account_id"],
    "the four-argument form, so the weak owner-only signature cannot be resolved by accident",
  );
  // The weak signature takes exactly one argument; a single-key call would resolve to it.
  assert.notDeepEqual(Object.keys(args), ["p_owner_account_id"]);
});

test("the probed identity is random each time, so it cannot collide with a real job", async () => {
  const seen = new Set<string>();
  for (let i = 0; i < 5; i += 1) {
    const r = recorder({ status: 400, bodyText: pgrst("account_deletion_erase_not_authorized") });
    await probeErasureTransport({ callRpc: r.callRpc });
    seen.add(String(r.calls[0].args.p_job_id));
  }
  assert.equal(seen.size, 5, "a fresh job id per probe");
});
