"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Video,
  Clock,
  User,
  Home,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Brain,
  Target,
  MessageSquare,
  HelpCircle,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  formatDateTime,
  getLeadScoreBg,
  getStatusBadge,
  formatDate,
} from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import type { Appointment, Lead, MeetingBrief, ActivityLog } from "@/types";

interface MeetingDetailContentProps {
  appointment: Appointment;
  brief: MeetingBrief | null;
  activityLogs: ActivityLog[];
  lead: Lead | null;
}

export function MeetingDetailContent({
  appointment,
  brief,
  activityLogs,
  lead: initialLead,
}: MeetingDetailContentProps) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const lead = appointment.lead ?? initialLead;

  const handleStatusUpdate = async (status: string) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/appointments/${appointment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Update failed");

      toast({
        title: "Status updated",
        description: `Appointment marked as ${status}`,
      });

      router.refresh();
    } catch {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Please try again",
      });
    } finally {
      setUpdating(false);
    }
  };

  const apptDate = new Date(appointment.appointment_date);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/appointments">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold">
            {lead?.name || "Client"} — Property Consultation
          </h1>
          <p className="text-sm text-white/40 mt-0.5">
            {formatDateTime(appointment.appointment_date)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {appointment.status === "scheduled" && (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleStatusUpdate("missed")}
                disabled={updating}
              >
                Mark Missed
              </Button>
              <Button
                onClick={() => handleStatusUpdate("completed")}
                size="sm"
                disabled={updating}
              >
                Mark Completed
              </Button>
            </>
          )}
          {appointment.meeting_link && (
            <a
              href={appointment.meeting_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" className="gap-2">
                <Video className="w-4 h-4" />
                Join Meeting
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lead Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-[#F59E0B]" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lead ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-white/40 uppercase tracking-wider">
                      Name
                    </p>
                    <p className="text-sm font-medium">{lead.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-white/40 uppercase tracking-wider">
                      Email
                    </p>
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-sm font-medium text-[#F59E0B] hover:underline flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3" />
                      {lead.email}
                    </a>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-white/40 uppercase tracking-wider">
                      Phone
                    </p>
                    <a
                      href={`tel:${lead.phone}`}
                      className="text-sm font-medium flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-white/40" />
                      {lead.phone || "—"}
                    </a>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-white/40 uppercase tracking-wider">
                      Location
                    </p>
                    <p className="text-sm font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-white/40" />
                      {lead.location || "—"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-white/40 uppercase tracking-wider">
                      Property Type
                    </p>
                    <p className="text-sm font-medium flex items-center gap-1">
                      <Home className="w-3 h-3 text-white/40" />
                      {lead.property_type}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-white/40 uppercase tracking-wider">
                      Budget
                    </p>
                    <p className="text-sm font-medium flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-white/40" />
                      {lead.budget || "—"}
                    </p>
                  </div>

                  {lead.message && (
                    <div className="sm:col-span-2 space-y-1">
                      <p className="text-xs text-white/40 uppercase tracking-wider">
                        Their Message
                      </p>
                      <p className="text-sm text-white/70 leading-relaxed bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
                        &ldquo;{lead.message}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-white/40">
                  Lead information not available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Meeting Brief */}
          {brief ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Brain className="w-4 h-4 text-[#F59E0B]" />
                  AI Meeting Brief
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <h4 className="text-xs text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MessageSquare className="w-3 h-3" />
                    Summary
                  </h4>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {brief.summary}
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="text-xs text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Target className="w-3 h-3" />
                    Buyer Intent
                  </h4>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {brief.buyer_intent}
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="text-xs text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3" />
                    Potential Objections
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {brief.objections.split(",").map((obj, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 bg-red-400/10 border border-red-400/20 text-red-400 rounded-full"
                      >
                        {obj.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-xs text-white/40 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <HelpCircle className="w-3 h-3" />
                    Suggested Questions
                  </h4>
                  <div className="space-y-2">
                    {brief.suggested_questions
                      .split("\n")
                      .filter(Boolean)
                      .map((q, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]"
                        >
                          <span className="text-[#F59E0B] font-bold text-xs mt-0.5 shrink-0">
                            {i + 1}.
                          </span>
                          <p className="text-sm text-white/70">{q}</p>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-8 text-center">
              <Brain className="w-8 h-8 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm">
                Meeting brief not available. Brief is generated for hot leads
                (score ≥ 8).
              </p>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Score & Probability */}
          {lead && (
            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-5">Lead Intelligence</h3>

              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/40">Lead Score</span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getLeadScoreBg(lead.lead_score)}`}
                    >
                      {lead.lead_score}/10
                    </span>
                  </div>
                  <Progress value={lead.lead_score * 10} />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/40">
                      Close Probability
                    </span>
                    <span className="text-xs font-bold text-[#F59E0B]">
                      {lead.close_probability}%
                    </span>
                  </div>
                  <Progress value={lead.close_probability} />
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Status</span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wide ${getStatusBadge(lead.status)}`}
                    >
                      {lead.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Booking</span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wide ${getStatusBadge(appointment.status)}`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Lead Since</span>
                    <span className="text-white/60">
                      {formatDate(lead.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Meeting Info */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold mb-4">Meeting Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-white/30" />
                <div>
                  <p className="text-xs text-white/40">Date & Time</p>
                  <p className="text-sm font-medium">
                    {formatDateTime(appointment.appointment_date)}
                  </p>
                </div>
              </div>
              {appointment.meeting_link && (
                <div className="flex items-start gap-2.5">
                  <Video className="w-4 h-4 text-white/30 mt-0.5" />
                  <div>
                    <p className="text-xs text-white/40">Google Meet</p>
                    <a
                      href={appointment.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#F59E0B] hover:underline break-all"
                    >
                      {appointment.meeting_link}
                    </a>
                  </div>
                </div>
              )}
              {appointment.notes && (
                <div>
                  <p className="text-xs text-white/40 mb-1">Notes</p>
                  <p className="text-sm text-white/60">{appointment.notes}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#F59E0B]" />
                Activity Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activityLogs.length === 0 ? (
                <p className="text-xs text-white/40">No activity yet</p>
              ) : (
                <div className="space-y-3">
                  {activityLogs.map((log, i) => (
                    <div
                      key={log.id}
                      className="flex gap-3 text-xs"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] mt-1 shrink-0" />
                        {i < activityLogs.length - 1 && (
                          <div className="w-px flex-1 bg-white/[0.06] my-1" />
                        )}
                      </div>
                      <div className="pb-3 min-w-0">
                        <p className="font-medium text-white/70 capitalize">
                          {log.action.replace(/_/g, " ")}
                        </p>
                        <p className="text-white/30 text-[10px] mt-0.5">
                          {formatDateTime(log.created_at)}
                        </p>
                        {log.details && (
                          <p className="text-white/40 mt-1 text-[11px] leading-relaxed">
                            {log.details}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
