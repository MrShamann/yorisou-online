import { runPublicAssignmentValidationTest } from "@/lib/yorisou/public-result/__tests__/assignment.test";
import { runSelfUnderstandingReportLibraryValidationTest } from "@/lib/yorisou/reports/__tests__/library.test";
import { runRelationshipIntelligenceEventSemanticsValidationTest } from "@/lib/server/relationship-intelligence/__tests__/event-semantics.test";
import { runRelationshipIntelligenceOperationsControlRoomValidationTest } from "@/lib/server/relationship-intelligence/__tests__/operations-control-room.test";
import { runRecommendationOrchestratorValidationTest } from "@/lib/server/relationship-intelligence/__tests__/recommendation-orchestrator.test";
import { runAggregationValidationTest } from "./aggregation.test";
import { runCheckInRuntimeValidationTest } from "./checkin-runtime.test";
import { runFoundationValidationTest } from "./foundation.test";
import { runMapperValidationTest } from "./mapper.test";
import { runSafetyAndIsolationValidationTest } from "./safety-routing.test";

async function main() {
  const foundation = runFoundationValidationTest();
  const mapper = runMapperValidationTest();
  const aggregation = runAggregationValidationTest();
  const safety = runSafetyAndIsolationValidationTest();
  const checkinRuntime = runCheckInRuntimeValidationTest();
  const publicAssignment = runPublicAssignmentValidationTest();
  const reportLibrary = runSelfUnderstandingReportLibraryValidationTest();
  const relationshipIntelligenceEventSemantics = await runRelationshipIntelligenceEventSemanticsValidationTest();
  const relationshipIntelligenceOperationsControlRoom = await runRelationshipIntelligenceOperationsControlRoomValidationTest();
  const recommendationOrchestrator = await runRecommendationOrchestratorValidationTest();

  const summary = {
    status: "ok",
    foundation,
    mapper,
    aggregation,
    safety,
    checkinRuntime,
    publicAssignment,
    reportLibrary,
    relationshipIntelligenceEventSemantics,
    relationshipIntelligenceOperationsControlRoom,
    recommendationOrchestrator,
  };

  console.log(JSON.stringify(summary, null, 2));
}

void main();
