"use client";

import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Activity,
  ArrowRight,
  Flame,
  Target,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { formatDate, getLeadScoreBg, getStatusBadge } from "@/lib/utils";
import type { DashboardStats, Lead, Appointment } from "@/types";

const COLORS = ["#F59E0B", "#D97706", "#B45309", "#92400E"];

interface DashboardContentProps {
  stats: DashboardStats;
  recentLeads: Lead[];
  appointments: Appointment[];
}

const STAT_CARDS = (stats: DashboardStats) => [
  {
    label: "Total Leads",
    value: stats.total_leads,
    icon: Users,
    change: "+12%",
    positive: true,
    description: "All inquiries received",
  },
  {
    label: "Qualified Leads",
    value: stats.qualified_leads,
    icon: Target,
    change: "+8%",
    positive: true,
    description: "Score ≥ 7",
  },
  {
    label: "Appointments",
    value: stats.appointments_booked,
    icon: Calendar,
    change: "+23%",
    positive: true,
    description: "Booked consultations",
  },
  {
    label: "Completed",
    value: stats.completed_meetings,
    icon: CheckCircle2,
    change: "+5%",
    positive: true,
    description: "Meetings held",
  },
  {
    label: "Conversion Rate",
    value: `${stats.conversion_rate}%`,
    icon: TrendingUp,
    change: "+2.1%",
    positive: true,
    description: "Leads → completed",
  },
  {
    label: "Avg Close Probability",
    value: `${stats.avg_close_probability}%`,
    icon: Flame,
    change: "+4%",
    positive: true,
    description: "AI prediction avg",
  },
];

const MOCK_CHART_DATA = Array.from({ length: 14 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (13 - i));
  return {
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    leads: Math.floor(Math.random() * 8) + 2,
    appointments: Math.floor(Math.random() * 4) + 1,
  };
});

export function DashboardContent({
  stats,
  recentLeads,
  appointments,
}: DashboardContentProps) {
  const upcomingAppointments = appointments
    .filter(
      (a) => a.status === "scheduled" && new Date(a.appointment_date) > new Date()
    )
    .slice(0, 4);

  const statusData = [
    { name: "Hot", value: recentLeads.filter((l) => l.lead_score >= 8).length || 1 },
    { name: "Warm", value: recentLeads.filter((l) => l.lead_score >= 5 && l.lead_score < 8).length || 1 },
    { name: "Cold", value: recentLeads.filter((l) => l.lead_score < 5).length || 1 },
    { name: "Booked", value: recentLeads.filter((l) => l.status === "booked").length || 1 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-white/40 mt-1">
            Overview of your real estate pipeline
          </p>
        </div>
        <Link href="/" target="_blank">
          <Button variant="outline" size="sm" className="gap-2">
            Lead Form
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {STAT_CARDS(stats).map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
          >
            <Card className="p-5 hover:border-white/[0.12] transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-[#F59E0B]" />
                </div>
                <span
                  className={`text-xs font-medium ${stat.positive ? "text-green-400" : "text-red-400"}`}
                >
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold tracking-tight mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-white/40">{stat.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Pipeline Activity
            </CardTitle>
            <p className="text-xs text-white/40">Leads and appointments over 14 days</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={MOCK_CHART_DATA}>
                <defs>
                  <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="apptGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#D97706" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1a1a1a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "white",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="leads"
                  name="Leads"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  fill="url(#leadsGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="appointments"
                  name="Appointments"
                  stroke="#D97706"
                  strokeWidth={2}
                  fill="url(#apptGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Lead Distribution
            </CardTitle>
            <p className="text-xs text-white/40">By qualification score</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 w-full mt-2">
              {statusData.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: COLORS[i] }}
                    />
                    <span className="text-white/50">{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Recent Leads</CardTitle>
              <p className="text-xs text-white/40 mt-0.5">Latest inquiries</p>
            </div>
            <Link href="/dashboard/leads">
              <Button variant="ghost" size="sm" className="text-xs text-[#F59E0B] gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentLeads.length === 0 ? (
              <div className="text-center py-8 text-white/30 text-sm">
                No leads yet. Share your inquiry form to get started.
              </div>
            ) : (
              recentLeads.slice(0, 5).map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-xs font-bold text-white/60 shrink-0">
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{lead.name}</div>
                    <div className="text-xs text-white/40 truncate">
                      {lead.property_type}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getLeadScoreBg(lead.lead_score)}`}
                    >
                      {lead.lead_score}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full border capitalize ${getStatusBadge(lead.status)}`}
                    >
                      {lead.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                Upcoming Meetings
              </CardTitle>
              <p className="text-xs text-white/40 mt-0.5">
                Scheduled consultations
              </p>
            </div>
            <Link href="/dashboard/appointments">
              <Button variant="ghost" size="sm" className="text-xs text-[#F59E0B] gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-8 text-white/30 text-sm">
                No upcoming appointments.
              </div>
            ) : (
              upcomingAppointments.map((appt) => {
                const apptDate = new Date(appt.appointment_date);
                return (
                  <Link
                    key={appt.id}
                    href={`/dashboard/appointments/${appt.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors block"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] text-[#F59E0B] font-semibold uppercase">
                        {apptDate.toLocaleDateString("en-US", { month: "short" })}
                      </span>
                      <span className="text-sm font-bold text-[#F59E0B]">
                        {apptDate.getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {appt.lead?.name || "Client"}
                      </div>
                      <div className="text-xs text-white/40">
                        {apptDate.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Progress
                        value={appt.lead?.close_probability || 0}
                        className="w-16 h-1"
                      />
                      <span className="text-xs text-white/40">
                        {appt.lead?.close_probability || 0}%
                      </span>
                    </div>
                  </Link>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
