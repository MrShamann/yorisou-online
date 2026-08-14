import "server-only";
import { createHash, randomBytes, randomUUID } from "crypto";
import { resolvePrivateReflectionProviders } from "@/lib/server/privateAiProviderResolver";
import { assertAiOutputWithinBoundary } from "@/lib/server/lifeOs/aiBoundary";

const PROJECT_ID = "yorisou";
export const ACTIVE_VISIBILITIES = ["PRIVATE", "INVITE_ONLY", "ANONYMOUS_SHARED", "SIMILAR_STATE_ONLY"] as const;
export type ExperienceVisibility = typeof ACTIVE_VISIBILITIES[number];
// OSF-1 added `title` and `lesson` (columns added by 202608140001) and made the sharing-only fields
// optional for PRIVATE cards — see payload() for why.
export type ExperienceInput = { stateContext?: string; situation: string; actionTried: string; perceivedOutcome: string; limitations?: string; mayFit?: string; mayNotFit?: string; title?: string | null; lesson?: string | null; visibility: ExperienceVisibility; sourceSavedResultId?: string | null; previewConfirmed?: boolean; aiAssistanceStatus?: "none" | "accepted" | "rejected" };
// A PATCH body: every content field optional, plus an explicit list of fields to null. A distinct
// type from ExperienceInput on purpose — the compiler now stops a caller handing update a
// create-shaped object and getting replace semantics by accident.
export type ExperienceUpdateInput = Partial<Omit<ExperienceInput, "visibility">> & { visibility?: ExperienceVisibility; clearFields?: ClearableExperienceField[] };
type CardRow = Record<string, unknown> & { id: string; owner_account_id: string; visibility: ExperienceVisibility; visibility_version: number };

function config() { const url=process.env.SUPABASE_URL?.trim(),key=process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(); if(!url||!key) throw new Error("experience_store_not_configured"); return {url:url.replace(/\/$/,""),key}; }
async function request(path:string,init:RequestInit={}) { const {url,key}=config(); const response=await fetch(`${url}/rest/v1/${path}`,{...init,headers:{apikey:key,Authorization:`Bearer ${key}`,"Content-Type":"application/json",...(init.headers||{})},cache:"no-store"}); if(!response.ok) throw new Error(`experience_store_failed:${response.status}`); return response; }
function clean(value:unknown,max:number) { return typeof value==="string"&&value.trim().length>0&&value.trim().length<=max?value.trim():null; }
export function trustFlags(input:ExperienceInput) { const combined=Object.values(input).filter(v=>typeof v==="string").join(" "); const flags:string[]=[]; if(/\b[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}\b/.test(combined))flags.push("email"); if(/(?:\+?\d[\d -]{8,}\d)/.test(combined))flags.push("phone"); if(/(?<!\d)(?:〒\s*\d{3}-?\d{4}|\d{3}-\d{4})(?![-\d])/.test(combined))flags.push("postal_code"); if(/(?:診断|治療|必ず治る|絶対に効く)/.test(combined))flags.push("clinical_or_absolute_claim"); return flags; }
// REQUIRED FIELDS DEPEND ON VISIBILITY (OSF-1).
//
// state_context, limitations, may_fit and may_not_fit exist for READERS: they are what stops a
// stranger from taking someone's account of what worked for them as advice. A PRIVATE card has no
// readers, so demanding 「誰に合わないか」 before a person may keep a note for themselves asks them to
// annotate their own memory for an audience that does not exist. Shared cards still require all
// seven, unchanged — nothing about the community contract is relaxed here.
const SHARED_ONLY_FIELDS = ["state_context", "limitations", "may_fit", "may_not_fit"] as const;

