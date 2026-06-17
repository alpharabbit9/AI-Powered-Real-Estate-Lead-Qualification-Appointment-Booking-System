"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Flame,
  TrendingUp,
  Snowflake,
  Users,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDate, getLeadScoreBg, getStatusBadge } from "@/lib/utils";
import type { Lead } from "@/types";

const FILTERS = [
  { key: "all", label: "All Leads", icon: Users },
  { key: "hot", label: "Hot", icon: Flame },
  { key: "warm", label: "Warm", icon: TrendingUp },
  { key: "cold", label: "Cold", icon: Snowflake },
];

interface LeadsContentProps {
  leads: Lead[];
  initialFilter?: string;
}

export function LeadsContent({
  leads,
  initialFilter = "all",
}: LeadsContentProps) {
  const router = useRouter();
  const [filter, setFilter] = useState(initialFilter);
  const [search, setSearch] = useState("");

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      !search ||
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.property_type.toLowerCase().includes(search.toLowerCase()) ||
      lead.location.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "hot" && lead.lead_score >= 8) ||
      (filter === "warm" && lead.lead_score >= 5 && lead.lead_score < 8) ||
      (filter === "cold" && lead.lead_score < 5);

    return matchesSearch && matchesFilter;
  });

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    router.push(`/dashboard/leads?filter=${newFilter}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <p className="text-sm text-white/40 mt-1">
            {filteredLeads.length} lead{filteredLeads.length !== 1 ? "s" : ""}{" "}
            found
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 p-1 bg-white/[0.04] border border-white/[0.08] rounded-xl">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => handleFilterChange(f.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === f.key
                  ? "bg-white/[0.1] text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              <f.icon className="w-3 h-3" />
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input
            placeholder="Search by name, email, property..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-5 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-white/40 uppercase tracking-wider hidden md:table-cell">
                  Property
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-white/40 uppercase tracking-wider hidden lg:table-cell">
                  Budget
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">
                  Score
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-white/40 uppercase tracking-wider hidden sm:table-cell">
                  Close %
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-white/40 uppercase tracking-wider hidden md:table-cell">
                  Date
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-16 text-white/30 text-sm"
                  >
                    No leads found. Try adjusting your filters.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead, i) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-xs font-bold text-white/60 shrink-0">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">
                            {lead.name}
                          </div>
                          <div className="text-xs text-white/40">
                            {lead.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="text-sm text-white/70">
                        {lead.property_type}
                      </div>
                      <div className="text-xs text-white/30">
                        {lead.location || "—"}
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-sm text-white/70">
                        {lead.budget || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border ${getLeadScoreBg(lead.lead_score)}`}
                      >
                        {lead.lead_score}/10
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <Progress
                          value={lead.close_probability}
                          className="w-16 h-1"
                        />
                        <span className="text-xs text-white/50 min-w-[32px]">
                          {lead.close_probability}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center text-[10px] font-semibold px-2 py-1 rounded-full border uppercase tracking-wide ${getStatusBadge(lead.status)}`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-xs text-white/40">
                        {formatDate(lead.created_at)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/book/${lead.id}`} target="_blank">
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-[#F59E0B]">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </Link>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
