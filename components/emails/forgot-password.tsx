import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface ForgotPasswordTemplateProps {
  firstName?: string;
  resetUrl: string;
}

export function ForgotPasswordTemplate({
  firstName,
  resetUrl,
}: ForgotPasswordTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your Notulio password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Heading style={h1}>📚 Notulio</Heading>
          </Section>

          <Section style={content}>
            <Heading style={h2}>
              {firstName ? `Hi ${firstName}!` : 'Password Reset'}
            </Heading>

            <Text style={paragraph}>
              We received a request to reset your password for your Notulio
              account. If you made this request, click the button below to
              create a new password.
            </Text>

            <Text style={paragraph}>
              If you didn&apos;t request a password reset, you can safely ignore
              this email. Your password will remain unchanged.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={resetUrl}>
                Reset Password
              </Button>
            </Section>

            <Text style={paragraph}>
              If the button doesn&apos;t work, you can also copy and paste this
              link into your browser:
            </Text>

            <Text style={linkText}>{resetUrl}</Text>

            <Text style={paragraph}>
              This password reset link will expire in 15 minutes for security
              reasons.
            </Text>

            <Text style={paragraph}>
              For your security, this link can only be used once. If you need
              another password reset link, please request a new one.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              You&apos;re receiving this email because someone requested a
              password reset for your Notulio account. If this wasn&apos;t you,
              please ignore this email.
            </Text>
            <Text style={footerText}>
              Need help? Reply to this email and we&apos;ll get back to you as
              soon as possible.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const logoContainer = {
  padding: '32px 20px',
  textAlign: 'center' as const,
};

const content = {
  padding: '0 20px',
};

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px',
};

const paragraph = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const linkText = {
  color: '#3b82f6',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 16px',
  wordBreak: 'break-all' as const,
  backgroundColor: '#f3f4f6',
  padding: '8px 12px',
  borderRadius: '4px',
  fontFamily: 'monospace',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const footer = {
  padding: '20px',
  backgroundColor: '#f9fafb',
  borderTop: '1px solid #e5e7eb',
  margin: '32px 0 0',
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 8px',
  textAlign: 'center' as const,
};
