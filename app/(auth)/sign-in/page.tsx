import { getToken } from '@/lib/auth-server';
import { SignInForm } from './sign-in-form';
import { redirect } from 'next/navigation';

export default async function SignInPage() {
  const token = await getToken();
  if (token) {
    redirect('/articles');
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <SignInForm />
    </div>
  );
}
