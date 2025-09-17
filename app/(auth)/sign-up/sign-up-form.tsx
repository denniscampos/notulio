'use client';

import { authClient } from '@/lib/auth-client';
import { useState } from 'react';

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
          console.log('User created: ', ctx.data);
        },
        onError: async (ctx) => {
          setStatus('error');
          setError(ctx.error.message);
        },
      }
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          name="firstName"
          type="firstName"
          placeholder="First Name"
          value={values.firstName}
          onChange={(e) => setValues({ ...values, firstName: e.target.value })}
        />
        <input
          name="lastName"
          type="lastName"
          placeholder="Last Name"
          value={values.lastName}
          onChange={(e) => setValues({ ...values, lastName: e.target.value })}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={values.password}
          onChange={(e) => setValues({ ...values, password: e.target.value })}
        />
        <button disabled={status === 'loading'} type="submit">
          {status === 'loading' ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      {status === 'error' ? <p className="text-red-500">{error}</p> : null}
    </div>
  );
}
