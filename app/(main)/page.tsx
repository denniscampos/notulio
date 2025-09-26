import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getToken } from '@/lib/auth-server';

export default async function HomePage() {
  const token = await getToken();
  const isAuthed = !!token;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-main/10">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-16 text-center min-h-[80vh]">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Logo/Brand */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-heading text-foreground tracking-tight">
              Notulio
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
              Your intelligent article management platform. Organize, discover,
              and manage your content with ease.
            </p>
          </div>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
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
                    Get Started Free
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

      {/* Features Section */}
      <section className="px-4 py-16 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading text-foreground mb-4">
            Why Choose Notulio?
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Powerful features designed to streamline your article management
            workflow
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-secondary-background border-2 border-border rounded-base p-8 shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all">
            <div className="w-12 h-12 bg-main rounded-base mb-6 flex items-center justify-center">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-heading text-foreground mb-4">
              Organize Content
            </h3>
            <p className="text-foreground/70">
              Keep your articles structured and easily accessible with powerful
              organization tools.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-secondary-background border-2 border-border rounded-base p-8 shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all">
            <div className="w-12 h-12 bg-main rounded-base mb-6 flex items-center justify-center">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-heading text-foreground mb-4">
              Smart Search
            </h3>
            <p className="text-foreground/70">
              Find exactly what you're looking for with advanced search and
              filtering capabilities.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-secondary-background border-2 border-border rounded-base p-8 shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all">
            <div className="w-12 h-12 bg-main rounded-base mb-6 flex items-center justify-center">
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-heading text-foreground mb-4">
              Lightning Fast
            </h3>
            <p className="text-foreground/70">
              Built for speed and efficiency. Access your content instantly,
              anywhere, anytime.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthed && (
        <section className="px-4 py-16 text-center bg-main/5 border-t-2 border-border">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-heading text-foreground">
              Ready to get started?
            </h2>
            <p className="text-lg text-foreground/70">
              Join thousands of users who trust Notulio for their content
              management needs.
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Your Journey
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
