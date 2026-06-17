import { Resend } from "resend";
import {
  bookingEmailTemplate,
  confirmationEmailTemplate,
  agentNotificationTemplate,
  reminderEmailTemplate,
} from "./templates";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL || "noreply@realestate.com";
const AGENT_EMAIL = process.env.AGENT_EMAIL || "agent@realestate.com";

export async function sendBookingEmail(params: {
  to: string;
  name: string;
  propertyType: string;
  location: string;
  leadId: string;
  emailBody?: string;
}): Promise<void> {
  const bookingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/book/${params.leadId}`;

  await resend.emails.send({
    from: FROM,
    to: params.to,
    subject: "Your Property Consultation is Ready",
    html: bookingEmailTemplate({
      name: params.name,
      propertyType: params.propertyType,
      location: params.location,
      bookingUrl,
      emailBody: params.emailBody,
    }),
  });
}

export async function sendConfirmationEmail(params: {
  to: string;
  name: string;
  appointmentDate: string;
  meetingLink: string;
  propertyType: string;
  location: string;
}): Promise<void> {
  await resend.emails.send({
    from: FROM,
    to: params.to,
    subject: "Your Consultation Has Been Confirmed",
    html: confirmationEmailTemplate(params),
  });
}

export async function sendAgentNotification(params: {
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  leadScore: number;
  propertyType: string;
  location: string;
  budget: string;
  appointmentDate: string;
  meetingLink: string;
  closeProbability: number;
  appointmentId: string;
}): Promise<void> {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/appointments/${params.appointmentId}`;

  await resend.emails.send({
    from: FROM,
    to: AGENT_EMAIL,
    subject: `🔥 New Consultation Booked — ${params.leadName} (Score: ${params.leadScore}/10)`,
    html: agentNotificationTemplate({
      ...params,
      dashboardUrl,
    }),
  });
}

export async function sendReminderEmail(params: {
  to: string;
  name: string;
  propertyType: string;
  location: string;
  leadId: string;
  reminderNumber: number;
}): Promise<void> {
  const bookingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/book/${params.leadId}`;
  const subjects = [
    "Still interested? Your consultation slot is waiting",
    "Final reminder — Your consultation expires soon",
  ];

  await resend.emails.send({
    from: FROM,
    to: params.to,
    subject: subjects[params.reminderNumber - 1] || subjects[0],
    html: reminderEmailTemplate({
      name: params.name,
      propertyType: params.propertyType,
      location: params.location,
      bookingUrl,
      reminderNumber: params.reminderNumber,
    }),
  });
}
