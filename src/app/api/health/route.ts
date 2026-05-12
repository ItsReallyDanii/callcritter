import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "callcritter",
    scope: "prompt-02-core-ai-endpoints"
  });
}