// VISIBILITY EXPANSION IS A RANKED COMPARISON, NOT A BOOLEAN (OSF-1 regression repair).
//
// The original create-path rule was `if (shared && !previewConfirmed) throw`. The rewritten update
// path narrowed it to `current.visibility === "PRIVATE"`, which let INVITE_ONLY → ANONYMOUS_SHARED —
// a link shared with named people becoming visible to the whole community — happen with no
// confirmation step at all. That is the single most consequential transition in the product and it
// was the one that lost its gate.
//
// Ranked, so every widening is caught including ones nobody has thought of yet. PUBLIC_SAFE and
// PSEUDONYMOUS_SHARED are ranked too even though the database constraint currently disables them:
// if they are ever enabled, they arrive already inside this rule rather than needing to be
// remembered.
const VISIBILITY_RANK: Record<string, number> = {
  PRIVATE: 0,
  INVITE_ONLY: 1,
  SIMILAR_STATE_ONLY: 2,
  ANONYMOUS_SHARED: 3,
  PSEUDONYMOUS_SHARED: 4,
  PUBLIC_SAFE: 5,
  PUBLIC: 5,
};
/** True when `to` reaches a wider audience than `from`. Unknown values rank highest: fail closed. */
export function isVisibilityExpansion(from: string, to: string) {
  const rank = (v: string) => VISIBILITY_RANK[v] ?? Number.MAX_SAFE_INTEGER;
  return rank(to) > rank(from);
}

function payload(input:ExperienceInput) { const values={state_context:clean(input.stateContext,1200),situation:clean(input.situation,3000),action_tried:clean(input.actionTried,3000),perceived_outcome:clean(input.perceivedOutcome,3000),limitations:clean(input.limitations,2000),may_fit:clean(input.mayFit,1200),may_not_fit:clean(input.mayNotFit,1200)};
  // MIGRATION-ORDERING SAFETY. `title` and `lesson` exist only after 202608140001, so naming them
  // unconditionally made this insert fail with PostgREST's "column does not exist" against any
  // database where that migration has not run — which is every environment today, and which broke
  // the pre-existing /experiences surface as collateral, not just the Life OS one. Verified against a
  // real un-migrated schema: the same insert with these keys errors, without them it succeeds.
  // Emitting them only when the caller actually supplied one makes this code deployable against
  // either schema, so code and migration no longer have to land in the same instant.
  const optional:Record<string,string>={};
  const titleValue=clean(input.title,120); if(titleValue)optional.title=titleValue;
  const lessonValue=clean(input.lesson,1000); if(lessonValue)optional.lesson=lessonValue; if(!ACTIVE_VISIBILITIES.includes(input.visibility))throw new Error("invalid_experience_card"); const required=input.visibility==="PRIVATE"?(Object.keys(values) as Array<keyof typeof values>).filter(k=>!SHARED_ONLY_FIELDS.includes(k as typeof SHARED_ONLY_FIELDS[number])):(Object.keys(values) as Array<keyof typeof values>); if(required.some(k=>!values[k]))throw new Error("invalid_experience_card"); const flags=trustFlags(input),shared=input.visibility!=="PRIVATE"; if(shared&&!input.previewConfirmed)throw new Error("preview_confirmation_required"); if(shared&&flags.some(f=>f!=="clinical_or_absolute_claim"))throw new Error("identifying_detail_detected"); const now=new Date().toISOString(); return {...values,...optional,source_saved_result_id:input.sourceSavedResultId||null,visibility:input.visibility,consented_at:shared?now:null,searchable:shared&&input.visibility!=="INVITE_ONLY",audience_rule:input.visibility==="INVITE_ONLY"?"invite_token":input.visibility==="SIMILAR_STATE_ONLY"?"similar_state_only":shared?"anonymous_shared":"owner_only",moderation_status:shared?"published":"draft",provenance:input.aiAssistanceStatus==="accepted"?"ai_organized":"user_authored",ai_assistance_status:input.aiAssistanceStatus||"none",preview_confirmed_at:input.previewConfirmed?now:null,published_at:shared?now:null}; }
