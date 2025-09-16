'use client';

import { authClient } from '@/lib/auth-client';
import { useState } from 'react';

export function SignUpForm() {
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await authClient.signUp.email(
      {
        email: values.email as string,
        password: values.password as string,
        name: `${values.firstName} ${values.lastName}`,
      },
      {
        onSuccess: async (ctx) => {
          console.log('User created: ', ctx.data);
        },
        onError: async (ctx) => {
          console.error('Some error: ', ctx.error.message);
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
