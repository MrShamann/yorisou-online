import { NextResponse } from "next/server";
import { requireAdminRequestViewer } from "@/lib/server/foundation/access";
import { moderateExperience, moderationQueue } from "@/lib/server/experienceCards";
export async function GET(){if(!await requireAdminRequestViewer())return NextResponse.json({error:"unauthorized"},{status:401});return NextResponse.json({experiences:await moderationQueue()});}
export async function POST(request:Request){const viewer=await requireAdminRequestViewer();const accountId=viewer?.account?.id||null;if(!accountId)return NextResponse.json({error:"unauthorized"},{status:401});try{const body=await request.json() as {id:string;action:"limit"|"remove"|"restore";reason:string};await moderateExperience(accountId,body.id,body.action,body.reason);return NextResponse.json({ok:true});}catch{return NextResponse.json({error:"moderation_failed"},{status:422});}}
