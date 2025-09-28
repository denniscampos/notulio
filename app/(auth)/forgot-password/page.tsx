import { getToken } from '@/lib/auth-server';
import ForgotPasswordForm from './forgot-password-form';
import { redirect } from 'next/navigation';

export default async function ForgotPasswordPage() {
  const token = await getToken();
  if (token) {
    redirect('/articles');
  }
  return <ForgotPasswordForm />;
}
