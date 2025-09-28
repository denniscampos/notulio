import { Suspense } from 'react';
import { ResetPasswordForm } from './reset-password-form';
import { Loader2 } from 'lucide-react';

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const token = (await searchParams).token;
  return (
    <Suspense fallback={<Loader2 className="animate-spin" />}>
      <ResetPasswordForm token={token} />
    </Suspense>
  );
}
