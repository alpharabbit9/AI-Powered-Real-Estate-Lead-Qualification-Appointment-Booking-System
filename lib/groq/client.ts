import Groq from "groq-sdk";
import type { GroqQualificationResult, LeadFormData } from "@/types";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function qualifyLead(
  lead: LeadFormData
): Promise<GroqQualificationResult> {
  const prompt = `You are an expert real estate lead qualification specialist. Analyze the following property inquiry and provide a detailed qualification assessment.

Lead Information:
- Name: ${lead.name}
- Email: ${lead.email}
- Phone: ${lead.phone}
- Location Interest: ${lead.location}
- Property Type: ${lead.property_type}
- Budget: ${lead.budget}
- Message: ${lead.message}

Scoring Criteria (0-10):
- Budget specified (0-2 points): Vague = 0, Range = 1, Specific = 2
- Property type specified (0-2 points): None = 0, General = 1, Specific = 2
- Urgency signals (0-2 points): No urgency = 0, Moderate = 1, High urgency = 2
- Message detail level (0-2 points): Minimal = 0, Moderate = 1, Detailed = 2
- Purchase intent signals (0-2 points): Browsing = 0, Considering = 1, Ready to buy = 2

Return ONLY a valid JSON object with this exact structure:
{
  "lead_score": <integer 0-10>,
  "intent": "<buying|renting|investing|browsing>",
  "urgency": "<immediate|within_3_months|within_6_months|flexible|unknown>",
  "buyer_type": "<first_time_buyer|repeat_buyer|investor|downsizer|upsizer|relocating|unknown>",
  "reasoning": "<1-2 sentence explanation of score>",
  "close_probability": <integer 0-100>
}`;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a real estate lead qualification AI. Always respond with valid JSON only. No markdown, no explanation outside JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.1,
    max_tokens: 500,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("No response from Groq");

  const result = JSON.parse(content) as GroqQualificationResult;
  return result;
}

export async function generateMeetingBrief(lead: {
  name: string;
  property_type: string;
  location: string;
  budget: string;
  message: string;
  lead_score: number;
  close_probability: number;
}): Promise<{
  summary: string;
  buyer_intent: string;
  objections: string;
  suggested_questions: string;
}> {
  const prompt = `You are a senior real estate consultant preparing for a client consultation. Generate a comprehensive meeting brief for the following lead.

Lead Profile:
- Name: ${lead.name}
- Property Interest: ${lead.property_type} in ${lead.location}
- Budget: ${lead.budget}
- Lead Score: ${lead.lead_score}/10
- Close Probability: ${lead.close_probability}%
- Their Message: "${lead.message}"

Generate a meeting preparation brief. Return ONLY valid JSON:
{
  "summary": "<2-3 sentence client overview and situation>",
  "buyer_intent": "<detailed analysis of their buying intent and motivation>",
  "objections": "<likely objections or concerns to address, comma-separated>",
  "suggested_questions": "<5 key questions to ask during the meeting, newline-separated>"
}`;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are an expert real estate consultant. Generate actionable meeting briefs. Respond with valid JSON only.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,
    max_tokens: 1000,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("No response from Groq");

  return JSON.parse(content);
}

export async function generateBookingEmail(lead: {
  name: string;
  property_type: string;
  location: string;
  budget: string;
  booking_url: string;
}): Promise<{ subject: string; body: string }> {
  const prompt = `Generate a personalized, professional real estate consultation booking email.

Client Details:
- Name: ${lead.name}
- Interested In: ${lead.property_type} in ${lead.location}
- Budget: ${lead.budget}
- Booking URL: ${lead.booking_url}

Create a warm, professional email that:
1. Acknowledges their specific inquiry
2. Highlights the value of the consultation
3. Creates urgency without being pushy
4. Includes a clear CTA to book

Return ONLY valid JSON:
{
  "subject": "<compelling email subject line>",
  "body": "<full professional email body in HTML format, include the booking URL as a button>"
}`;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a luxury real estate marketing expert. Write compelling, personalized emails. Respond with valid JSON only.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.4,
    max_tokens: 1500,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("No response from Groq");

  return JSON.parse(content);
}
