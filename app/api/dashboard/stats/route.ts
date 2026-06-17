import { NextResponse } from "next/server";
import {
  getDashboardStats,
  getLeadsByStatus,
  getLeadsOverTime,
} from "@/lib/supabase/repository";

export async function GET() {
  try {
    const [stats, byStatus, overTime] = await Promise.all([
      getDashboardStats(),
      getLeadsByStatus(),
      getLeadsOverTime(),
    ]);

    return NextResponse.json({ stats, byStatus, overTime });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
