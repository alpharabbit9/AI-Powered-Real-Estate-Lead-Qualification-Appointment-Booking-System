"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Zap,
  Shield,
  TrendingUp,
  Clock,
  Star,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import type { LeadFormData } from "@/types";

const PROPERTY_TYPES = [
  "Single Family Home",
  "Condominium",
  "Townhouse",
  "Multi-Family",
  "Luxury Villa",
  "Investment Property",
  "Commercial Property",
  "Land / Lot",
];

const BUDGETS = [
  "Under $200,000",
  "$200,000 – $400,000",
  "$400,000 – $600,000",
  "$600,000 – $800,000",
  "$800,000 – $1,200,000",
  "$1,200,000 – $2,000,000",
  "$2,000,000 – $5,000,000",
  "$5,000,000+",
];

const STATS = [
  { value: "94%", label: "Qualification rate" },
  { value: "2.3×", label: "Faster to booking" },
  { value: "68%", label: "Avg close rate" },
  { value: "<2min", label: "AI response time" },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Instant AI Qualification",
    desc: "Your inquiry is scored and categorized by AI within seconds",
  },
  {
    icon: Clock,
    title: "Same-Day Response",
    desc: "Hot leads receive a personalized booking link within minutes",
  },
  {
    icon: Shield,
    title: "Expert Matching",
    desc: "Paired with a specialist who understands your requirements",
  },
  {
    icon: TrendingUp,
    title: "Market Intelligence",
    desc: "Get real-time market insights during your consultation",
  },
];

const STEPS = [
  { n: "01", title: "Submit Inquiry", desc: "Fill in your property requirements" },
  { n: "02", title: "AI Qualifies", desc: "Groq AI scores and routes your lead" },
  { n: "03", title: "Book Slot", desc: "Pick a time — Google Meet auto-generated" },
  { n: "04", title: "Meet Expert", desc: "30-min consultation with your specialist" },
];

const INITIAL_FORM: LeadFormData = {
  name: "",
  email: "",
  phone: "",
  location: "",
  property_type: "",
  budget: "",
  message: "",
};

