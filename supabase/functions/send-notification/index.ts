import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schemas
const emailDataSchema = z.object({
  type: z.enum(['welcome', 'order', 'wishlist']),
  to: z.string().email().max(255),
  data: z.object({
    name: z.string().max(100).optional(),
    orderNumber: z.string().max(50).regex(/^[A-Z0-9-]+$/).optional(),
    productTitle: z.string().max(200).optional(),
    totalAmount: z.string().max(20).optional(),
  }),
});

interface EmailRequest {
  type: 'welcome' | 'order' | 'wishlist';
  to: string;
  data: {
    name?: string;
    orderNumber?: string;
    productTitle?: string;
    totalAmount?: string;
  };
}

// HTML escape function to prevent XSS
const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const sendEmail = async (to: string, subject: string, html: string) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "WWJD <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }

  return response.json();
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the request
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Parse and validate request body
    const requestBody = await req.json();
    const validationResult = emailDataSchema.safeParse(requestBody);
    
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: "Invalid request data", details: validationResult.error.errors }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { type, to, data }: EmailRequest = validationResult.data;

    // Verify user can only send emails to their own address
    if (to !== user.email) {
      return new Response(
        JSON.stringify({ error: "Can only send notifications to your own email" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    let subject = "";
    let html = "";

    switch (type) {
      case 'welcome':
        subject = "Welcome to WWJD!";
        html = `
          <h1>Welcome to WWJD, ${escapeHtml(data.name || 'Friend')}!</h1>
          <p>Thank you for creating an account with us. We're excited to have you on board!</p>
          <p>Start exploring our collection of faith-inspired products and find what speaks to your heart.</p>
          <p>Best regards,<br>The WWJD Team</p>
        `;
        break;

      case 'order':
        subject = `Order Confirmation - #${escapeHtml(data.orderNumber || '')}`;
        html = `
          <h1>Thank you for your order!</h1>
          <p>We've received your order #${escapeHtml(data.orderNumber || '')}.</p>
          <p>Total: ${escapeHtml(data.totalAmount || '')}</p>
          <p>We'll send you another email once your order ships.</p>
          <p>Best regards,<br>The WWJD Team</p>
        `;
        break;

      case 'wishlist':
        subject = "Item Added to Your Wishlist";
        html = `
          <h1>Wishlist Updated!</h1>
          <p>You've added "${escapeHtml(data.productTitle || '')}" to your wishlist.</p>
          <p>Don't forget to check back - your saved items are waiting for you!</p>
          <p>Best regards,<br>The WWJD Team</p>
        `;
        break;

      default:
        throw new Error('Invalid email type');
    }

    const emailResponse = await sendEmail(to, subject, html);
    console.log("Email notification sent", { type, timestamp: new Date().toISOString() });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Email notification error", { timestamp: new Date().toISOString() });
    return new Response(
      JSON.stringify({ error: "Failed to send notification" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
