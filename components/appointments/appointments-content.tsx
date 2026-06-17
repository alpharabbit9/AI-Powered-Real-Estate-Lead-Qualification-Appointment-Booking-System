"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Calendar,
  Video,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStatusBadge, formatDateTime, getLeadScoreBg } from "@/lib/utils";
import type { Appointment, Lead } from "@/types";

interface AppointmentsContentProps {
  appointments: Appointment[];
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const lead = appointment.lead as Lead | undefined;
  const apptDate = new Date(appointment.appointment_date);
  const isPast = apptDate < new Date();

  const statusIcons = {
    scheduled: Clock,
    completed: CheckCircle2,
    missed: AlertCircle,
    cancelled: XCircle,
  };

  const StatusIcon =
    statusIcons[appointment.status as keyof typeof statusIcons] || Clock;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Link href={`/dashboard/appointments/${appointment.id}`}>
        <Card className="p-5 hover:border-white/[0.15] transition-all cursor-pointer group">
          <div className="flex items-start gap-4">
            {/* Date Badge */}
            <div className="w-14 h-14 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex flex-col items-center justify-center shrink-0">
              <span className="text-[10px] text-[#F59E0B] font-semibold uppercase tracking-wider">
                {apptDate.toLocaleDateString("en-US", { month: "short" })}
              </span>
              <span className="text-lg font-bold text-[#F59E0B] leading-none">
                {apptDate.getDate()}
              </span>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-white text-sm">
                    {lead?.name || "Unknown Client"}
                  </h3>
                  <p className="text-xs text-white/40 mt-0.5">
                    {lead?.property_type || "Property Consultation"} •{" "}
                    {apptDate.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wide shrink-0 ${getStatusBadge(appointment.status)}`}
                >
                  {appointment.status}
                </span>
              </div>

              <div className="flex items-center gap-4 mt-3">
                {lead?.lead_score !== undefined && (
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getLeadScoreBg(lead.lead_score)}`}
                  >
                    Score: {lead.lead_score}/10
                  </span>
                )}
                {lead?.budget && (
                  <span className="text-xs text-white/40">{lead.budget}</span>
                )}
                {appointment.meeting_link && !isPast && (
                  <a
                    href={appointment.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-xs text-[#F59E0B] hover:underline"
                  >
                    <Video className="w-3 h-3" />
                    Join Meeting
                  </a>
                )}
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0 mt-1" />
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

export function AppointmentsContent({ appointments }: AppointmentsContentProps) {
  const now = new Date();
  const upcoming = appointments.filter(
    (a) => a.status === "scheduled" && new Date(a.appointment_date) > now
  );
  const past = appointments.filter(
    (a) =>
      a.status !== "scheduled" || new Date(a.appointment_date) <= now
  );

  const stats = {
    total: appointments.length,
    upcoming: upcoming.length,
    completed: appointments.filter((a) => a.status === "completed").length,
    missed: appointments.filter((a) => a.status === "missed").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
        <p className="text-sm text-white/40 mt-1">
          Manage your consultation schedule
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, color: "text-white" },
          { label: "Upcoming", value: stats.upcoming, color: "text-[#F59E0B]" },
          {
            label: "Completed",
            value: stats.completed,
            color: "text-green-400",
          },
          { label: "Missed", value: stats.missed, color: "text-red-400" },
        ].map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-xs text-white/40 mt-1">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
          <TabsTrigger value="all">All ({appointments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-3 mt-4">
          {upcoming.length === 0 ? (
            <Card className="p-12 text-center">
              <Calendar className="w-8 h-8 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm">No upcoming appointments.</p>
            </Card>
          ) : (
            upcoming.map((appt) => (
              <AppointmentCard key={appt.id} appointment={appt} />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-3 mt-4">
          {past.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-white/40 text-sm">No past appointments.</p>
            </Card>
          ) : (
            past.map((appt) => (
              <AppointmentCard key={appt.id} appointment={appt} />
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-3 mt-4">
          {appointments.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="w-8 h-8 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm">
                No appointments yet. Leads will be able to book after
                qualification.
              </p>
            </Card>
          ) : (
            appointments.map((appt) => (
              <AppointmentCard key={appt.id} appointment={appt} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
