import { google } from "googleapis";
import type { BookingSlot } from "@/types";

function getOAuth2Client() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  return oauth2Client;
}

export async function getAvailableSlots(
  date?: string
): Promise<BookingSlot[]> {
  const auth = getOAuth2Client();
  const calendar = google.calendar({ version: "v3", auth });

  const targetDate = date ? new Date(date) : new Date();
  targetDate.setHours(0, 0, 0, 0);

  const slots: BookingSlot[] = [];
  const businessHours = [9, 10, 11, 13, 14, 15, 16];

  for (let day = 0; day < 7; day++) {
    const currentDate = new Date(targetDate);
    currentDate.setDate(targetDate.getDate() + day);

    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    for (const hour of businessHours) {
      const slotStart = new Date(currentDate);
      slotStart.setHours(hour, 0, 0, 0);

      const slotEnd = new Date(currentDate);
      slotEnd.setHours(hour + 1, 0, 0, 0);

      if (slotStart <= new Date()) continue;

      slots.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
        available: true,
      });
    }
  }

  try {
    const timeMin = slots[0]?.start || new Date().toISOString();
    const timeMax = slots[slots.length - 1]?.end || new Date().toISOString();

    const busyResponse = await calendar.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        items: [{ id: process.env.GOOGLE_CALENDAR_ID || "primary" }],
      },
    });

    const busyTimes =
      busyResponse.data.calendars?.[
        process.env.GOOGLE_CALENDAR_ID || "primary"
      ]?.busy || [];

    return slots.map((slot) => {
      const isBusy = busyTimes.some((busy) => {
        if (!busy.start || !busy.end) return false;
        const busyStart = new Date(busy.start).getTime();
        const busyEnd = new Date(busy.end).getTime();
        const slotStart = new Date(slot.start).getTime();
        const slotEnd = new Date(slot.end).getTime();
        return slotStart < busyEnd && slotEnd > busyStart;
      });

      return { ...slot, available: !isBusy };
    });
  } catch {
    return slots;
  }
}

export async function createCalendarEvent(params: {
  leadName: string;
  leadEmail: string;
  propertyType: string;
  budget: string;
  leadScore: number;
  startTime: string;
  agentEmail: string;
}): Promise<{ eventId: string; meetingLink: string; htmlLink: string }> {
  const auth = getOAuth2Client();
  const calendar = google.calendar({ version: "v3", auth });

  const startDateTime = new Date(params.startTime);
  const endDateTime = new Date(startDateTime);
  endDateTime.setMinutes(endDateTime.getMinutes() + 30);

  const event = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
    conferenceDataVersion: 1,
    requestBody: {
      summary: `Property Consultation - ${params.leadName}`,
      description: `
Real Estate Consultation Meeting

Client: ${params.leadName}
Email: ${params.leadEmail}
Property Interest: ${params.propertyType}
Budget: ${params.budget}
Lead Score: ${params.leadScore}/10

This meeting was automatically scheduled via the AI Real Estate Booking System.
      `.trim(),
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: "America/New_York",
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: "America/New_York",
      },
      attendees: [
        { email: params.leadEmail },
        { email: params.agentEmail },
      ],
      conferenceData: {
        createRequest: {
          requestId: `real-estate-${Date.now()}`,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 30 },
        ],
      },
    },
  });

  const meetingLink =
    event.data.conferenceData?.entryPoints?.find(
      (ep) => ep.entryPointType === "video"
    )?.uri ||
    event.data.hangoutLink ||
    "";

  return {
    eventId: event.data.id || "",
    meetingLink,
    htmlLink: event.data.htmlLink || "",
  };
}

export async function cancelCalendarEvent(eventId: string): Promise<void> {
  const auth = getOAuth2Client();
  const calendar = google.calendar({ version: "v3", auth });

  await calendar.events.delete({
    calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
    eventId,
  });
}
