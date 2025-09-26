import { Header } from '@/components/header';

export default function MainLayout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
