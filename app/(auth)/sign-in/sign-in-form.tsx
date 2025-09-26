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

type Status = 'idle' | 'loading' | 'success' | 'error';
export function SignInForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    await authClient.signIn.email(values, {
      onSuccess: () => {
        setStatus('success');
        toast.success('Successfully signed in.');
        router.push('/articles');
        router.refresh();
      },
      onError: (ctx) => {
        setStatus('error');
        setError(ctx.error.message);
        toast.error(ctx.error.message ?? 'Something went wrong.');
        return;
      },
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={values.password}
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              required
            />
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Forgot Password?
              </Link>
            </div>
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
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
