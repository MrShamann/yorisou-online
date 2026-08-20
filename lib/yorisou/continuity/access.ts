// CNT-1 — SERVER-SIDE schema-readiness gate for continuity.core timeline reads.
//
// THIS IS NOT A FEATURE FLAG, AND THE DIFFERENCE MATTERS HERE MORE THAN USUAL.
//
// ARCH-P6 changes nothing a person can see. The timeline shows the same entries, in the same order,
// rendered from the same records; only the index that finds them changes. So there is deliberately
// no `YORISOU_CONTINUITY_PUBLIC_ENABLED`, no preview dev flag, and nothing an operator could switch
// to turn a product surface on or off. There is one question and it is purely operational:
//
//     has 202608200001 been applied to THIS deployment's database?
//
// Until it has, `yorisou_continuity_projections` does not exist and reading it returns an error,
// which would empty a person's timeline. So the reader keeps the pre-CNT-1 direct aggregation as
// its NOT-YET-MIGRATED path — not as a competing implementation, but as the only correct answer
// for a database that has not been migrated yet. Once the schema is declared ready, projections are
// authoritative and nothing aggregates. A structural guard in archP6Continuity.test.ts fails if the
// ready path ever grows a second aggregation.
//
// FAIL CLOSED. Production is treated as not-ready unless an operator has explicitly declared
// otherwise, and an unrecognised deployment context is treated as production. Setting the variable
// without running the migration re-creates precisely the failure it exists to prevent, which is why
// it is an operator declaration rather than something inferred from the environment.

import { deploymentContext } from "@/lib/cpv1/deploymentContext";

/** Operator declaration that the CNT-1 migration has been applied to this deployment's database. */
export const CONTINUITY_SCHEMA_READY_ENV = "YORISOU_CONTINUITY_SCHEMA_READY";

export type ContinuityReadiness =
  | { ready: true; reason: "operator_declared" | "trusted_local" | "trusted_test" }
  | { ready: false; reason: "not_declared_production" | "not_declared_preview" | "unknown_context" };

/**
 * Whether continuity projections may be read on this deployment.
 *
 * Local and test build their database from the full migration lineage, so the table is present by
 * construction and acceptance runs against the real read path rather than the fallback. Every other
 * context requires the explicit declaration.
 */
export function continuityReadiness(
  env: Record<string, string | undefined> = process.env,
): ContinuityReadiness {
  if ((env[CONTINUITY_SCHEMA_READY_ENV] ?? "").trim().toLowerCase() === "true") {
    return { ready: true, reason: "operator_declared" };
  }
  const context = deploymentContext(env);
  if (context === "local") return { ready: true, reason: "trusted_local" };
  if (context === "test") return { ready: true, reason: "trusted_test" };
  if (context === "vercel_preview") return { ready: false, reason: "not_declared_preview" };
  if (context === "production") return { ready: false, reason: "not_declared_production" };
  return { ready: false, reason: "unknown_context" };
}

/** Convenience predicate. Reads exactly the same decision as `continuityReadiness`. */
export function continuitySchemaReady(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return continuityReadiness(env).ready;
}
