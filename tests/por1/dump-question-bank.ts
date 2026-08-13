// POR-1 M3 — emit [questionId, firstOptionId] pairs from the GOVERNED bank.
//
// The journey harness must not hard-code question ids: the contract derives its required count from
// this same module, so a hard-coded list would drift silently the moment the bank changed and the
// journey would then be answering a questionnaire that no longer exists.
import { currentStateQuestions } from "../../app/tests/ima-iro/currentStateCheckV1";

console.log(JSON.stringify(currentStateQuestions.map((q) => [q.id, q.options[0].id])));
