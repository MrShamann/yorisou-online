// POR-1 — how to read a Supabase Storage DELETE response.
//
// Measured against the isolated Preview bucket, deleting an object that is already gone answers:
//
//     HTTP 400  {"statusCode":"404","error":"not_found","message":"Object not found",
//                "code":"NoSuchKey"}
//
// Not 404. Treating that as a failure made account deletion PERMANENTLY RETRYABLE — `storage_erasure`
// deletes the account's objects, and the first key a previous attempt had already removed threw, so
// the stage never completed. A hosted run reached attempt 41 on one job.
//
// The opposite mistake is worse. A blanket "400 means gone" is fail-open: a malformed or unauthorized
// request can also answer 400, and reading that as absence is how a deletion finalizes over data it
// never removed. So the status is not the evidence — the BODY is, and anything that does not
// explicitly classify itself as not-found stays a failure.
//
// Pure and separate from the transport so it can be exercised exhaustively without a network.

export type SharedStoreDeleteOutcome = "deleted" | "already_absent" | "failed";

const NOT_FOUND = /not[_ -]?found|NoSuchKey|Object not found/i;

export function classifySharedStoreDelete(input: { status: number; body: string }): SharedStoreDeleteOutcome {
  if (input.status >= 200 && input.status < 300) return "deleted";
  // A real 404 needs no body inspection; the status is already the classification.
  if (input.status === 404) return "already_absent";
  if (input.status === 400 && NOT_FOUND.test(input.body)) return "already_absent";
  return "failed";
}
