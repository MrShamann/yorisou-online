import { NextResponse } from "next/server";
import { getViewerContext } from "@/lib/server/yorisouAuth";
import { createRecommendationSet, createReturn } from "@/lib/server/recommendationGraph";
async function owner(){const viewer=await getViewerContext();return viewer.account?.id||viewer.legacyAccount?.id||null;}
export async function POST(request:Request){const accountId=await owner();if(!accountId)return NextResponse.json({error:"authentication_required"},{status:401});try{const body=await request.json() as Record<string,unknown>;if(body.action==="return")return NextResponse.json(await createReturn(accountId,String(body.setId),body.when as "tomorrow"|"three_days"|"week"|"none"));return NextResponse.json(await createRecommendationSet(accountId,body,typeof body.idempotencyKey==="string"?body.idempotencyKey:crypto.randomUUID()),{status:201});}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"recommendation_failed"},{status:422});}}
