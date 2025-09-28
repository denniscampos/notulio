'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ForgotPasswordForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      await authClient.forgetPassword({
        email: email,
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
      });
      setStatus('success');
      toast.success('Password reset email sent.');
    } catch (error) {
      console.error(error);
      setStatus('error');
      setError('Failed to send password reset email.');
      toast.error('Failed to send password reset email.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a password reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {status === 'error' && (
              <div className="text-sm text-red-500 text-center">{error}</div>
            )}
            <Button
              disabled={status === 'loading'}
              type="submit"
              className="w-full"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Sending reset email...
                </>
              ) : (
                'Send Reset Email'
              )}
            </Button>
            <div className="text-center">
              <Link
                href="/sign-in"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Back to sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
