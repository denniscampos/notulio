'use client';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function SignOut() {
  const [status, setStatus] = useState<Status>();
  const router = useRouter();
  const handleSignOut = async () => {
    setStatus('loading');
    const res = await authClient.signOut();
    if (res.error) {
      const errorMessage = res.error.message;
      setStatus('error');
      console.error(errorMessage);
      return;
    }
    setStatus('success');
    router.push('/sign-in');
    router.refresh();
  };
  return (
    <button disabled={status === 'loading'} onClick={handleSignOut}>
      {status === 'loading' ? 'Logging out' : 'Log out'}
    </button>
  );
}
