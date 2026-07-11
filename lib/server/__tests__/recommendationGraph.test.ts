import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const sql=readFileSync("supabase/migrations/202607110003_recommendation_graph.sql","utf8");
const required=["yorisou_resource_sources","yorisou_resources","yorisou_recommendation_sets","yorisou_recommendation_items","yorisou_recommendation_actions","yorisou_recommendation_reports","yorisou_recommendation_returns","yorisou_recommendation_events","project_id text not null default 'yorisou'","set search_path=public","revoke all on function","grant execute on function public.record_yorisou_recommendation_action","commercial_status in ('yorisou_owned','public_resource','organic_external','partner','affiliate','sponsored','unknown_review')","rank between 1 and 5","action in ('viewed','reason_viewed','saved','try_intent','tried','helpful','not_helpful','not_relevant','hidden','reported','resource_opened')"];
for(const value of required)assert.ok(sql.includes(value),`missing ${value}`);
assert.ok(!sql.includes("grant execute on function public.record_yorisou_recommendation_action(uuid,text,text,text,text) to public"));
console.log(JSON.stringify({status:"ok",recommendation_graph_assertions:required.length+1,negative:1}));
