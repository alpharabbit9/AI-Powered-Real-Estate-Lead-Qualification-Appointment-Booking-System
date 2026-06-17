import { Suspense } from "react";
import {
  getDashboardStats,
  getLeads,
  getAppointments,
} from "@/lib/supabase/repository";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function DashboardData() {
  const [stats, recentLeads, appointments] = await Promise.all([
    getDashboardStats(),
    getLeads(),
    getAppointments(),
  ]);

  return (
    <DashboardContent
      stats={stats}
      recentLeads={recentLeads.slice(0, 8)}
      appointments={appointments}
    />
  );
}

export default function DashboardPage() {
  return (
    <div className="p-8">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardData />
      </Suspense>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </div>
  );
}
