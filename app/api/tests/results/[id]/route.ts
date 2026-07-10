import { NextResponse } from "next/server";
import { deleteSavedTestResultForOwner, getSavedTestResultForOwner } from "@/lib/server/testResults";
import { getViewerContext } from "@/lib/server/yorisouAuth";

async function owner() { const viewer = await getViewerContext(); return viewer.account?.id || viewer.legacyAccount?.id || null; }
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) { const accountId = await owner(); if (!accountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 }); const { id } = await context.params; const saved = await getSavedTestResultForOwner(id, accountId); return saved ? NextResponse.json({ saved }) : NextResponse.json({ error: "not_found" }, { status: 404 }); }
export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) { const accountId = await owner(); if (!accountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 }); const { id } = await context.params; const saved = await deleteSavedTestResultForOwner(id, accountId); return saved ? NextResponse.json({ deleted: true }) : NextResponse.json({ error: "not_found" }, { status: 404 }); }
