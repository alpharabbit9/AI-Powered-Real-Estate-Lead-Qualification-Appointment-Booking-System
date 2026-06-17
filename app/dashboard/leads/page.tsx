import { Suspense } from "react";
import { getLeads } from "@/lib/supabase/repository";
import { LeadsContent } from "@/components/leads/leads-content";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter = "all" } = await searchParams;

  return (
    <div className="p-8">
      <Suspense fallback={<LeadsSkeleton />}>
        <LeadsLoader filter={filter} />
      </Suspense>
    </div>
  );
}

async function LeadsLoader({ filter }: { filter: string }) {
  const leads = await getLeads(filter);
  return <LeadsContent leads={leads} initialFilter={filter} />;
}

function LeadsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 flex-1" />
      </div>
      <Skeleton className="h-[500px] rounded-2xl" />
    </div>
  );
}
