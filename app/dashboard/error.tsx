"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  const isSupabaseError =
    error.message?.includes("supabase") ||
    error.message?.includes("fetch") ||
    error.message?.includes("Failed to fetch") ||
    error.message?.includes("placeholder");

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-8">
      <div className="max-w-md w-full text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-400/10 border border-red-400/20 flex items-center justify-center mx-auto mb-6">
          {isSupabaseError ? (
            <Database className="w-7 h-7 text-red-400" />
          ) : (
            <AlertTriangle className="w-7 h-7 text-red-400" />
          )}
        </div>

        <h2 className="text-xl font-bold text-white mb-3">
          {isSupabaseError ? "Database Not Connected" : "Something Went Wrong"}
        </h2>

        <p className="text-sm text-white/50 leading-relaxed mb-6">
          {isSupabaseError
            ? "The dashboard requires a Supabase connection. Add your real credentials to .env.local and restart the server."
            : error.message || "An unexpected error occurred while loading the dashboard."}
        </p>

        {isSupabaseError && (
          <div className="text-left bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 mb-6 font-mono text-xs text-white/50 space-y-1">
            <p className="text-white/30 mb-2 font-sans uppercase tracking-wider text-[10px]">Required in .env.local</p>
            <p>NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co</p>
            <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...</p>
            <p>SUPABASE_SERVICE_ROLE_KEY=eyJ...</p>
          </div>
        )}

        <Button onClick={reset} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
