'use client';
import { authClient } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from './ui/button';
import { toast } from 'sonner';

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
      toast.error(errorMessage ?? 'Something went wrong');
      return;
    }
    setStatus('success');
    toast.success('Successfully signed out');
    router.push('/sign-in');
    router.refresh();
  };
  return (
    <Button
      variant="neutral"
      disabled={status === 'loading'}
      onClick={handleSignOut}
    >
      {status === 'loading' ? <Loader2 className="animate-spin" /> : 'Log out'}
    </Button>
  );
}
