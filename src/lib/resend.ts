import { Resend } from 'resend';

// Retrieve Resend API key from standard or alternative environment variable names
const rawApiKey = (process.env.RESEND_API_KEY || process.env.resend_API_key || '').trim();

// Check if API key is present and is not a placeholder
const isApiKeyConfigured = Boolean(
  rawApiKey &&
  rawApiKey !== 're_placeholder_waiting_for_user_key' &&
  rawApiKey.length > 5
);

// Lazy/Safe initialization of Resend instance
export const resend = isApiKeyConfigured ? new Resend(rawApiKey) : null;

// Default email sender configuration
export const DEFAULT_FROM_EMAIL = process.env.EMAIL_FROM || 'InfinityGram Support <onboarding@resend.dev>';

/**
 * Interface for email verification payload
 */
export interface SendVerificationParams {
  email: string;
  name: string;
  token: string;
}

/**
 * Generates branded HTML template for email verification
 */
export function getVerificationEmailHtml(name: string, verificationUrl: string): string {
  const recipientName = name ? name.split(' ')[0] : 'Valued Member';
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - InfinityGram</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #0b0f17;
          color: #e2e8f0;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .wrapper {
          width: 100%;
          table-layout: fixed;
          background-color: #0b0f17;
          padding: 40px 0;
        }
        .container {
          max-width: 560px;
          margin: 0 auto;
          background-color: #161e2e;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3);
          border: 1px solid #2d3748;
        }
        .header {
          background: linear-gradient(135deg, #d97706 0%, #b45309 50%, #78350f 100%);
          padding: 32px 24px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.5px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .header p {
          color: #fef3c7;
          margin: 6px 0 0 0;
          font-size: 14px;
          font-weight: 500;
        }
        .content {
          padding: 36px 32px;
        }
        .greeting {
          font-size: 18px;
          font-weight: 600;
          color: #f8fafc;
          margin-bottom: 16px;
        }
        .text {
          font-size: 15px;
          line-height: 1.6;
          color: #cbd5e1;
          margin-bottom: 24px;
        }
        .button-wrapper {
          text-align: center;
          margin: 32px 0;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #ffffff !important;
          text-decoration: none;
          font-weight: 700;
          font-size: 16px;
          padding: 14px 36px;
          border-radius: 10px;
          box-shadow: 0 4px 14px 0 rgba(217, 119, 6, 0.4);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .alt-link {
          background-color: #0f172a;
          border-radius: 8px;
          padding: 14px;
          font-size: 12px;
          word-break: break-all;
          color: #94a3b8;
          border: 1px solid #1e293b;
          margin-top: 24px;
        }
        .footer {
          background-color: #0f172a;
          padding: 24px 32px;
          text-align: center;
          border-top: 1px solid #1e293b;
          font-size: 12px;
          color: #64748b;
        }
        .footer a {
          color: #d97706;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <h1>InfinityGram Gold Scheme</h1>
            <p>Email Verification Request</p>
          </div>
          <div class="content">
            <div class="greeting">Hello ${recipientName},</div>
            <p class="text">
              Thank you for registering with InfinityGram Gold Scheme. To secure your account and access your member dashboard, please verify your email address by clicking the button below.
            </p>
            <div class="button-wrapper">
              <a href="${verificationUrl}" class="button" target="_blank">Verify Email Address</a>
            </div>
            <p class="text" style="font-size: 13px; color: #94a3b8;">
              ⏱️ This link will expire in <strong>30 minutes</strong> for security reasons. If you did not request this email, please ignore it.
            </p>
            <div class="alt-link">
              <strong>Having trouble with the button?</strong> Copy and paste this URL into your browser:<br/>
              <span style="color: #fbbf24;">${verificationUrl}</span>
            </div>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} InfinityGram Gold Scheme. All rights reserved.<br/>
            Need help? Contact support at <a href="mailto:infinitygram916@gmail.com">infinitygram916@gmail.com</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Sends email verification message safely via Resend
 */
export async function sendVerificationEmail({ email, name, token }: SendVerificationParams) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

  // Graceful mode: If API Key is missing or placeholder, log notice and return successful mock status
  if (!resend || !isApiKeyConfigured) {
    console.log(`[Resend API] Graceful Credentials Notice: Skipping live email dispatch for ${email}. Key missing or unconfigured.`);
    console.log(`[Resend API] Verification Link generated for testing: ${verificationUrl}`);
    return {
      success: true,
      mocked: true,
      message: 'Graceful Mode: Email simulated safely (RESEND_API_KEY is missing or placeholder).',
      verificationUrl,
    };
  }

  try {
    const html = getVerificationEmailHtml(name, verificationUrl);
    
    // Attempt sending via Resend API
    const response = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [email],
      subject: 'Verify Your Email Address - InfinityGram Gold Scheme',
      html,
    });

    if (response.error) {
      console.log('\n=============================================================');
      console.warn('⚠️ [RESEND EMAIL DISPATCH NOTICE]');
      console.log('Target Email:', email);
      console.log('Resend Error:', response.error.message);
      
      // Handle Resend Free Tier / Sandbox restriction (only allows sending to account owner e.g. infinitygram916@gmail.com)
      if (response.error.message?.toLowerCase().includes('testing emails') || response.error.message?.includes('verify a domain')) {
        console.log('ℹ️ Resend Sandbox Mode Active: Attempting fallback to account owner (infinitygram916@gmail.com)...');
        
        try {
          const fallbackRes = await resend.emails.send({
            from: DEFAULT_FROM_EMAIL,
            to: ['infinitygram916@gmail.com'],
            subject: `[Sandbox Test for ${email}] Verify Email - InfinityGram Gold Scheme`,
            html: getVerificationEmailHtml(name, verificationUrl),
          });

          if (!fallbackRes.error) {
            console.log('✅ [FALLBACK EMAIL DISPATCH SUCCESSFUL]');
            console.log('Delivered To:', 'infinitygram916@gmail.com');
            console.log('Resend Message ID:', fallbackRes.data?.id);
            console.log('Direct Verification Link:', verificationUrl);
            console.log('=============================================================\n');
            return {
              success: true,
              sandboxFallback: true,
              message: `Resend Sandbox Mode: Email delivered to registered admin inbox (infinitygram916@gmail.com). Verify custom domain in Resend to send directly to ${email}.`,
              verificationUrl,
            };
          }
        } catch (fallbackErr) {
          console.warn('[Resend API] Fallback exception:', fallbackErr);
        }
      }
      console.log('=============================================================\n');

      return {
        success: false,
        error: response.error.message || 'Failed to dispatch email via Resend API',
        verificationUrl,
      };
    }

    console.log('\n=============================================================');
    console.log('✅ [RESEND EMAIL DISPATCH SUCCESSFUL]');
    console.log('Recipient:', email);
    console.log('Resend Message ID:', response.data?.id);
    console.log('Direct Verification Link:', verificationUrl);
    console.log('=============================================================\n');

    return {
      success: true,
      data: response.data,
      verificationUrl,
    };
  } catch (err: any) {
    console.error('\n=============================================================');
    console.error('❌ [RESEND EMAIL DISPATCH EXCEPTION]:', err?.message || err);
    console.log('Verification URL generated for testing:', verificationUrl);
    console.error('=============================================================\n');
    return {
      success: false,
      error: err?.message || 'Server error while delivering email',
      verificationUrl,
    };
  }
}
