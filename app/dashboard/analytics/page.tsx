import { Suspense } from "react";
import {
  getDashboardStats,
  getLeads,
  getAppointments,
  getLeadsOverTime,
  getLeadsByStatus,
} from "@/lib/supabase/repository";
import { AnalyticsContent } from "@/components/analytics/analytics-content";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function AnalyticsData() {
  const [stats, leads, appointments, leadsOverTime, leadsByStatus] =
    await Promise.all([
      getDashboardStats(),
      getLeads(),
      getAppointments(),
      getLeadsOverTime(),
      getLeadsByStatus(),
    ]);

  return (
    <AnalyticsContent
      stats={stats}
      leads={leads}
      appointments={appointments}
      leadsOverTime={leadsOverTime}
      leadsByStatus={leadsByStatus}
    />
  );
}

export default function AnalyticsPage() {
  return (
    <div className="p-8">
      <Suspense
        fallback={
          <div className="space-y-6">
            <Skeleton className="h-8 w-32" />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-2xl" />
              ))}
            </div>
            <Skeleton className="h-72 rounded-2xl" />
          </div>
        }
      >
        <AnalyticsData />
      </Suspense>
    </div>
  );
}
