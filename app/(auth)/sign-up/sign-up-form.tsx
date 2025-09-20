'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

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
          router.push('/');
          router.refresh();
          toast.success('Successfully signed up');
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
    <div>
      <form onSubmit={handleSubmit}>
        <Input
          name="firstName"
          type="firstName"
          placeholder="First Name"
          value={values.firstName}
          onChange={(e) => setValues({ ...values, firstName: e.target.value })}
        />
        <Input
          name="lastName"
          type="lastName"
          placeholder="Last Name"
          value={values.lastName}
          onChange={(e) => setValues({ ...values, lastName: e.target.value })}
        />
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          value={values.password}
          onChange={(e) => setValues({ ...values, password: e.target.value })}
        />
        <Button disabled={status === 'loading'} type="submit">
          {status === 'loading' ? 'Signing up...' : 'Sign Up'}
        </Button>
      </form>
      {status === 'error' ? <p className="sr-only">{error}</p> : null}
    </div>
  );
}
