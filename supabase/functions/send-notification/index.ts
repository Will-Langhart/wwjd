import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
    const { type, to, data }: EmailRequest = await req.json();

    let subject = "";
    let html = "";

    switch (type) {
      case 'welcome':
        subject = "Welcome to WWJD!";
        html = `
          <h1>Welcome to WWJD, ${data.name || 'Friend'}!</h1>
          <p>Thank you for creating an account with us. We're excited to have you on board!</p>
          <p>Start exploring our collection of faith-inspired products and find what speaks to your heart.</p>
          <p>Best regards,<br>The WWJD Team</p>
        `;
        break;

      case 'order':
        subject = `Order Confirmation - #${data.orderNumber}`;
        html = `
          <h1>Thank you for your order!</h1>
          <p>We've received your order #${data.orderNumber}.</p>
          <p>Total: ${data.totalAmount}</p>
          <p>We'll send you another email once your order ships.</p>
          <p>Best regards,<br>The WWJD Team</p>
        `;
        break;

      case 'wishlist':
        subject = "Item Added to Your Wishlist";
        html = `
          <h1>Wishlist Updated!</h1>
          <p>You've added "${data.productTitle}" to your wishlist.</p>
          <p>Don't forget to check back - your saved items are waiting for you!</p>
          <p>Best regards,<br>The WWJD Team</p>
        `;
        break;

      default:
        throw new Error('Invalid email type');
    }

    const emailResponse = await sendEmail(to, subject, html);
    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
