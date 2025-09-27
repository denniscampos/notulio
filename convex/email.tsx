import { type ActionCtx } from './_generated/server';
import { render, pretty } from '@react-email/render';
import { components } from './_generated/api';
import { Resend } from '@convex-dev/resend';
import { ForgotPasswordTemplate } from '@/components/emails/forgot-password';
import { RunActionCtx } from '@convex-dev/better-auth';

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
