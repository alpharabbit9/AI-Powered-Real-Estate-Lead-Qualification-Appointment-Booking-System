import { Suspense } from "react";
import { getAppointments } from "@/lib/supabase/repository";
import { AppointmentsContent } from "@/components/appointments/appointments-content";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function AppointmentsData() {
  const appointments = await getAppointments();
  return <AppointmentsContent appointments={appointments} />;
}

export default function AppointmentsPage() {
  return (
    <div className="p-8">
      <Suspense
        fallback={
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
        }
      >
        <AppointmentsData />
      </Suspense>
    </div>
  );
}
