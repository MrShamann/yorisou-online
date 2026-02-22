// app/api/reservations/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let payload: any = {};

    if (contentType.includes("application/json")) {
      payload = await request.json();
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const text = await request.text();
      const params = new URLSearchParams(text);
      payload = Object.fromEntries(params.entries());
    } else if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      payload = Object.fromEntries(form.entries());
    } else {
      const text = await request.text();
      try {
        payload = JSON.parse(text);
      } catch {
        const params = new URLSearchParams(text);
        payload = Object.fromEntries(params.entries());
      }
    }

    const filePath = path.join(process.cwd(), "reservations.json");
    const existing = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, "utf-8"))
      : [];

    const record = {
      ...payload,
      timestamp: new Date().toISOString(),
      source: "yorisou.online",
    };

    existing.push(record);
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to save reservation" },
      { status: 500 }
    );
  }
}