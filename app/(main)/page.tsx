import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getToken } from '@/lib/auth-server';

export default async function HomePage() {
  const token = await getToken();
  const isAuthed = !!token;

  return (
    <div className="h-screen bg-gradient-to-br from-background via-background to-main/10 flex flex-col">
      {/* Hero Section - Takes most of the viewport */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Logo/Brand */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-heading text-foreground tracking-tight">
              Notulio
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
              Save any web article with a URL. Get AI summaries, flashcards, and
              organized tags automatically.
            </p>
          </div>

          {/* Key Features - Compact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto py-8">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-main rounded-full mx-auto flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-main-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Web Scraping</h3>
              <p className="text-sm text-foreground/70">
                Extract content from any article URL
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-main rounded-full mx-auto flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-main-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">AI Summaries</h3>
              <p className="text-sm text-foreground/70">
                Get intelligent summaries powered by OpenAI
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-main rounded-full mx-auto flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-main-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Study Flashcards</h3>
              <p className="text-sm text-foreground/70">
                Auto-generated flashcards for active learning
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            {isAuthed ? (
              <Link href="/articles">
                <Button size="lg" className="text-lg px-8 py-6">
                  View Your Articles
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-up">
                  <Button size="lg" className="text-lg px-8 py-6">
                    Start Learning
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button
                    variant="neutral"
                    size="lg"
                    className="text-lg px-8 py-6"
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