export default function HomePage() {
  const [formData, setFormData] = useState<LeadFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LeadFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Enter a valid email";
    if (!formData.property_type) newErrors.property_type = "Select a property type";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

    try {
      // Try n8n webhook first, fall back to internal API
      let response: Response | null = null;

      if (webhookUrl && !webhookUrl.includes("localhost:5678")) {
        try {
          response = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
            signal: AbortSignal.timeout(10000),
          });
        } catch {
          response = null;
        }
      }

      if (!response || !response.ok) {
        response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Submission failed");
      }

      setSubmitted(true);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description:
          err instanceof Error ? err.message : "Please try again or contact us directly.",
      });
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof LeadFormData) => ({
    value: formData[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [key]: e.target.value });
      if (errors[key]) setErrors({ ...errors, [key]: undefined });
    },
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#F59E0B]/[0.04] rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-64 w-[500px] h-[500px] bg-[#F59E0B]/[0.02] rounded-full blur-[100px]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/[0.05]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#F59E0B] flex items-center justify-center shadow-glow-amber">
            <Building2 className="w-4 h-4 text-black" strokeWidth={2.5} />
          </div>
          <span className="text-base font-bold tracking-tight">PropIQ</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/dashboard"
            className="hidden md:flex items-center gap-1 text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            Dashboard <ChevronRight className="w-3.5 h-3.5" />
          </a>
          <a href="/login">
            <Button variant="outline" size="sm">Agent Login</Button>
          </a>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">

        {/* Hero */}
        <div className="pt-20 pb-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 bg-[#F59E0B]/[0.08] border border-[#F59E0B]/[0.2] rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
              <span className="text-[11px] font-semibold text-[#F59E0B] tracking-[0.12em] uppercase">
                AI-Powered Real Estate
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-[72px] font-bold tracking-[-0.03em] leading-[1.05] mb-6">
              Find your perfect property
              <br />
              <span className="text-gradient-cyan">with AI guidance</span>
            </h1>

            <p className="text-lg text-white/45 max-w-xl mx-auto mb-12 leading-relaxed">
              Submit your inquiry and our AI qualifies, scores, and books a consultation with a specialist — automatically.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-16">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                  className="glass rounded-2xl p-4 border border-white/[0.06]"
                >
                  <div className="text-2xl font-bold text-[#F59E0B] mb-1 tracking-tight">
                    {s.value}
                  </div>
                  <div className="text-[11px] text-white/40 uppercase tracking-wider">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-20">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.07, duration: 0.5 }}
              className="relative p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.03] transition-all"
            >
              <div className="text-[11px] font-mono text-[#F59E0B]/60 mb-3 tracking-widest">{step.n}</div>
              <div className="text-sm font-semibold text-white mb-1">{step.title}</div>
              <div className="text-xs text-white/40 leading-relaxed">{step.desc}</div>
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute -right-1.5 top-1/2 -translate-y-1/2 z-10">
                  <ChevronRight className="w-3.5 h-3.5 text-white/20" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[1fr,500px] gap-16 pb-24">

          {/* Left */}
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-3">
                How it works
              </h2>
              <p className="text-white/45 text-base leading-relaxed">
                Our AI pipeline handles qualification, scheduling, and preparation automatically.
              </p>
            </div>

            <div className="space-y-3">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i + 0.3, duration: 0.5 }}
                  className="flex gap-4 p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.03] transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center shrink-0 group-hover:bg-[#F59E0B]/15 transition-colors">
                    <f.icon className="w-[18px] h-[18px] text-[#F59E0B]" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
                    <p className="text-sm text-white/45 leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Testimonial */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                ))}
              </div>
              <p className="text-sm text-white/60 leading-relaxed mb-5 italic">
                &ldquo;The AI understood exactly what I needed. I had a consultation booked within the hour and found my dream home two weeks later.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F59E0B]/30 to-[#F59E0B]/10 flex items-center justify-center text-xs font-bold text-[#F59E0B]">
                  SM
                </div>
                <div>
                  <div className="text-xs font-semibold">Sarah Mitchell</div>
                  <div className="text-[10px] text-white/35 uppercase tracking-wider">Luxury Condo, Manhattan</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="bg-[#0f0f0f] border border-white/[0.08] rounded-3xl p-8 shadow-premium-lg text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-[#F59E0B]" />
                  </div>
                  <div className="inline-flex items-center gap-2 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-full px-3 py-1 mb-4">
                    <span className="text-[10px] text-[#F59E0B] font-semibold uppercase tracking-wider">Inquiry Received</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">
                    We&apos;re on it, {formData.name.split(" ")[0]}.
                  </h3>
                  <p className="text-sm text-white/45 leading-relaxed mb-8">
                    Our AI is qualifying your requirements right now. If you&apos;re a strong match, you&apos;ll receive a personalized booking link within minutes.
                  </p>
                  <div className="space-y-2.5 text-left mb-8">
                    {[
                      { label: "AI qualification", done: true },
                      { label: "Personalized booking link", done: false },
                      { label: "Expert agent matched", done: false },
                    ].map((step) => (
                      <div key={step.label} className="flex items-center gap-3 text-sm p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${step.done ? "bg-[#F59E0B]/20 border-[#F59E0B]/40" : "border-white/10"}`}>
                          {step.done
                            ? <CheckCircle2 className="w-3 h-3 text-[#F59E0B]" />
                            : <span className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" />
                          }
                        </div>
                        <span className={step.done ? "text-white/70" : "text-white/40"}>{step.label}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => { setSubmitted(false); setFormData(INITIAL_FORM); }}
                    className="text-xs text-white/30 hover:text-white/60 transition-colors"
                  >
                    Submit another inquiry
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  className="bg-[#0f0f0f] border border-white/[0.08] rounded-3xl shadow-premium-lg overflow-hidden"
                >
                  {/* Form header */}
                  <div className="px-7 pt-7 pb-5 border-b border-white/[0.06]">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold tracking-tight">Request Consultation</h3>
                        <p className="text-xs text-white/35 mt-0.5">Free · 30 min · Google Meet</p>
                      </div>
                      <div className="flex gap-1">
                        {["bg-red-500/40", "bg-yellow-500/40", "bg-green-500/40"].map((c, i) => (
                          <div key={i} className={`w-2.5 h-2.5 rounded-full ${c}`} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="p-7 space-y-4" noValidate>
                    {/* Name */}
                    <div>
                      <Label htmlFor="name" className="mb-1.5 block">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Jane Smith"
                        className={errors.name ? "border-red-400/50 focus:border-red-400/80 focus:ring-red-400/20" : ""}
                        {...field("name")}
                        required
                      />
                      {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
                    </div>

                    {/* Email + Phone */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="email" className="mb-1.5 block">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="jane@example.com"
                          className={errors.email ? "border-red-400/50" : ""}
                          {...field("email")}
                          required
                        />
                        {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <Label htmlFor="phone" className="mb-1.5 block">Phone</Label>
                        <Input
                          id="phone"
                          placeholder="+1 (555) 000-0000"
                          {...field("phone")}
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <Label htmlFor="location" className="mb-1.5 block">Preferred Location</Label>
                      <Input
                        id="location"
                        placeholder="City, State or Neighborhood"
                        {...field("location")}
                      />
                    </div>

                    {/* Property Type + Budget */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="mb-1.5 block">Property Type *</Label>
                        <Select
                          value={formData.property_type}
                          onValueChange={(v) => {
                            setFormData({ ...formData, property_type: v });
                            if (errors.property_type) setErrors({ ...errors, property_type: undefined });
                          }}
                        >
                          <SelectTrigger className={errors.property_type ? "border-red-400/50" : ""}>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {PROPERTY_TYPES.map((t) => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.property_type && <p className="text-[11px] text-red-400 mt-1">{errors.property_type}</p>}
                      </div>
                      <div>
                        <Label className="mb-1.5 block">Budget Range</Label>
                        <Select
                          value={formData.budget}
                          onValueChange={(v) => setFormData({ ...formData, budget: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select range" />
                          </SelectTrigger>
                          <SelectContent>
                            {BUDGETS.map((b) => (
                              <SelectItem key={b} value={b}>{b}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <Label htmlFor="message" className="mb-1.5 block">Tell us more</Label>
                      <Textarea
                        id="message"
                        placeholder="Describe your ideal property, timeline, must-haves..."
                        className="min-h-[90px]"
                        {...field("message")}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                          Submitting...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Request Consultation
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      )}
                    </Button>

                    <p className="text-[11px] text-white/25 text-center leading-relaxed">
                      No commitment required. By submitting, you agree to be contacted by our team.
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.05] px-6 md:px-12 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#F59E0B] flex items-center justify-center">
              <Building2 className="w-3 h-3 text-black" />
            </div>
            <span className="text-xs text-white/30 font-medium">PropIQ</span>
          </div>
          <p className="text-[11px] text-white/20">
            © 2025 PropIQ. AI Real Estate Conversion System.
          </p>
        </div>
      </footer>
    </div>
  );
}
