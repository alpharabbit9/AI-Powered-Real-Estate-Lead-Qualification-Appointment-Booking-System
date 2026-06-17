import { NextRequest, NextResponse } from "next/server";

/**
 * This endpoint receives callbacks from n8n workflows.
 * Currently used for logging/debugging webhook responses.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("n8n webhook callback received:", JSON.stringify(body, null, 2));

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ received: true });
  }
}
