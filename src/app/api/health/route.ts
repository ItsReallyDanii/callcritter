import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "callcritter",
    scope: "prompt-03-canvas-editor"
  });
}
