export function bookingEmailTemplate(params: {
  name: string;
  propertyType: string;
  location: string;
  bookingUrl: string;
  emailBody?: string;
}): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Property Consultation is Ready</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="padding:0 0 32px 0;text-align:center;">
              <div style="display:inline-block;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:100px;padding:8px 20px;">
                <span style="color:#F59E0B;font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;">Premium Real Estate</span>
              </div>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background:#111111;border:1px solid rgba(255,255,255,0.08);border-radius:24px;padding:48px 48px 40px;">
              <h1 style="color:#ffffff;font-size:28px;font-weight:700;margin:0 0 8px;letter-spacing:-0.02em;">
                Your consultation is ready, ${params.name}.
              </h1>
              <p style="color:rgba(255,255,255,0.5);font-size:15px;line-height:1.6;margin:0 0 32px;">
                We've reviewed your inquiry for ${params.propertyType} in ${params.location} and would love to connect with you personally.
              </p>

              <!-- Divider -->
              <div style="height:1px;background:rgba(255,255,255,0.08);margin:0 0 32px;"></div>

              ${params.emailBody || `
              <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.7;margin:0 0 24px;">
                Our expert agent has analyzed your property requirements and prepared a personalized consultation to help you find the perfect ${params.propertyType} in ${params.location}.
              </p>
              <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.7;margin:0 0 32px;">
                In this 30-minute session, we'll discuss your specific requirements, current market conditions, and available properties that match your criteria.
              </p>
              `}

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:0 0 32px;">
                    <a href="${params.bookingUrl}" style="display:inline-block;background:#F59E0B;color:#000000;font-size:15px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:100px;letter-spacing:0.01em;">
                      Book Your Consultation →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Features -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:24px;">
                <tr>
                  <td style="padding:0 16px 16px 0;width:33%;">
                    <div style="color:#F59E0B;font-size:20px;margin-bottom:6px;">⏱</div>
                    <div style="color:#ffffff;font-size:13px;font-weight:600;margin-bottom:4px;">30 Minutes</div>
                    <div style="color:rgba(255,255,255,0.4);font-size:12px;">Focused consultation</div>
                  </td>
                  <td style="padding:0 16px 16px 0;width:33%;">
                    <div style="color:#F59E0B;font-size:20px;margin-bottom:6px;">🏡</div>
                    <div style="color:#ffffff;font-size:13px;font-weight:600;margin-bottom:4px;">Expert Guidance</div>
                    <div style="color:rgba(255,255,255,0.4);font-size:12px;">Personalized advice</div>
                  </td>
                  <td style="padding:0 0 16px 0;width:33%;">
                    <div style="color:#F59E0B;font-size:20px;margin-bottom:6px;">📹</div>
                    <div style="color:#ffffff;font-size:13px;font-weight:600;margin-bottom:4px;">Video Call</div>
                    <div style="color:rgba(255,255,255,0.4);font-size:12px;">Google Meet included</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0;text-align:center;">
              <p style="color:rgba(255,255,255,0.25);font-size:12px;margin:0;">
                © 2025 Premium Real Estate. All rights reserved.<br>
                This email was sent because you submitted an inquiry on our website.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function confirmationEmailTemplate(params: {
  name: string;
  appointmentDate: string;
  meetingLink: string;
  propertyType: string;
  location: string;
}): string {
  const date = new Date(params.appointmentDate);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Consultation Confirmed</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Success Badge -->
          <tr>
            <td style="padding:0 0 32px 0;text-align:center;">
              <div style="display:inline-block;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:100px;padding:8px 20px;">
                <span style="color:#F59E0B;font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;">✓ Confirmed</span>
              </div>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background:#111111;border:1px solid rgba(255,255,255,0.08);border-radius:24px;padding:48px;">
              <h1 style="color:#ffffff;font-size:28px;font-weight:700;margin:0 0 8px;letter-spacing:-0.02em;">
                You're confirmed, ${params.name}.
              </h1>
              <p style="color:rgba(255,255,255,0.5);font-size:15px;line-height:1.6;margin:0 0 32px;">
                Your property consultation has been scheduled. Here are your meeting details.
              </p>

              <!-- Meeting Details -->
              <div style="background:rgba(245,158,11,0.05);border:1px solid rgba(245,158,11,0.15);border-radius:16px;padding:24px;margin:0 0 32px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:0 0 16px;">
                      <div style="color:rgba(255,255,255,0.4);font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px;">Date</div>
                      <div style="color:#ffffff;font-size:16px;font-weight:600;">${formattedDate}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 0 16px;">
                      <div style="color:rgba(255,255,255,0.4);font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px;">Time</div>
                      <div style="color:#ffffff;font-size:16px;font-weight:600;">${formattedTime}</div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div style="color:rgba(255,255,255,0.4);font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px;">Topic</div>
                      <div style="color:#ffffff;font-size:16px;font-weight:600;">${params.propertyType} in ${params.location}</div>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Join Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:0 0 24px;">
                    <a href="${params.meetingLink}" style="display:inline-block;background:#F59E0B;color:#000000;font-size:15px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:100px;">
                      Join Google Meet →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color:rgba(255,255,255,0.4);font-size:13px;text-align:center;margin:0;">
                A calendar invitation has been sent to your email. You'll receive a reminder 24 hours before your meeting.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0;text-align:center;">
              <p style="color:rgba(255,255,255,0.25);font-size:12px;margin:0;">
                © 2025 Premium Real Estate. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function agentNotificationTemplate(params: {
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  leadScore: number;
  propertyType: string;
  location: string;
  budget: string;
  appointmentDate: string;
  meetingLink: string;
  closeProbability: number;
  dashboardUrl: string;
}): string {
  const date = new Date(params.appointmentDate);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const scoreColor =
    params.leadScore >= 8
      ? "#F59E0B"
      : params.leadScore >= 5
        ? "#FFB800"
        : "#FF4444";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Consultation Booked</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="padding:0 0 24px 0;text-align:center;">
              <div style="display:inline-block;background:rgba(255,100,0,0.1);border:1px solid rgba(255,100,0,0.3);border-radius:100px;padding:8px 20px;">
                <span style="color:#FF6400;font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;">🔥 HOT LEAD — Action Required</span>
              </div>
            </td>
          </tr>

          <tr>
            <td style="background:#111111;border:1px solid rgba(255,255,255,0.08);border-radius:24px;padding:48px;">
              <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0 0 4px;letter-spacing:-0.02em;">
                New Consultation Booked
              </h1>
              <p style="color:rgba(255,255,255,0.4);font-size:14px;margin:0 0 32px;">
                ${formattedDate} at ${formattedTime}
              </p>

              <!-- Lead Score -->
              <div style="display:flex;align-items:center;margin:0 0 24px;">
                <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px 24px;width:100%;">
                  <div style="color:rgba(255,255,255,0.4);font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Lead Score</div>
                  <div style="color:${scoreColor};font-size:36px;font-weight:800;">${params.leadScore}/10</div>
                  <div style="color:rgba(255,255,255,0.4);font-size:13px;margin-top:4px;">Close probability: ${params.closeProbability}%</div>
                </div>
              </div>

              <!-- Lead Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:24px;margin:0 0 24px;">
                <tr>
                  <td style="padding:0 0 12px;color:rgba(255,255,255,0.4);font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;" colspan="2">
                    CLIENT INFORMATION
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 8px;color:rgba(255,255,255,0.5);font-size:13px;width:40%;">Name</td>
                  <td style="padding:0 0 8px;color:#ffffff;font-size:13px;font-weight:600;">${params.leadName}</td>
                </tr>
                <tr>
                  <td style="padding:0 0 8px;color:rgba(255,255,255,0.5);font-size:13px;">Email</td>
                  <td style="padding:0 0 8px;color:#ffffff;font-size:13px;font-weight:600;">${params.leadEmail}</td>
                </tr>
                <tr>
                  <td style="padding:0 0 8px;color:rgba(255,255,255,0.5);font-size:13px;">Phone</td>
                  <td style="padding:0 0 8px;color:#ffffff;font-size:13px;font-weight:600;">${params.leadPhone}</td>
                </tr>
                <tr>
                  <td style="padding:0 0 8px;color:rgba(255,255,255,0.5);font-size:13px;">Property</td>
                  <td style="padding:0 0 8px;color:#ffffff;font-size:13px;font-weight:600;">${params.propertyType} in ${params.location}</td>
                </tr>
                <tr>
                  <td style="color:rgba(255,255,255,0.5);font-size:13px;">Budget</td>
                  <td style="color:#ffffff;font-size:13px;font-weight:600;">${params.budget}</td>
                </tr>
              </table>

              <!-- Action Buttons -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:0 8px 0 0;" width="50%">
                    <a href="${params.meetingLink}" style="display:block;background:#F59E0B;color:#000000;font-size:14px;font-weight:700;text-decoration:none;padding:14px 20px;border-radius:12px;text-align:center;">
                      Join Meeting →
                    </a>
                  </td>
                  <td align="center" style="padding:0 0 0 8px;" width="50%">
                    <a href="${params.dashboardUrl}" style="display:block;background:rgba(255,255,255,0.08);color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:14px 20px;border-radius:12px;text-align:center;border:1px solid rgba(255,255,255,0.12);">
                      View Dashboard
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function reminderEmailTemplate(params: {
  name: string;
  propertyType: string;
  location: string;
  bookingUrl: string;
  reminderNumber: number;
}): string {
  const messages = [
    {
      subject: "Still interested? Your consultation slot is waiting",
      headline: "We saved your spot.",
      body: "It's been 24 hours since your inquiry. Your personalized consultation is still available — slots are filling up fast.",
    },
    {
      subject: "Final reminder — Your consultation expires soon",
      headline: "Last chance to book.",
      body: "This is your final reminder. We want to make sure you don't miss the opportunity to find your perfect property. Your dedicated consultation slot is about to expire.",
    },
  ];

  const msg = messages[params.reminderNumber - 1] || messages[0];

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${msg.subject}</title></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="background:#111111;border:1px solid rgba(255,255,255,0.08);border-radius:24px;padding:48px;">
              <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0 0 12px;">${msg.headline}</h1>
              <p style="color:rgba(255,255,255,0.5);font-size:15px;line-height:1.6;margin:0 0 32px;">${msg.body}</p>
              <p style="color:rgba(255,255,255,0.5);font-size:15px;line-height:1.6;margin:0 0 32px;">
                You inquired about <strong style="color:#ffffff;">${params.propertyType} in ${params.location}</strong>. We have experts ready to help you navigate the market.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${params.bookingUrl}" style="display:inline-block;background:#F59E0B;color:#000000;font-size:15px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:100px;">
                      Book Now — It's Free →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
