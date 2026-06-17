import { notFound } from "next/navigation";
import { getLeadById } from "@/lib/supabase/repository";
import { BookingPageContent } from "@/components/booking/booking-page-content";

export const dynamic = "force-dynamic";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ leadId: string }>;
}) {
  const { leadId } = await params;
  const lead = await getLeadById(leadId);

  if (!lead) {
    notFound();
  }

  return <BookingPageContent lead={lead} />;
}
