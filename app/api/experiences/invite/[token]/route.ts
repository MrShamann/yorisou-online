import { NextResponse } from "next/server";
import { invitedCard } from "@/lib/server/experienceCards";
export async function GET(_request:Request,context:{params:Promise<{token:string}>}){const {token}=await context.params;const card=await invitedCard(token);return card?NextResponse.json({experience:card}):NextResponse.json({error:"not_found"},{status:404});}
