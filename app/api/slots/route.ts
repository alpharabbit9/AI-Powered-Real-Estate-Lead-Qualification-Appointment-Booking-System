import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/google-calendar/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || undefined;

    let slots = await getAvailableSlots(date);

    // Fallback: generate mock slots if Google Calendar fails
    if (!slots || slots.length === 0) {
      slots = generateFallbackSlots(date);
    }

    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Get slots error:", error);
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || undefined;
    return NextResponse.json({ slots: generateFallbackSlots(date) });
  }
}

function generateFallbackSlots(fromDate?: string) {
  const slots = [];
  const base = fromDate ? new Date(fromDate) : new Date();
  if (isNaN(base.getTime())) base.setTime(Date.now());

  for (let day = 0; day <= 7; day++) {
    const date = new Date(base);
    date.setDate(base.getDate() + day);

    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    const hours = [9, 10, 11, 13, 14, 15, 16];
    for (const hour of hours) {
      const start = new Date(date);
      start.setHours(hour, 0, 0, 0);
      const end = new Date(date);
      end.setHours(hour + 1, 0, 0, 0);

      slots.push({
        start: start.toISOString(),
        end: end.toISOString(),
        available: Math.random() > 0.3,
      });
    }
  }

  return slots;
}
