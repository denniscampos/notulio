import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ConvexClientProvider } from '@/providers/convex-client-provider';
import { Header } from '@/components/header';
import { Toaster } from '@/components/ui/sonner';
import Script from 'next/script';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Notulio - AI-Powered Article Learning Platform',
    template: '%s | Notulio',
  },
  description:
    'Save any web article with a URL. Get AI summaries, flashcards, and organized tags automatically. Transform your reading into active learning with Notulio.',
  keywords: [
    'article management',
    'AI summaries',
    'flashcards',
    'learning platform',
    'web scraping',
    'study tools',
    'OpenAI',
    'knowledge management',
  ],
  authors: [{ name: 'Notulio Team' }],
  creator: 'Notulio',
  publisher: 'Notulio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://notulio.com'
  ),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Notulio - AI-Powered Article Learning Platform',
    description:
      'Save any web article with a URL. Get AI summaries, flashcards, and organized tags automatically.',
    url: '/',
    siteName: 'Notulio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Notulio - Transform your reading into active learning',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Notulio - AI-Powered Article Learning Platform',
    description:
      'Save any web article with a URL. Get AI summaries, flashcards, and organized tags automatically.',
    images: ['/opengraph-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexClientProvider>
          {children}
          <Toaster />
        </ConvexClientProvider>
        <Script
          defer
          src="https://umami.epicvibes.xyz/script.js"
          data-website-id="efec5a9c-e57c-4a91-8342-be353051c74c"
        />
      </body>
    </html>
  );
}
