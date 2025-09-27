import { Header } from '@/components/header';
import { AutumnProvider } from 'autumn-js/react';

export default function MainLayout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  return (
    <div>
      <AutumnProvider>
        <Header />
        {children}
      </AutumnProvider>
    </div>
  );
}
