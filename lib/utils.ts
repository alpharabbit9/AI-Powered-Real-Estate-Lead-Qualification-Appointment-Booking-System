import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getLeadScoreColor(score: number): string {
  if (score >= 8) return "text-amber-400";
  if (score >= 5) return "text-orange-400";
  return "text-red-400";
}

export function getLeadScoreBg(score: number): string {
  if (score >= 8) return "bg-amber-400/10 text-amber-400 border-amber-400/20";
  if (score >= 5) return "bg-orange-400/10 text-orange-400 border-orange-400/20";
  return "bg-red-400/10 text-red-400 border-red-400/20";
}

export function getStatusBadge(status: string): string {
  const statusMap: Record<string, string> = {
    new: "bg-blue-400/10 text-blue-400 border-blue-400/20",
    qualified: "bg-purple-400/10 text-purple-400 border-purple-400/20",
    hot: "bg-orange-400/10 text-orange-400 border-orange-400/20",
    warm: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    cold: "bg-slate-400/10 text-slate-400 border-slate-400/20",
    booked: "bg-cyan-400/10 text-cyan-400 border-cyan-400/20",
    completed: "bg-green-400/10 text-green-400 border-green-400/20",
    lost: "bg-red-400/10 text-red-400 border-red-400/20",
    scheduled: "bg-cyan-400/10 text-cyan-400 border-cyan-400/20",
    missed: "bg-red-400/10 text-red-400 border-red-400/20",
    cancelled: "bg-slate-400/10 text-slate-400 border-slate-400/20",
    pending: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  };
  return statusMap[status] || "bg-slate-400/10 text-slate-400 border-slate-400/20";
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + "..." : str;
}

export function generateTimeSlots(date: Date): Date[] {
  const slots: Date[] = [];
  const hours = [9, 10, 11, 13, 14, 15, 16];

  for (const hour of hours) {
    const slot = new Date(date);
    slot.setHours(hour, 0, 0, 0);
    if (slot > new Date()) {
      slots.push(slot);
    }
  }

  return slots;
}

export function isBusinessDay(date: Date): boolean {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}
