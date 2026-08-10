import "server-only";

import { NextResponse } from "next/server";

import { accountMutationDenialStatus, type MutationDenialReason } from "./accountMutationDenialStatus";
import { AccountMutationDenied, type AccountMutationDenial } from "./accountMutationLease";

// The rationale for the mapping lives in `accountMutationDenialStatus`, which is pure and tested.
// This module is only the transport half.

// The two vocabularies must stay identical. Stated as a type-level assertion in both directions, so
// adding a denial reason without giving it a status is a compile error rather than a runtime 500.
type _DenialsCovered = AccountMutationDenial extends MutationDenialReason ? true : never;
type _StatusesReal = MutationDenialReason extends AccountMutationDenial ? true : never;
const _denialsCovered: _DenialsCovered = true;
const _statusesReal: _StatusesReal = true;
void _denialsCovered;
void _statusesReal;

/**
 * The response for a fence refusal, or `null` when the error is something else.
 *
 * Returning `null` rather than a generic 500 is deliberate: this helper decides ONE thing, and the
 * route's own catch-all stays responsible for everything it does not recognise. A helper that
 * answered every error would quietly become the place unrelated failures went to be hidden.
 */
export function accountMutationDeniedResponse(error: unknown): NextResponse | null {
  if (!(error instanceof AccountMutationDenied)) return null;
  return NextResponse.json(
    { success: false, error: error.reason },
    { status: accountMutationDenialStatus(error.reason) },
  );
}