async function validateSource(owner:string,id?:string|null){if(!id)return;const rows=await (await request(`yorisou_test_results?select=id&id=eq.${encodeURIComponent(id)}&owner_account_id=eq.${encodeURIComponent(owner)}&deleted_at=is.null&limit=1`)).json() as Array<{id:string}>;if(!rows[0])throw new Error("invalid_saved_result_source");}
async function sharedCard(owner:string,id:string){return ((await (await request(`yorisou_experience_cards?select=id,owner_account_id,visibility,moderation_status&id=eq.${encodeURIComponent(id)}&owner_account_id=neq.${encodeURIComponent(owner)}&visibility=in.(ANONYMOUS_SHARED,SIMILAR_STATE_ONLY)&moderation_status=eq.published&searchable=eq.true&withdrawn_at=is.null&deleted_at=is.null&limit=1`)).json()) as CardRow[])[0]||null;}
async function event(owner:string,type:string,id?:string,metadata:Record<string,unknown>={}) { await request("yorisou_experience_events",{method:"POST",body:JSON.stringify({project_id:PROJECT_ID,experience_id:id||null,actor_account_id:owner,event_type:type,metadata})}); }
async function revision(owner:string,row:CardRow,number:number) { await request("yorisou_experience_revisions",{method:"POST",body:JSON.stringify({project_id:PROJECT_ID,experience_id:row.id,owner_account_id:owner,revision_number:number,provenance:row.provenance,content:row})}); }
export async function createExperience(owner:string,input:ExperienceInput) { await validateSource(owner,input.sourceSavedResultId);const body=payload(input),flags=trustFlags(input);if(flags.includes("clinical_or_absolute_claim")){body.moderation_status="limited";body.searchable=false;} const row=((await (await request("yorisou_experience_cards",{method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify({project_id:PROJECT_ID,owner_account_id:owner,...body})})).json()) as CardRow[])[0]; if(!row)throw new Error("experience_create_failed"); await revision(owner,row,1); if(input.visibility!=="PRIVATE")await Promise.all([request("yorisou_experience_consents",{method:"POST",body:JSON.stringify({project_id:PROJECT_ID,experience_id:row.id,owner_account_id:owner,visibility:input.visibility})}),request("yorisou_experience_visibility_events",{method:"POST",body:JSON.stringify({project_id:PROJECT_ID,experience_id:row.id,owner_account_id:owner,to_visibility:input.visibility})})]); await event(owner,input.visibility==="PRIVATE"?"draft_created":"published",row.id,{visibility:input.visibility,trust_flags:flags}); return row; }
export async function ownerCard(owner:string,id:string) { return ((await (await request(`yorisou_experience_cards?select=*&id=eq.${encodeURIComponent(id)}&owner_account_id=eq.${encodeURIComponent(owner)}&deleted_at=is.null&limit=1`)).json()) as CardRow[])[0]||null; }
export async function listOwnerCards(owner:string) { return await (await request(`yorisou_experience_cards?select=*&owner_account_id=eq.${encodeURIComponent(owner)}&deleted_at=is.null&order=updated_at.desc&limit=50`)).json() as CardRow[]; }
// UPDATE IS A PATCH, AND A PATCH IS NOT A REPLACE (OSF-1 hardening).
//
// payload() always returns all nine content keys, each clean()-ed to null when absent, because that
// is right for CREATE — a create supplies everything or it is invalid. updateExperience reused it,
// so `{situation, actionTried, perceivedOutcome, visibility}` returned 200 and wrote title, lesson,
// state_context, limitations, may_fit and may_not_fit to NULL. The caller never asked to erase them;
// it just did not mention them. Before OSF-1 made those columns nullable that same request was
// rejected outright, so the relaxation is what turned "invalid" into "silently destroys the owner's
// own text".
//
// The rule now: an ABSENT field means leave it alone; only an explicit `clearFields` entry nulls
// anything. There is no way to clear a column by omission.
const CLEARABLE_FIELDS = ["title","lesson","state_context","limitations","may_fit","may_not_fit"] as const;
export type ClearableExperienceField = typeof CLEARABLE_FIELDS[number];
/** situation / action_tried / perceived_outcome are NOT NULL in the schema and are never clearable. */
function updateBody(input:ExperienceUpdateInput,visibility:ExperienceVisibility) {
  const provided:Record<string,unknown>={};
  const map:Array<[keyof ExperienceUpdateInput,string,number]>=[["stateContext","state_context",1200],["situation","situation",3000],["actionTried","action_tried",3000],["perceivedOutcome","perceived_outcome",3000],["limitations","limitations",2000],["mayFit","may_fit",1200],["mayNotFit","may_not_fit",1200],["title","title",120],["lesson","lesson",1000]];
  for(const [key,column,max] of map){
    const value=input[key];
    if(value===undefined||value===null)continue;         // absent = untouched
    const cleaned=clean(value,max);
    // AN EMPTY STRING IS "UNCHANGED", NOT AN ERROR AND NOT A CLEAR.
    //
    // /experiences renders every column into a textarea and posts all of them back. OSF-1 made four
    // columns nullable, so a card written on /life/experience arrives there with nulls, which the
    // editor coalesces to "" — and throwing on "" made every such card permanently uneditable (422
    // on save). Silently nulling it instead would be the destructive-overwrite bug this whole
    // contract exists to prevent. So "" is the third thing: no instruction. Clearing a field remains
    // possible only through clearFields, which is explicit and cannot be produced by a form that
    // simply had nothing to put in the box.
    if(!cleaned){
      if(typeof value==="string"&&value.trim().length===0)continue;
      throw new Error(`experience_field_too_long:${column}`);  // over the limit, not empty
    }
    provided[column]=cleaned;
  }
  for(const field of input.clearFields??[]){
    if(!CLEARABLE_FIELDS.includes(field))throw new Error(`experience_field_not_clearable:${field}`);
    if(field in provided)throw new Error(`experience_field_set_and_cleared:${field}`);
    // The four sharing-context fields are required whenever the card is visible to anyone else —
    // both here and by yorisou_experience_cards_shared_context_chk. Refusing in the application too
    // so the caller gets a named error instead of a constraint violation.
    if(visibility!=="PRIVATE"&&field!=="title"&&field!=="lesson")throw new Error(`experience_field_required_when_shared:${field}`);
    provided[field]=null;
  }
  return provided;
}
export async function updateExperience(owner:string,id:string,input:ExperienceUpdateInput) {
  const current=await ownerCard(owner,id); if(!current)throw new Error("experience_not_found");
  await validateSource(owner,input.sourceSavedResultId);
  // Visibility is optional on a patch too: omitting it keeps whatever the card already has.
  const visibility=input.visibility??(current.visibility as ExperienceVisibility);
  if(!ACTIVE_VISIBILITIES.includes(visibility))throw new Error("invalid_experience_card");
  const content=updateBody(input,visibility);
  const version=Number(current.visibility_version)+1;
  // Turning a PRIVATE card into a shared one still has to satisfy the full sharing contract — and it
  // is the MERGED row, not the patch, that must satisfy it.
  const shared=visibility!=="PRIVATE";
  const merged=(column:string)=>column in content?content[column]:(current as Record<string,unknown>)[column];
  if(shared){
    if(SHARED_ONLY_FIELDS.some(column=>!merged(column))||!merged("situation")||!merged("action_tried")||!merged("perceived_outcome"))throw new Error("invalid_experience_card");
    // EVERY WIDENING NEEDS CONFIRMATION — not only PRIVATE -> shared. See isVisibilityExpansion.
    if(isVisibilityExpansion(String(current.visibility),visibility)&&!input.previewConfirmed)throw new Error("preview_confirmation_required");
    // The de-identification scan reads the MERGED row, not the patch. Scanning only the patch meant a
    // request that widened visibility while naming no content fields was scanned against almost
    // nothing — the check passed because there was nothing in it to find.
    const scanned:ExperienceInput={
      stateContext:String(merged("state_context")??""),situation:String(merged("situation")??""),
      actionTried:String(merged("action_tried")??""),perceivedOutcome:String(merged("perceived_outcome")??""),
      limitations:String(merged("limitations")??""),mayFit:String(merged("may_fit")??""),
      mayNotFit:String(merged("may_not_fit")??""),title:merged("title")==null?null:String(merged("title")),
      lesson:merged("lesson")==null?null:String(merged("lesson")),visibility,
    };
    const flags=trustFlags(scanned);
    if(flags.some(f=>f!=="clinical_or_absolute_claim"))throw new Error("identifying_detail_detected");
  }
  const body:Record<string,unknown>={...content,visibility};
  // METADATA THE UPDATE PATH MUST KEEP WRITING (OSF-1 regression repair).
  //
  // The original shared payload() set moderation_status, provenance and ai_assistance_status on every
  // update. Splitting update onto its own body dropped all three. The worst of the three is silent:
  // a card promoted from PRIVATE keeps moderation_status 'draft', and discoverExperiences requires
  // 'published' — so the person shares their experience, the save succeeds, and nobody ever sees it.
  body.moderation_status=shared?"published":"draft";
  body.provenance=(input.aiAssistanceStatus??current.ai_assistance_status)==="accepted"?"ai_organized":String(current.provenance??"user_authored");
  if(input.aiAssistanceStatus!==undefined)body.ai_assistance_status=input.aiAssistanceStatus;
  if(current.visibility!==visibility){
    const now=new Date().toISOString();
    body.consented_at=shared?now:null;
    body.searchable=shared&&visibility!=="INVITE_ONLY";
    body.audience_rule=visibility==="INVITE_ONLY"?"invite_token":visibility==="SIMILAR_STATE_ONLY"?"similar_state_only":shared?"anonymous_shared":"owner_only";
    body.published_at=shared?now:null;
    if(input.previewConfirmed)body.preview_confirmed_at=now;
  }
  // A moderator's decision outranks everything above — restored last so it cannot be overwritten by
  // the moderation_status line this repair reinstated.
  if(["limited","removed"].includes(String(current.moderation_status))){body.moderation_status=current.moderation_status;body.searchable=false;}
  const row=((await (await request(`yorisou_experience_cards?id=eq.${id}&owner_account_id=eq.${encodeURIComponent(owner)}`,{method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify({...body,visibility_version:version,last_visibility_change_at:new Date().toISOString(),updated_at:new Date().toISOString()})})).json()) as CardRow[])[0];
  if(!row)throw new Error("experience_update_failed");
  await revision(owner,row,version);
  if(current.visibility!==visibility){await Promise.all([request("yorisou_experience_consents",{method:"POST",body:JSON.stringify({project_id:PROJECT_ID,experience_id:id,owner_account_id:owner,visibility})}),request("yorisou_experience_visibility_events",{method:"POST",body:JSON.stringify({project_id:PROJECT_ID,experience_id:id,owner_account_id:owner,from_visibility:current.visibility,to_visibility:visibility})})]);}
  await event(owner,"draft_updated",id,{visibility,cleared:input.clearFields??[]});
  return row; }
