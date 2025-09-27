'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ResetPasswordPage() {
  const [status, setStatus] = useState<Status>('idle');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [values, setValues] = useState({
    password: '',
    confirmPassword: '',
  });
  const router = useRouter();

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    setStatus('loading');
    setStatus('error');

    if (values.password !== values.confirmPassword) {
      setStatus('error');
      toast.error('Passwords do not match');
      return;
    }

    await authClient.resetPassword(
      {
        token,
        newPassword: values.password,
      },
      {
        onRequest: () => {
          setStatus('loading');
        },
        onSuccess: () => {
          setStatus('success');
          toast.success('Password reset successfully.');
          router.push('/articles');
        },
        onError: (ctx) => {
          setStatus('error');
          toast.error(ctx.error.message ?? 'Something went wrong.');
        },
      }
    );
  };

  if (!token) {
    if (!token) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="space-y-2">
              <CardTitle className="text-lg md:text-xl">Invalid Link</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                This password reset link is invalid or has expired. Please
                request a new one.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <div className="flex justify-center w-full border-t py-4">
                <p className="text-center text-xs text-neutral-500">
                  Powered by{' '}
                  <a
                    href="https://better-auth.com"
                    className="underline"
                    target="_blank"
                  >
                    <span className="dark:text-orange-200/90">
                      better-auth.
                    </span>
                  </a>
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      );
    }
  }
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Reset Password</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your new password"
                required
                value={values.password}
                onChange={(e) =>
                  setValues({ ...values, password: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                required
                value={values.confirmPassword}
                onChange={(e) =>
                  setValues({ ...values, confirmPassword: e.target.value })
                }
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="flex justify-center w-full border-t py-4">
            <p className="text-center text-xs text-neutral-500">
              Powered by{' '}
              <a
                href="https://better-auth.com"
                className="underline"
                target="_blank"
              >
                <span className="dark:text-orange-200/90">better-auth.</span>
              </a>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
