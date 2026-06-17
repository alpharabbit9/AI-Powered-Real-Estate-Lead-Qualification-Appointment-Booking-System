import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createAppointment,
  updateLead,
  getLeadById,
  createActivityLog,
  getAppointments,
} from "@/lib/supabase/repository";
import { createCalendarEvent } from "@/lib/google-calendar/client";
import {
  sendConfirmationEmail,
  sendAgentNotification,
} from "@/lib/resend/client";

const AppointmentSchema = z.object({
  lead_id: z.string().uuid(),
  appointment_date: z.string(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = AppointmentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { lead_id, appointment_date, notes } = parsed.data;

    const lead = await getLeadById(lead_id);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Create Google Calendar event
    let meetingLink = "";
    let eventId = "";

    try {
      const calEvent = await createCalendarEvent({
        leadName: lead.name,
        leadEmail: lead.email,
        propertyType: lead.property_type,
        budget: lead.budget,
        leadScore: lead.lead_score,
        startTime: appointment_date,
        agentEmail: process.env.AGENT_EMAIL || "agent@realestate.com",
      });
      meetingLink = calEvent.meetingLink;
      eventId = calEvent.eventId;
    } catch (error) {
      console.error("Calendar event creation failed:", error);
      meetingLink = `https://meet.google.com/mock-${Date.now()}`;
    }

    // Create appointment record
    const appointment = await createAppointment({
      lead_id,
      appointment_date,
      meeting_link: meetingLink,
      status: "scheduled",
      notes: notes || null,
    });

    // Update lead status
    await updateLead(lead_id, {
      status: "booked",
      booking_status: "booked",
      last_contacted: new Date().toISOString(),
    });

    // Log activity
    await createActivityLog({
      lead_id,
      action: "appointment_booked",
      details: `Consultation scheduled for ${new Date(appointment_date).toLocaleString()}. Meeting: ${meetingLink}`,
    });

    // Send confirmation email to lead
    try {
      await sendConfirmationEmail({
        to: lead.email,
        name: lead.name,
        appointmentDate: appointment_date,
        meetingLink,
        propertyType: lead.property_type,
        location: lead.location,
      });

      await createActivityLog({
        lead_id,
        action: "confirmation_email_sent",
        details: "Confirmation email sent to lead",
      });
    } catch (error) {
      console.error("Confirmation email failed:", error);
    }

    // Send agent notification
    try {
      await sendAgentNotification({
        leadName: lead.name,
        leadEmail: lead.email,
        leadPhone: lead.phone,
        leadScore: lead.lead_score,
        propertyType: lead.property_type,
        location: lead.location,
        budget: lead.budget,
        appointmentDate: appointment_date,
        meetingLink,
        closeProbability: lead.close_probability,
        appointmentId: appointment.id,
      });

      await createActivityLog({
        lead_id,
        action: "agent_notified",
        details: "Agent notification email sent",
      });
    } catch (error) {
      console.error("Agent notification failed:", error);
    }

    return NextResponse.json(
      {
        success: true,
        appointment,
        meeting_link: meetingLink,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Appointment creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const appointments = await getAppointments();
    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("Get appointments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}