export async function withdrawExperience(owner:string,id:string,deleted=false) { if(!await ownerCard(owner,id))throw new Error("experience_not_found"); const now=new Date().toISOString(); await request(`yorisou_experience_cards?id=eq.${id}&owner_account_id=eq.${encodeURIComponent(owner)}`,{method:"PATCH",body:JSON.stringify(deleted?{deleted_at:now,withdrawn_at:now,searchable:false}:{withdrawn_at:now,searchable:false})}); await event(owner,deleted?"deleted":"withdrawn",id); }
export async function createInvite(owner:string,id:string) { const card=await ownerCard(owner,id); if(!card||card.visibility!=="INVITE_ONLY")throw new Error("invite_not_available"); const token=randomBytes(24).toString("base64url"),tokenHash=createHash("sha256").update(token).digest("hex"),expires=new Date(Date.now()+7*86400000).toISOString(); await request("yorisou_experience_invites",{method:"POST",body:JSON.stringify({project_id:PROJECT_ID,experience_id:id,owner_account_id:owner,token_hash:tokenHash,expires_at:expires})}); return {token,expiresAt:expires}; }
export async function invitedCard(token:string) { const hash=createHash("sha256").update(token).digest("hex"); const invite=((await (await request(`yorisou_experience_invites?select=experience_id&token_hash=eq.${hash}&revoked_at=is.null&expires_at=gt.${encodeURIComponent(new Date().toISOString())}&limit=1`)).json()) as Array<{experience_id:string}>)[0]; if(!invite)return null; const row=((await (await request(`yorisou_experience_cards?select=id,state_context,situation,action_tried,perceived_outcome,limitations,may_fit,may_not_fit,visibility,provenance,ai_assistance_status,published_at&id=eq.${invite.experience_id}&visibility=eq.INVITE_ONLY&moderation_status=eq.published&withdrawn_at=is.null&deleted_at=is.null&limit=1`)).json()) as CardRow[])[0]; return row||null; }
// Null-tolerant since OSF-1: state_context is nullable for PRIVATE cards (202608140001), so this is
// reached with null for every card written through /life/experience. It previously took `string` and
// called .replace on it — see the note on the ownStates query in discoverExperiences.
function stateTokens(value:string|null|undefined){if(!value)return new Set<string>();const normalized=value.replace(/\s+/g,"").toLowerCase();return new Set(Array.from({length:Math.max(0,normalized.length-1)},(_,index)=>normalized.slice(index,index+2)));}
export async function discoverExperiences(owner:string) { const [rows,blocks,ownStates]=await Promise.all([request(`yorisou_experience_cards?select=id,owner_account_id,state_context,situation,action_tried,perceived_outcome,limitations,may_fit,may_not_fit,visibility,provenance,ai_assistance_status,published_at&visibility=in.(ANONYMOUS_SHARED,SIMILAR_STATE_ONLY)&moderation_status=eq.published&searchable=eq.true&withdrawn_at=is.null&deleted_at=is.null&owner_account_id=neq.${encodeURIComponent(owner)}&order=published_at.desc&limit=20`).then(r=>r.json()) as Promise<CardRow[]>,request(`yorisou_experience_blocks?select=blocked_owner_account_id&blocker_account_id=eq.${encodeURIComponent(owner)}`).then(r=>r.json()) as Promise<Array<{blocked_owner_account_id:string}>>,// OSF-1: `&state_context=not.is.null` and the nullable type are both required. Making
// state_context nullable for PRIVATE cards (202608140001) means a person who writes a note on
// /life/experience owns a card whose state_context is NULL; this query has no visibility filter, so
// that row lands here, and the old `Array<{state_context:string}>` annotation was simply false —
// the runtime value was null and stateTokens crashed on it. The GET handler has no try/catch, so the
// whole discover call 500'd and /experiences silently rendered an empty 今読める体験 section for
// exactly the people who had started using the new form.
request(`yorisou_experience_cards?select=state_context&owner_account_id=eq.${encodeURIComponent(owner)}&deleted_at=is.null&state_context=not.is.null&limit=20`).then(r=>r.json()) as Promise<Array<{state_context:string|null}>>]); const blocked=new Set(blocks.map(x=>x.blocked_owner_account_id)),viewerTokens=new Set(ownStates.flatMap(item=>[...stateTokens(item.state_context)])); return rows.filter(row=>!blocked.has(row.owner_account_id)&&(row.visibility!=="SIMILAR_STATE_ONLY"||[...stateTokens(String(row.state_context))].some(token=>viewerTokens.has(token)))).map(({owner_account_id:hiddenOwner,...safe})=>{void hiddenOwner;return {...safe,why_shown:safe.visibility==="SIMILAR_STATE_ONLY"?"あなたが自分で書いた関心と一部重なる体験として、限定的に表示されています。":"最近共有された匿名の体験です。"};}); }
export async function interact(owner:string,id:string,action:string,idempotencyKey:string) { if(!await sharedCard(owner,id))throw new Error("experience_not_available");await request("rpc/record_yorisou_experience_interaction",{method:"POST",body:JSON.stringify({p_experience_id:id,p_actor_account_id:owner,p_action:action,p_idempotency_key:idempotencyKey})}); await event(owner,"interaction",id,{action}); }
export async function reportExperience(owner:string,id:string,reason:string,note?:string) { if(!["unsafe","misleading","privacy","other"].includes(reason)||note&&note.length>1000)throw new Error("invalid_report");if(!await sharedCard(owner,id))throw new Error("experience_not_available"); await request("yorisou_experience_reports",{method:"POST",headers:{Prefer:"resolution=merge-duplicates,return=minimal"},body:JSON.stringify({project_id:PROJECT_ID,experience_id:id,reporter_account_id:owner,reason,note:note||null})});if(["unsafe","privacy"].includes(reason))await request(`yorisou_experience_cards?id=eq.${id}`,{method:"PATCH",body:JSON.stringify({moderation_status:"limited",searchable:false})}); await event(owner,"reported",id,{reason}); }
export async function blockExperienceOwner(owner:string,id:string) { const row=await sharedCard(owner,id); if(!row)throw new Error("invalid_block"); await request("yorisou_experience_blocks",{method:"POST",headers:{Prefer:"resolution=merge-duplicates,return=minimal"},body:JSON.stringify({project_id:PROJECT_ID,blocker_account_id:owner,blocked_owner_account_id:row.owner_account_id})}); await event(owner,"blocked",id); }
export async function structureExperience(owner:string,input:ExperienceInput) { const flags=trustFlags(input); const routes=resolvePrivateReflectionProviders(); if(!routes.length)throw new Error("experience_provider_unavailable"); const prompt=`YORISOUの体験カードを、事実を追加せず匿名化して日本語JSONに整理してください。診断や断定は禁止です。入力:${JSON.stringify({state_context:input.stateContext,situation:input.situation,action_tried:input.actionTried,perceived_outcome:input.perceivedOutcome,limitations:input.limitations,may_fit:input.mayFit,may_not_fit:input.mayNotFit})}\n出力:{"state_context":"","situation":"","action_tried":"","perceived_outcome":"","limitations":"","may_fit":"","may_not_fit":"","deidentification_notes":[],"safety_flags":[]}`; for(const route of routes){try{const response=await fetch(route.endpoint,{method:"POST",headers:route.headers,body:JSON.stringify(route.body(prompt)),signal:AbortSignal.timeout(20000)});if(!response.ok)continue;const parsed=route.parse(await response.json());if(!parsed.content)continue;const value=JSON.parse(parsed.content) as Record<string,unknown>; const structured={stateContext:clean(value.state_context,1200),situation:clean(value.situation,3000),actionTried:clean(value.action_tried,3000),perceivedOutcome:clean(value.perceived_outcome,3000),limitations:clean(value.limitations,2000),mayFit:clean(value.may_fit,1200),mayNotFit:clean(value.may_not_fit,1200),deidentificationNotes:Array.isArray(value.deidentification_notes)?value.deidentification_notes.slice(0,10):[],safetyFlags:[...flags,...(Array.isArray(value.safety_flags)?value.safety_flags.slice(0,10):[])]}; if(Object.values(structured).slice(0,7).some(v=>!v))continue;
        // OSF-1 AI BOUNDARY. The prompt above says 診断や断定は禁止, and until now nothing checked
        // whether the provider listened. A model that returns 「あなたは不安障害の傾向があります」 would
        // previously have been handed straight to the person as their own organised card. Rejecting
        // the whole candidate rather than editing it: a sanitised sentence would still carry the
        // provenance of a model that just broke the rule, and would read as product voice.
        try { assertAiOutputWithinBoundary(Object.values(structured).slice(0,7).join("\n")); } catch { continue; } await event(owner,"ai_structured",undefined,{provider:route.provider,model:route.model}); return structured;}catch{continue;}} throw new Error("experience_structuring_failed"); }
export async function moderationQueue() { return await (await request("yorisou_experience_cards?select=*&or=(moderation_status.eq.limited,moderation_status.eq.published)&order=updated_at.desc&limit=100")).json() as CardRow[]; }
export async function moderateExperience(admin:string,id:string,action:"limit"|"remove"|"restore",reason:string) { if(!clean(reason,1000))throw new Error("invalid_moderation");const row=((await (await request(`yorisou_experience_cards?select=visibility&id=eq.${id}&limit=1`)).json()) as Array<{visibility:string}>)[0];if(!row)throw new Error("experience_not_found"); const status=action==="limit"?"limited":action==="remove"?"removed":"published",searchable=action==="restore"&&["ANONYMOUS_SHARED","SIMILAR_STATE_ONLY"].includes(row.visibility); await request(`yorisou_experience_cards?id=eq.${id}`,{method:"PATCH",body:JSON.stringify({moderation_status:status,searchable})}); await request("yorisou_experience_moderation_events",{method:"POST",body:JSON.stringify({project_id:PROJECT_ID,experience_id:id,actor_account_id:admin,action,reason})}); await event(admin,"moderated",id,{action}); }
export const newIdempotencyKey=()=>randomUUID();
