export type LeadStatus = "new" | "qualified" | "hot" | "warm" | "cold" | "booked" | "completed" | "lost";
export type BookingStatus = "pending" | "booked" | "completed" | "missed" | "cancelled";
export type AppointmentStatus = "scheduled" | "completed" | "missed" | "cancelled";

export interface Lead {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  property_type: string;
  budget: string;
  message: string;
  lead_score: number;
  status: LeadStatus;
  booking_status: BookingStatus;
  close_probability: number;
  last_contacted: string | null;
}

export interface Appointment {
  id: string;
  lead_id: string;
  appointment_date: string;
  meeting_link: string;
  status: AppointmentStatus;
  notes: string | null;
  created_at: string;
  lead?: Lead;
}

export interface MeetingBrief {
  id: string;
  lead_id: string;
  summary: string;
  buyer_intent: string;
  objections: string;
  suggested_questions: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  lead_id: string;
  action: string;
  details: string;
  created_at: string;
}

export interface GroqQualificationResult {
  lead_score: number;
  intent: string;
  urgency: string;
  buyer_type: string;
  reasoning: string;
  close_probability: number;
}

export interface DashboardStats {
  total_leads: number;
  qualified_leads: number;
  appointments_booked: number;
  completed_meetings: number;
  conversion_rate: number;
  avg_close_probability: number;
}

export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  property_type: string;
  budget: string;
  message: string;
}

export interface BookingSlot {
  start: string;
  end: string;
  available: boolean;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees: Array<{ email: string }>;
  conferenceData?: {
    entryPoints?: Array<{
      entryPointType: string;
      uri: string;
    }>;
  };
}

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: Lead;
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          email: string;
          phone: string;
          location: string;
          property_type: string;
          budget: string;
          message: string;
          lead_score: number;
          status: LeadStatus;
          booking_status: BookingStatus;
          close_probability: number;
          last_contacted?: string | null;
        };
        Update: Partial<Lead>;
        Relationships: [];
      };
      appointments: {
        Row: Omit<Appointment, "lead">;
        Insert: {
          id?: string;
          created_at?: string;
          lead_id: string;
          appointment_date: string;
          meeting_link: string;
          status: AppointmentStatus;
          notes?: string | null;
        };
        Update: Partial<Omit<Appointment, "lead">>;
        Relationships: [];
      };
      meeting_briefs: {
        Row: MeetingBrief;
        Insert: {
          id?: string;
          created_at?: string;
          lead_id: string;
          summary: string;
          buyer_intent: string;
          objections: string;
          suggested_questions: string;
        };
        Update: Partial<MeetingBrief>;
        Relationships: [];
      };
      activity_logs: {
        Row: ActivityLog;
        Insert: {
          id?: string;
          created_at?: string;
          lead_id: string;
          action: string;
          details: string;
        };
        Update: Partial<ActivityLog>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
