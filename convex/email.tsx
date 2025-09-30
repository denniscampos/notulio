import { render } from '@react-email/render';
import { components } from './_generated/api';
import { Resend } from '@convex-dev/resend';
import { ForgotPasswordTemplate } from '@/components/emails/forgot-password';
import { RunActionCtx } from '@convex-dev/better-auth';
import { EmailVerificationTemplate } from '@/components/emails/email-verification';

export const resend: Resend = new Resend(components.resend, {
  testMode: false,
});

export async function sendResetPassword(
  ctx: RunActionCtx,
  {
    firstName,
    email,
    resetUrl,
  }: { firstName: string; email: string; resetUrl: string }
) {
  const html = await render(
    <ForgotPasswordTemplate firstName={firstName} resetUrl={resetUrl} />
  );

  await resend.sendEmail(ctx, {
    from: 'Notulio <admin@notifications.notulio.com>',
    to: email,
    subject: 'Reset your password',
    html,
  });
}

export async function sendEmailVerification(
  ctx: RunActionCtx,
  { to, url, firstName }: { to: string; url: string; firstName?: string }
) {
  const urlWithCallback = new URL(url);
  const siteUrl = process.env.SITE_URL;
  urlWithCallback.searchParams.set('callbackURL', `${siteUrl}/email-verified`);

  await resend.sendEmail(ctx, {
    from: 'Notulio <admin@notifications.notulio.com>',
    to,
    subject: 'Verify your email address',
    html: await render(
      <EmailVerificationTemplate
        url={urlWithCallback.toString()}
        firstName={firstName}
      />
    ),
  });
}
