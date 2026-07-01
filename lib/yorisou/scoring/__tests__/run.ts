import { runAggregationValidationTest } from "./aggregation.test";
import { runCheckInRuntimeValidationTest } from "./checkin-runtime.test";
import { runFoundationValidationTest } from "./foundation.test";
import { runMapperValidationTest } from "./mapper.test";
import { runSafetyAndIsolationValidationTest } from "./safety-routing.test";

function main() {
  const foundation = runFoundationValidationTest();
  const mapper = runMapperValidationTest();
  const aggregation = runAggregationValidationTest();
  const safety = runSafetyAndIsolationValidationTest();
  const checkinRuntime = runCheckInRuntimeValidationTest();

  const summary = {
    status: "ok",
    foundation,
    mapper,
    aggregation,
    safety,
    checkinRuntime,
  };

  console.log(JSON.stringify(summary, null, 2));
}

main();
