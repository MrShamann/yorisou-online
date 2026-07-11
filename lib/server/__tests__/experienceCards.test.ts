import assert from "node:assert/strict";
import { ACTIVE_VISIBILITIES, structureExperience, trustFlags, type ExperienceInput } from "../experienceCards";

const card:ExperienceInput={stateContext:"少し疲れていた時期",situation:"予定が重なっていました",actionTried:"一つだけ選びました",perceivedOutcome:"少し整理しやすく感じました",limitations:"毎回同じとは限りません",mayFit:"選択肢を減らしたい時",mayNotFit:"急ぎの対応が必要な時",visibility:"PRIVATE"};
assert.deepEqual(ACTIVE_VISIBILITIES,["PRIVATE","INVITE_ONLY","ANONYMOUS_SHARED","SIMILAR_STATE_ONLY"]);
assert.deepEqual(trustFlags(card),[]);
assert.deepEqual(trustFlags({...card,situation:"mail test@example.com"}),["email"]);
assert.deepEqual(trustFlags({...card,situation:"電話 090-1234-5678"}),["phone"]);
assert.deepEqual(trustFlags({...card,situation:"絶対に効く"}),["clinical_or_absolute_claim"]);

async function run(){process.env.SUPABASE_URL="https://example.supabase.co";process.env.SUPABASE_SERVICE_ROLE_KEY="test-service-role";process.env.YORISOU_PRIVATE_AI_PROVIDER_PRIMARY="gemini_shared";process.env.GEMINI_API_KEY="test-gemini";
const originalFetch=global.fetch;global.fetch=async(input,init)=>{const url=String(input);if(url.includes("generativelanguage"))return new Response(JSON.stringify({candidates:[{content:{parts:[{text:JSON.stringify({state_context:card.stateContext,situation:card.situation,action_tried:card.actionTried,perceived_outcome:card.perceivedOutcome,limitations:card.limitations,may_fit:card.mayFit,may_not_fit:card.mayNotFit,deidentification_notes:[],safety_flags:[]})}]}}]}),{status:200});assert.equal(init?.method,"POST");return new Response(JSON.stringify([]),{status:201});};
try{const structured=await structureExperience("owner-test",card);assert.equal(structured.stateContext,card.stateContext);assert.deepEqual(structured.safetyFlags,[]);}finally{global.fetch=originalFetch;}
console.log(JSON.stringify({status:"ok",experienceCardAssertions:8,providerMock:"passed"}));}
run().catch(error=>{console.error(error);process.exitCode=1;});
