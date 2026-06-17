import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createLead,
  createActivityLog,
  updateLead,
  createMeetingBrief,
  getLeads,
} from "@/lib/supabase/repository";
import { qualifyLead, generateMeetingBrief, generateBookingEmail } from "@/lib/groq/client";
import { sendBookingEmail } from "@/lib/resend/client";

const LeadSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Valid email required"),
  phone: z.string().optional().default(""),
  location: z.string().optional().default(""),
  property_type: z.string().min(1, "Property type is required"),
  budget: z.string().optional().default(""),
  message: z.string().optional().default(""),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = LeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Step 1: Qualify with Groq AI
    let qualification = {
      lead_score: 5,
      intent: "unknown",
      urgency: "unknown",
      buyer_type: "unknown",
      reasoning: "AI qualification unavailable",
      close_probability: 40,
    };

    try {
      qualification = await qualifyLead(data);
      // Clamp values defensively
      qualification.lead_score = Math.max(0, Math.min(10, qualification.lead_score));
      qualification.close_probability = Math.max(0, Math.min(100, qualification.close_probability));
    } catch (error) {
      console.error("Groq qualification failed:", error);
    }

    // Step 2: Store lead in Supabase
    const lead = await createLead({
      name: data.name,
      email: data.email,
      phone: data.phone,
      location: data.location,
      property_type: data.property_type,
      budget: data.budget,
      message: data.message,
      lead_score: qualification.lead_score,
      status:
        qualification.lead_score >= 8
          ? "hot"
          : qualification.lead_score >= 5
            ? "warm"
            : "cold",
      booking_status: "pending",
      close_probability: qualification.close_probability,
      last_contacted: null,
    });

    // Step 3: Log activity
    await createActivityLog({
      lead_id: lead.id,
      action: "lead_created",
      details: `Lead created with score ${qualification.lead_score}/10. Intent: ${qualification.intent}. ${qualification.reasoning}`,
    }).catch(console.error);

    // Step 4: Hot lead path (score >= 8)
    if (qualification.lead_score >= 8) {
      // Generate AI meeting brief
      try {
        const brief = await generateMeetingBrief({
          name: data.name,
          property_type: data.property_type,
          location: data.location,
          budget: data.budget,
          message: data.message,
          lead_score: qualification.lead_score,
          close_probability: qualification.close_probability,
        });

        await createMeetingBrief({
          lead_id: lead.id,
          summary: brief.summary,
          buyer_intent: brief.buyer_intent,
          objections: brief.objections,
          suggested_questions: brief.suggested_questions,
        });

        await createActivityLog({
          lead_id: lead.id,
          action: "meeting_brief_generated",
          details: "AI meeting brief generated for hot lead",
        }).catch(console.error);
      } catch (error) {
        console.error("Meeting brief generation failed:", error);
      }

      // Generate and send booking email
      try {
        let emailBody: string | undefined;
        try {
          const emailContent = await generateBookingEmail({
            name: data.name,
            property_type: data.property_type,
            location: data.location,
            budget: data.budget,
            booking_url: `${process.env.NEXT_PUBLIC_APP_URL}/book/${lead.id}`,
          });
          emailBody = emailContent.body;
        } catch {
          // fall through to default template
        }

        await sendBookingEmail({
          to: data.email,
          name: data.name,
          propertyType: data.property_type,
          location: data.location,
          leadId: lead.id,
          emailBody,
        });

        await updateLead(lead.id, { last_contacted: new Date().toISOString() });
        await createActivityLog({
          lead_id: lead.id,
          action: "booking_email_sent",
          details: "Personalized booking email sent to hot lead",
        }).catch(console.error);
      } catch (error) {
        console.error("Booking email failed:", error);
      }
    }

    return NextResponse.json(
      {
        success: true,
        lead_id: lead.id,
        score: qualification.lead_score,
        message:
          qualification.lead_score >= 8
            ? "Your inquiry has been received. Check your email for a consultation booking link!"
            : "Your inquiry has been received. We'll be in touch soon.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lead creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const leads = await getLeads();
    return NextResponse.json({ leads });
  } catch (error) {
    console.error("Get leads error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
