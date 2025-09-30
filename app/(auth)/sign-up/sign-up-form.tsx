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
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { GoogleProvider } from '../google-provider';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function SignUpForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    await authClient.signUp.email(
      {
        email: values.email as string,
        password: values.password as string,
        name: `${values.firstName} ${values.lastName}`,
      },
      {
        onSuccess: async (ctx) => {
          setStatus('success');
          router.push(`/check-email?email=${encodeURIComponent(values.email)}`);
          router.refresh();
          toast.success(
            'Account created! Please check your email to verify your account.'
          );
        },
        onError: async (ctx) => {
          setStatus('error');
          setError(ctx.error.message);
          toast.error(ctx.error.message ?? 'Something went wrong.');
          return;
        },
      }
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>
          Sign up to get started with your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Input
                name="firstName"
                type="text"
                placeholder="First Name"
                value={values.firstName}
                onChange={(e) =>
                  setValues({ ...values, firstName: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                name="lastName"
                type="text"
                placeholder="Last Name"
                value={values.lastName}
                onChange={(e) =>
                  setValues({ ...values, lastName: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={values.password}
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
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
                Signing up...
              </>
            ) : (
              'Sign Up'
            )}
          </Button>
          <GoogleProvider />
        </form>
        <div className="text-center mt-4">
          <span className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/sign-in"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
