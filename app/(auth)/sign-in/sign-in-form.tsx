'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
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
        router.push('/');
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
    <div>
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
        />
        <Input
          type="password"
          placeholder="Password"
          value={values.password}
          onChange={(e) => setValues({ ...values, password: e.target.value })}
        />
        <Button disabled={status === 'loading'} type="submit">
          {status === 'loading' ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
      {status === 'error' ? <p className="text-red-500">{error}</p> : null}
    </div>
  );
}
