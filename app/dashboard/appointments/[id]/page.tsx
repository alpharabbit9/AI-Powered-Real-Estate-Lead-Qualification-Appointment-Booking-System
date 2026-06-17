import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  getAppointmentById,
  getMeetingBriefByLeadId,
  getActivityLogs,
  getLeadById,
} from "@/lib/supabase/repository";
import { MeetingDetailContent } from "@/components/appointments/meeting-detail-content";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

async function MeetingDetailData({ id }: { id: string }) {
  const appointment = await getAppointmentById(id);

  if (!appointment) {
    notFound();
  }

  const [brief, activityLogs, lead] = await Promise.all([
    getMeetingBriefByLeadId(appointment.lead_id),
    getActivityLogs(appointment.lead_id),
    getLeadById(appointment.lead_id),
  ]);

  return (
    <MeetingDetailContent
      appointment={appointment}
      brief={brief}
      activityLogs={activityLogs}
      lead={lead}
    />
  );
}

export default async function MeetingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="p-8">
      <Suspense fallback={<MeetingDetailSkeleton />}>
        <MeetingDetailData id={id} />
      </Suspense>
    </div>
  );
}

function MeetingDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
