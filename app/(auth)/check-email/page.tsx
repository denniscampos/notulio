import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { ResendVerificationButton } from '@/components/resend-verification-button';

interface CheckEmailPageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function CheckEmailPage({
  searchParams,
}: CheckEmailPageProps) {
  const { email } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-secondary-background rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
          <CardDescription>
            We've sent you a verification link to complete your account setup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Please check your email inbox and click the verification link to
              activate your account.
            </p>
            {email && (
              <p className="text-sm font-medium text-foreground">
                Email sent to: {email}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              The verification link will expire in 10 minutes for security
              reasons.
            </p>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Didn't receive the email? Check your spam folder or
            </p>
            {email ? (
              <ResendVerificationButton email={email} />
            ) : (
              <Button variant="neutral" className="w-full" disabled>
                Resend Verification Email
              </Button>
            )}
          </div>

          <div className="text-center">
            <Link
              href="/sign-in"
              className="text-sm text-primary hover:underline"
            >
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
