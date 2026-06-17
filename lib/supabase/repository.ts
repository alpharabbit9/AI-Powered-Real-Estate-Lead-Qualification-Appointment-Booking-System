import { createServiceClient } from "./server";
import type {
  Lead,
  Appointment,
  MeetingBrief,
  ActivityLog,
  DashboardStats,
} from "@/types";

async function db() {
  return createServiceClient();
}

export async function getLeads(filter?: string): Promise<Lead[]> {
  const supabase = await db();
  let query = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (filter && filter !== "all") {
    if (filter === "hot") query = query.gte("lead_score", 8);
    else if (filter === "warm") query = query.gte("lead_score", 5).lt("lead_score", 8);
    else if (filter === "cold") query = query.lt("lead_score", 5);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch leads: ${error.message}`);
  return (data ?? []) as unknown as Lead[];
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const supabase = await db();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as unknown as Lead;
}

export async function createLead(
  lead: Omit<Lead, "id" | "created_at">
): Promise<Lead> {
  const supabase = await db();
  const { data, error } = await supabase
    .from("leads")
    .insert(lead)
    .select()
    .single();

  if (error) throw new Error(`Failed to create lead: ${error.message}`);
  return data as unknown as Lead;
}

export async function updateLead(
  id: string,
  updates: Partial<Omit<Lead, "id" | "created_at">>
): Promise<Lead> {
  const supabase = await db();
  const { data, error } = await supabase
    .from("leads")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update lead: ${error.message}`);
  return data as unknown as Lead;
}

export async function getAppointments(): Promise<Appointment[]> {
  const supabase = await db();
  const { data, error } = await supabase
    .from("appointments")
    .select(`*, lead:leads(*)`)
    .order("appointment_date", { ascending: true });

  if (error) throw new Error(`Failed to fetch appointments: ${error.message}`);
  return (data ?? []) as unknown as Appointment[];
}

export async function getAppointmentById(id: string): Promise<Appointment | null> {
  const supabase = await db();
  const { data, error } = await supabase
    .from("appointments")
    .select(`*, lead:leads(*)`)
    .eq("id", id)
    .single();

  if (error) return null;
  return data as unknown as Appointment;
}

export async function createAppointment(
  appointment: Omit<Appointment, "id" | "created_at" | "lead">
): Promise<Appointment> {
  const supabase = await db();
  const { data, error } = await supabase
    .from("appointments")
    .insert(appointment)
    .select()
    .single();

  if (error) throw new Error(`Failed to create appointment: ${error.message}`);
  return data as unknown as Appointment;
}

export async function updateAppointment(
  id: string,
  updates: Partial<Omit<Appointment, "id" | "created_at" | "lead">>
): Promise<Appointment> {
  const supabase = await db();
  const { data, error } = await supabase
    .from("appointments")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update appointment: ${error.message}`);
  return data as unknown as Appointment;
}

export async function getMeetingBriefByLeadId(leadId: string): Promise<MeetingBrief | null> {
  const supabase = await db();
  const { data, error } = await supabase
    .from("meeting_briefs")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return data as unknown as MeetingBrief;
}

export async function createMeetingBrief(
  brief: Omit<MeetingBrief, "id" | "created_at">
): Promise<MeetingBrief> {
  const supabase = await db();
  const { data, error } = await supabase
    .from("meeting_briefs")
    .insert(brief)
    .select()
    .single();

  if (error) throw new Error(`Failed to create meeting brief: ${error.message}`);
  return data as unknown as MeetingBrief;
}

export async function getActivityLogs(leadId: string): Promise<ActivityLog[]> {
  const supabase = await db();
  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch activity logs: ${error.message}`);
  return (data ?? []) as unknown as ActivityLog[];
}

export async function createActivityLog(
  log: Omit<ActivityLog, "id" | "created_at">
): Promise<ActivityLog> {
  const supabase = await db();
  const { data, error } = await supabase
    .from("activity_logs")
    .insert(log)
    .select()
    .single();

  if (error) throw new Error(`Failed to create activity log: ${error.message}`);
  return data as unknown as ActivityLog;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await db();

  const [leadsResult, appointmentsResult] = await Promise.all([
    supabase.from("leads").select("status, lead_score, close_probability, booking_status"),
    supabase.from("appointments").select("status"),
  ]);

  const leads = (leadsResult.data ?? []) as Array<{
    lead_score: number;
    status: string;
    close_probability: number;
    booking_status: string;
  }>;
  const appointments = (appointmentsResult.data ?? []) as Array<{ status: string }>;

  const total_leads = leads.length;
  const qualified_leads = leads.filter((l) => l.lead_score >= 7).length;
  const appointments_booked = appointments.filter(
    (a) => a.status === "scheduled" || a.status === "completed"
  ).length;
  const completed_meetings = appointments.filter((a) => a.status === "completed").length;
  const conversion_rate =
    total_leads > 0 ? Math.round((completed_meetings / total_leads) * 100) : 0;
  const avg_close_probability =
    leads.length > 0
      ? Math.round(
          leads.reduce((sum, l) => sum + (l.close_probability || 0), 0) / leads.length
        )
      : 0;

  return {
    total_leads,
    qualified_leads,
    appointments_booked,
    completed_meetings,
    conversion_rate,
    avg_close_probability,
  };
}

export async function getLeadsByStatus(): Promise<Record<string, number>> {
  const supabase = await db();
  const { data } = await supabase.from("leads").select("status");

  const counts: Record<string, number> = {};
  ((data ?? []) as Array<{ status: string }>).forEach((lead) => {
    counts[lead.status] = (counts[lead.status] || 0) + 1;
  });
  return counts;
}

export async function getLeadsOverTime(): Promise<Array<{ date: string; count: number }>> {
  const supabase = await db();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data } = await supabase
    .from("leads")
    .select("created_at")
    .gte("created_at", thirtyDaysAgo.toISOString());

  const countsByDate: Record<string, number> = {};
  ((data ?? []) as Array<{ created_at: string }>).forEach((lead) => {
    const date = new Date(lead.created_at).toISOString().split("T")[0];
    countsByDate[date] = (countsByDate[date] || 0) + 1;
  });

  return Object.entries(countsByDate)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
