import { NextRequest, NextResponse } from "next/server";
import {
  getAppointmentById,
  updateAppointment,
  updateLead,
  createActivityLog,
} from "@/lib/supabase/repository";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const appointment = await getAppointmentById(id);

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ appointment });
  } catch (error) {
    console.error("Get appointment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, notes } = body;

    const appointment = await updateAppointment(id, { status, notes });

    if (status === "completed" && appointment.lead_id) {
      await updateLead(appointment.lead_id, { status: "completed" });
      await createActivityLog({
        lead_id: appointment.lead_id,
        action: "meeting_completed",
        details: "Consultation meeting marked as completed",
      });
    } else if (status === "cancelled" && appointment.lead_id) {
      await updateLead(appointment.lead_id, {
        status: "warm",
        booking_status: "cancelled",
      });
      await createActivityLog({
        lead_id: appointment.lead_id,
        action: "appointment_cancelled",
        details: "Appointment cancelled",
      });
    } else if (status === "missed" && appointment.lead_id) {
      await createActivityLog({
        lead_id: appointment.lead_id,
        action: "appointment_missed",
        details: "Lead did not attend scheduled meeting",
      });
    }

    return NextResponse.json({ appointment });
  } catch (error) {
    console.error("Update appointment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
