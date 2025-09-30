'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ResendVerificationButtonProps {
  email: string;
}

export function ResendVerificationButton({
  email,
}: ResendVerificationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await authClient.sendVerificationEmail({
        email,
        callbackURL: `${process.env.NEXT_PUBLIC_SITE_URL}/email-verified`,
      });
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error) {
      toast.error('Failed to resend verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="neutral"
      className="w-full"
      onClick={handleResend}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
          Sending...
        </>
      ) : (
        'Resend Verification Email'
      )}
    </Button>
  );
}
