import { redirect } from 'next/navigation';
import { SignUpForm } from './sign-up-form';
import { getToken } from '@/lib/auth-server';

export default async function SignUpPage() {
  const token = await getToken();
  if (token) {
    redirect('/articles');
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <SignUpForm />
    </div>
  );
}
