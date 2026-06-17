"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Video,
  User,
  Home,
  DollarSign,
  MapPin,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getLeadScoreBg } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import type { Lead, BookingSlot } from "@/types";

interface BookingPageContentProps {
  lead: Lead;
}

const DAYS_FORWARD = 14;

function getWeekDays(startDate: Date): Date[] {
  const days: Date[] = [];
  let current = new Date(startDate);

  while (days.length < 7) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      days.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }

  return days;
}

export function BookingPageContent({ lead }: BookingPageContentProps) {
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() + weekOffset * 7);
  if (weekStart.getDay() === 0) weekStart.setDate(weekStart.getDate() + 1);
  if (weekStart.getDay() === 6) weekStart.setDate(weekStart.getDate() + 2);

  const weekDays = getWeekDays(weekStart);

  useEffect(() => {
    fetchSlots();
  }, [weekOffset]);

  const fetchSlots = async () => {
    setLoading(true);
    setSelectedSlot(null);
    try {
      const response = await fetch(
        `/api/slots?date=${weekStart.toISOString()}`
      );
      const data = await response.json();
      setSlots(data.slots || []);
    } catch {
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const getSlotsForDay = (day: Date): BookingSlot[] => {
    return slots.filter((slot) => {
      const slotDate = new Date(slot.start);
      return (
        slotDate.getDate() === day.getDate() &&
        slotDate.getMonth() === day.getMonth() &&
        slotDate.getFullYear() === day.getFullYear()
      );
    });
  };

  const handleBook = async () => {
    if (!selectedSlot) return;

    if (lead.booking_status === "booked") {
      toast({
        variant: "destructive",
        title: "Already booked",
        description: "You have an existing appointment.",
      });
      return;
    }

    setBooking(true);
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: lead.id,
          appointment_date: selectedSlot.start,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Booking failed");
      }

      setMeetingLink(data.meeting_link || "");
      setBooked(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Booking failed",
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setBooking(false);
    }
  };

  if (lead.booking_status === "booked" && !booked) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-xl font-bold mb-3">Already Scheduled</h2>
          <p className="text-white/50 text-sm">
            You already have a consultation appointment booked. Check your email
            for the meeting details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-[#F59E0B]/[0.03] rounded-full blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center px-6 md:px-12 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#F59E0B] flex items-center justify-center">
            <Building2 className="w-4 h-4 text-black" />
          </div>
          <span className="text-sm font-bold tracking-tight">PropIQ</span>
        </div>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {booked ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center"
            >
              <div className="w-20 h-20 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-10 h-10 text-[#F59E0B]" />
              </div>
              <h1 className="text-3xl font-bold mb-4">
                You&apos;re confirmed!
              </h1>
              <p className="text-white/50 mb-8">
                Your property consultation with a specialist has been scheduled.
                Check your email for the confirmation and calendar invite.
              </p>

              {selectedSlot && (
                <div className="glass rounded-2xl p-6 text-left mb-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-[#F59E0B]" />
                      <div>
                        <p className="text-xs text-white/40">Date</p>
                        <p className="text-sm font-semibold">
                          {new Date(selectedSlot.start).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-[#F59E0B]" />
                      <div>
                        <p className="text-xs text-white/40">Time</p>
                        <p className="text-sm font-semibold">
                          {new Date(selectedSlot.start).toLocaleTimeString(
                            "en-US",
                            { hour: "2-digit", minute: "2-digit" }
                          )}{" "}
                          — 30 minutes
                        </p>
                      </div>
                    </div>
                    {meetingLink && (
                      <div className="flex items-center gap-3">
                        <Video className="w-4 h-4 text-[#F59E0B]" />
                        <div>
                          <p className="text-xs text-white/40">Meeting Link</p>
                          <a
                            href={meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold text-[#F59E0B] hover:underline"
                          >
                            Join Google Meet
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {meetingLink && (
                <a href={meetingLink} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="gap-2">
                    <Video className="w-4 h-4" />
                    Join Google Meet
                  </Button>
                </a>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="booking"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Header */}
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold mb-3">
                  Schedule Your Consultation
                </h1>
                <p className="text-white/50">
                  Select an available time slot for your 30-minute property
                  consultation
                </p>
              </div>

              <div className="grid lg:grid-cols-[320px,1fr] gap-8">
                {/* Lead Info Card */}
                <div className="space-y-4">
                  <Card className="p-5">
                    <h3 className="text-sm font-semibold mb-4 text-white/60 uppercase tracking-wider">
                      Your Inquiry
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5">
                        <User className="w-4 h-4 text-white/30" />
                        <span className="text-sm">{lead.name}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Home className="w-4 h-4 text-white/30" />
                        <span className="text-sm">{lead.property_type}</span>
                      </div>
                      {lead.location && (
                        <div className="flex items-center gap-2.5">
                          <MapPin className="w-4 h-4 text-white/30" />
                          <span className="text-sm">{lead.location}</span>
                        </div>
                      )}
                      {lead.budget && (
                        <div className="flex items-center gap-2.5">
                          <DollarSign className="w-4 h-4 text-white/30" />
                          <span className="text-sm">{lead.budget}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/[0.06]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-white/40">AI Score</span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getLeadScoreBg(lead.lead_score)}`}
                        >
                          {lead.lead_score}/10
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-white/40">
                          Close Probability
                        </span>
                        <span className="text-xs font-bold text-[#F59E0B]">
                          {lead.close_probability}%
                        </span>
                      </div>
                      <Progress value={lead.close_probability} className="h-1" />
                    </div>
                  </Card>

                  {selectedSlot && (
                    <Card className="p-5 border-[#F59E0B]/20">
                      <h3 className="text-sm font-semibold mb-3 text-[#F59E0B]">
                        Selected Time
                      </h3>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold">
                          {new Date(selectedSlot.start).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                        <p className="text-sm text-white/60">
                          {new Date(selectedSlot.start).toLocaleTimeString(
                            "en-US",
                            { hour: "2-digit", minute: "2-digit" }
                          )}{" "}
                          — 30 min
                        </p>
                      </div>
                      <Button
                        onClick={handleBook}
                        disabled={booking}
                        className="w-full mt-4 gap-2"
                        size="lg"
                      >
                        {booking ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Booking...
                          </>
                        ) : (
                          <>
                            <Calendar className="w-4 h-4" />
                            Confirm Booking
                          </>
                        )}
                      </Button>
                    </Card>
                  )}

                  {/* Meeting details */}
                  <Card className="p-5">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5">
                        <Clock className="w-4 h-4 text-[#F59E0B]" />
                        <div>
                          <p className="text-xs text-white/40">Duration</p>
                          <p className="text-sm font-medium">30 minutes</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Video className="w-4 h-4 text-[#F59E0B]" />
                        <div>
                          <p className="text-xs text-white/40">Format</p>
                          <p className="text-sm font-medium">Google Meet</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Calendar */}
                <div>
                  {/* Week Navigation */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
                      {weekDays[0]?.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h2>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
                        disabled={weekOffset === 0}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setWeekOffset(weekOffset + 1)}
                        disabled={weekOffset >= 2}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <Loader2 className="w-6 h-6 animate-spin text-[#F59E0B]" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-5 gap-2">
                      {weekDays.map((day) => {
                        const daySlots = getSlotsForDay(day);
                        const isToday =
                          day.toDateString() === new Date().toDateString();

                        return (
                          <div key={day.toISOString()} className="space-y-2">
                            {/* Day Header */}
                            <div
                              className={`text-center p-2 rounded-xl ${
                                isToday
                                  ? "bg-[#F59E0B]/10 border border-[#F59E0B]/20"
                                  : ""
                              }`}
                            >
                              <p className="text-xs text-white/40 uppercase tracking-wider">
                                {day.toLocaleDateString("en-US", {
                                  weekday: "short",
                                })}
                              </p>
                              <p
                                className={`text-lg font-bold mt-0.5 ${
                                  isToday ? "text-[#F59E0B]" : ""
                                }`}
                              >
                                {day.getDate()}
                              </p>
                            </div>

                            {/* Time Slots */}
                            <div className="space-y-1.5">
                              {daySlots.length === 0 ? (
                                <p className="text-xs text-white/20 text-center py-2">
                                  —
                                </p>
                              ) : (
                                daySlots.map((slot) => {
                                  const isSelected =
                                    selectedSlot?.start === slot.start;
                                  const time = new Date(
                                    slot.start
                                  ).toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                  });

                                  return (
                                    <button
                                      key={slot.start}
                                      onClick={() =>
                                        slot.available && setSelectedSlot(slot)
                                      }
                                      disabled={!slot.available}
                                      className={`
                                        w-full text-xs py-2 px-1 rounded-lg font-medium transition-all
                                        ${
                                          !slot.available
                                            ? "text-white/20 bg-white/[0.02] cursor-not-allowed line-through"
                                            : isSelected
                                              ? "bg-[#F59E0B] text-black shadow-glow-amber"
                                              : "text-white/60 bg-white/[0.04] hover:bg-white/[0.08] hover:text-white border border-transparent hover:border-white/10"
                                        }
                                      `}
                                    >
                                      {time}
                                    </button>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-6 text-xs text-white/40">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-[#F59E0B]" />
                      Selected
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-white/[0.08]" />
                      Available
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-white/[0.02]" />
                      Unavailable
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
