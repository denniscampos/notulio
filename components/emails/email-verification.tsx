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

interface EmailVerificationTemplateProps {
  firstName?: string;
  verificationUrl: string;
}

export function EmailVerificationTemplate({
  firstName,
  verificationUrl,
}: EmailVerificationTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address to access Moniflux</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Heading style={h1}>💰 Moniflux</Heading>
          </Section>

          <Section style={content}>
            <Heading style={h2}>
              {firstName ? `Welcome ${firstName}! 🎉` : 'Welcome! 🎉'}
            </Heading>

            <Text style={paragraph}>
              Thank you for signing up for Moniflux! We&apos;re excited to help
              you take control of your finances.
            </Text>

            <Text style={paragraph}>
              To get started and access your dashboard, please verify your email
              address by clicking the button below:
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={verificationUrl}>
                Verify Email Address
              </Button>
            </Section>

            <Text style={paragraph}>
              If the button doesn&apos;t work, you can also copy and paste this
              link into your browser:
            </Text>

            <Text style={linkText}>{verificationUrl}</Text>

            <Text style={paragraph}>
              This verification link will expire in 10 minutes for security
              reasons.
            </Text>

            <Text style={paragraph}>
              If you didn&apos;t create this account, you can safely ignore this
              email.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              You&apos;re receiving this email because someone signed up for
              Moniflux with this email address. If this wasn&apos;t you, please
              ignore this email.
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
