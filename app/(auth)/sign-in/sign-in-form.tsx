'use client';
import { authClient } from '@/lib/auth-client';
import { useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';
export function SignInForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    await authClient.signIn.email(values, {
      onSuccess: () => {
        setStatus('success');
      },
      onError: (ctx) => {
        setStatus('error');
        setError(ctx.error.message);
      },
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={values.password}
          onChange={(e) => setValues({ ...values, password: e.target.value })}
        />
        <button disabled={status === 'loading'} type="submit">
          {status === 'loading' ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      {status === 'error' ? <p className="text-red-500">{error}</p> : null}
    </div>
  );
}
