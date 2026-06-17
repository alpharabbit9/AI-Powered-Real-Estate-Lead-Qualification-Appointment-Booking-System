"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
  Cell,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { DashboardStats, Lead, Appointment } from "@/types";

interface AnalyticsContentProps {
  stats: DashboardStats;
  leads: Lead[];
  appointments: Appointment[];
  leadsOverTime: Array<{ date: string; count: number }>;
  leadsByStatus: Record<string, number>;
}

export function AnalyticsContent({
  stats,
  leads,
  appointments,
  leadsOverTime,
  leadsByStatus,
}: AnalyticsContentProps) {
  // Funnel data
  const funnelData = [
    { name: "Total Leads", value: stats.total_leads || 0, fill: "#F59E0B" },
    { name: "Qualified", value: stats.qualified_leads || 0, fill: "#D97706" },
    {
      name: "Appointments",
      value: stats.appointments_booked || 0,
      fill: "#D97706",
    },
    {
      name: "Completed",
      value: stats.completed_meetings || 0,
      fill: "#B45309",
    },
  ];

  // Score distribution
  const scoreDistribution = Array.from({ length: 10 }, (_, i) => ({
    score: `${i + 1}`,
    count: leads.filter((l) => l.lead_score === i + 1).length,
  }));

  // Close probability distribution
  const probRanges = [
    { range: "0-20%", count: leads.filter((l) => l.close_probability < 20).length },
    { range: "20-40%", count: leads.filter((l) => l.close_probability >= 20 && l.close_probability < 40).length },
    { range: "40-60%", count: leads.filter((l) => l.close_probability >= 40 && l.close_probability < 60).length },
    { range: "60-80%", count: leads.filter((l) => l.close_probability >= 60 && l.close_probability < 80).length },
    { range: "80-100%", count: leads.filter((l) => l.close_probability >= 80).length },
  ];

  // Property type breakdown
  const propertyTypes: Record<string, number> = {};
  leads.forEach((l) => {
    propertyTypes[l.property_type] = (propertyTypes[l.property_type] || 0) + 1;
  });
  const propertyData = Object.entries(propertyTypes)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Budget breakdown
  const budgets: Record<string, number> = {};
  leads.forEach((l) => {
    if (l.budget) budgets[l.budget] = (budgets[l.budget] || 0) + 1;
  });
  const budgetData = Object.entries(budgets)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Leads over time (last 14 days)
  const formattedTimeData = leadsOverTime.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  // Appointment outcomes
  const appointmentOutcomes = [
    { name: "Completed", value: appointments.filter((a) => a.status === "completed").length, fill: "#F59E0B" },
    { name: "Scheduled", value: appointments.filter((a) => a.status === "scheduled").length, fill: "#D97706" },
    { name: "Missed", value: appointments.filter((a) => a.status === "missed").length, fill: "#FF4444" },
    { name: "Cancelled", value: appointments.filter((a) => a.status === "cancelled").length, fill: "#666" },
  ];

  const kpis = [
    {
      label: "Lead to Qualified Rate",
      value: stats.total_leads > 0 ? Math.round((stats.qualified_leads / stats.total_leads) * 100) : 0,
      suffix: "%",
    },
    {
      label: "Qualified to Booked Rate",
      value: stats.qualified_leads > 0 ? Math.round((stats.appointments_booked / stats.qualified_leads) * 100) : 0,
      suffix: "%",
    },
    {
      label: "Booking to Completed Rate",
      value: stats.appointments_booked > 0 ? Math.round((stats.completed_meetings / stats.appointments_booked) * 100) : 0,
      suffix: "%",
    },
    {
      label: "Overall Conversion",
      value: stats.conversion_rate,
      suffix: "%",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-white/40 mt-1">
          Pipeline performance and conversion metrics
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-5">
              <div className="text-3xl font-bold text-[#F59E0B] mb-1">
                {kpi.value}{kpi.suffix}
              </div>
              <div className="text-xs text-white/40 mb-3">{kpi.label}</div>
              <Progress value={kpi.value} className="h-1" />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Funnel + Time Chart */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Conversion Funnel
            </CardTitle>
            <p className="text-xs text-white/40">Lead → Qualified → Booked → Completed</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {funnelData.map((item, i) => {
                const pct = funnelData[0].value > 0 ? Math.round((item.value / funnelData[0].value) * 100) : 0;
                return (
                  <div key={item.name}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-white/60">{item.name}</span>
                      <span className="font-semibold">
                        {item.value}{" "}
                        <span className="text-white/30">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-8 bg-white/[0.04] rounded-lg overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }}
                        className="h-full rounded-lg flex items-center"
                        style={{ background: item.fill }}
                      >
                        <span className="text-xs font-bold text-black px-3">
                          {item.value}
                        </span>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Leads Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Leads Over Time
            </CardTitle>
            <p className="text-xs text-white/40">Daily new inquiries</p>
          </CardHeader>
          <CardContent>
            {formattedTimeData.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center text-white/30 text-sm">
                No data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={formattedTimeData}>
                  <defs>
                    <linearGradient id="timeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="count" name="Leads" stroke="#F59E0B" strokeWidth={2} fill="url(#timeGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Score Distribution + Close Probability */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Lead Score Distribution
            </CardTitle>
            <p className="text-xs text-white/40">Number of leads by AI score</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={scoreDistribution}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                <XAxis dataKey="score" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", fontSize: "12px" }} />
                <Bar dataKey="count" name="Leads" radius={[4, 4, 0, 0]}>
                  {scoreDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        parseInt(entry.score) >= 8
                          ? "#F59E0B"
                          : parseInt(entry.score) >= 5
                            ? "#FFB800"
                            : "#FF4444"
                      }
                      fillOpacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Close Probability Distribution
            </CardTitle>
            <p className="text-xs text-white/40">Leads grouped by close likelihood</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={probRanges}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                <XAxis dataKey="range" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", fontSize: "12px" }} />
                <Bar dataKey="count" name="Leads" fill="#F59E0B" fillOpacity={0.7} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Property + Budget */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Property Type Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {propertyData.length === 0 ? (
              <p className="text-sm text-white/30 py-8 text-center">No data</p>
            ) : (
              <div className="space-y-3">
                {propertyData.map((item) => {
                  const pct = leads.length > 0 ? Math.round((item.value / leads.length) * 100) : 0;
                  return (
                    <div key={item.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/60 truncate max-w-[200px]">{item.name}</span>
                        <span className="font-semibold ml-2">{item.value} <span className="text-white/30">({pct}%)</span></span>
                      </div>
                      <Progress value={pct} className="h-1.5" />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Budget Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {budgetData.length === 0 ? (
              <p className="text-sm text-white/30 py-8 text-center">No data</p>
            ) : (
              <div className="space-y-3">
                {budgetData.map((item) => {
                  const pct = leads.length > 0 ? Math.round((item.value / leads.length) * 100) : 0;
                  return (
                    <div key={item.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/60 truncate max-w-[200px]">{item.name}</span>
                        <span className="font-semibold ml-2">{item.value} <span className="text-white/30">({pct}%)</span></span>
                      </div>
                      <Progress value={pct} className="h-1.5" />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
