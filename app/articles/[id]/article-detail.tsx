'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ExternalLink,
  User,
  Calendar,
  ArrowLeft,
  FileText,
  Brain,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import Link from 'next/link';
import { Preloaded, useConvexAuth, usePreloadedQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

// Colorful badge variants for tags
const tagColors = [
  'bg-red-100 text-red-800 border-red-200',
  'bg-orange-100 text-orange-800 border-orange-200',
  'bg-amber-100 text-amber-800 border-amber-200',
  'bg-yellow-100 text-yellow-800 border-yellow-200',
  'bg-lime-100 text-lime-800 border-lime-200',
  'bg-green-100 text-green-800 border-green-200',
  'bg-emerald-100 text-emerald-800 border-emerald-200',
  'bg-teal-100 text-teal-800 border-teal-200',
  'bg-cyan-100 text-cyan-800 border-cyan-200',
  'bg-sky-100 text-sky-800 border-sky-200',
  'bg-blue-100 text-blue-800 border-blue-200',
  'bg-indigo-100 text-indigo-800 border-indigo-200',
  'bg-violet-100 text-violet-800 border-violet-200',
  'bg-purple-100 text-purple-800 border-purple-200',
  'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
  'bg-pink-100 text-pink-800 border-pink-200',
  'bg-rose-100 text-rose-800 border-rose-200',
];

// Generate consistent color for a tag based on its content
function getTagColor(tag: string): string {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return tagColors[Math.abs(hash) % tagColors.length];
}

interface ArticleDetailProps {
  preloadedArticle: Preloaded<typeof api.articles.getArticleById>;
}

export function ArticleDetail({ preloadedArticle }: ArticleDetailProps) {
  const [showAllFlashcards, setShowAllFlashcards] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  const { isLoading } = useConvexAuth();

  let articleQuery;
  let error: Error | null = null;
  try {
    articleQuery = usePreloadedQuery(preloadedArticle);
  } catch (e) {
    error = e as Error;
  }

  const toggleFlashcard = (index: number) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const visibleFlashcards = showAllFlashcards
    ? articleQuery?.flashcards
    : articleQuery?.flashcards?.slice(0, 3);

  // Show loading during auth or when article is undefined (auth loading)
  if (isLoading || articleQuery === undefined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="animate-spin w-8 h-8 border-2 border-border border-t-foreground rounded-full mb-4"></div>
        <p className="text-foreground/60">Loading article...</p>
      </div>
    );
  }

  // Show error for actual authorization or not found errors
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-2xl font-heading mb-4">Unable to load article</h2>
        <p className="text-foreground/60 mb-6">
          {error.message || 'There was an error loading this article.'}
        </p>
        <Link href="/articles">
          <Button variant="neutral">
            <ArrowLeft className="size-4" />
            Back to Articles
          </Button>
        </Link>
      </div>
    );
  }

  // Type guard: if we reach here, articleQuery should be valid
  if (!articleQuery) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-2xl font-heading mb-4">Article not found</h2>
        <p className="text-foreground/60 mb-6">
          The article could not be loaded.
        </p>
        <Link href="/articles">
          <Button variant="neutral">
            <ArrowLeft className="size-4" />
            Back to Articles
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Navigation */}
      <div className="flex items-center gap-4">
        <Link href="/articles">
          <Button variant="neutral" size="sm">
            <ArrowLeft className="size-4" />
            Back to Articles
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <Card className="bg-white">
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <CardTitle className="text-3xl leading-tight">
                {articleQuery.title}
              </CardTitle>
              <a
                href={articleQuery.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 p-2 hover:bg-secondary-background rounded-base transition-colors"
                title="Open original article"
              >
                <ExternalLink className="size-5" />
              </a>
            </div>

            {articleQuery.description && (
              <CardDescription className="text-base leading-relaxed">
                {articleQuery.description}
              </CardDescription>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-foreground/60">
            {articleQuery.author && (
              <div className="flex items-center gap-2">
                <User className="size-4" />
                <span>{articleQuery.author}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="size-4" />
              <span>
                {new Date(articleQuery._creationTime ?? '').toLocaleDateString(
                  'en-US',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4" />
              <span>
                ~{Math.ceil((articleQuery.body?.split(' ').length || 0) / 200)}{' '}
                min read
              </span>
            </div>
          </div>

          {/* Tags */}
          {articleQuery.tags && articleQuery.tags.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="size-4" />
                <h3 className="font-medium">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {articleQuery.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center justify-center rounded-base border-2 px-3 py-1 text-sm font-base w-fit whitespace-nowrap shrink-0 ${getTagColor(
                      tag
                    )}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Summary */}
      {articleQuery.aiSummary && (
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="size-5" />
              <CardTitle className="text-xl">AI Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/80 leading-relaxed">
              {articleQuery.aiSummary}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Flashcards */}
      {articleQuery.flashcards && articleQuery.flashcards.length > 0 && (
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="size-5" />
                <CardTitle className="text-xl">
                  Flashcards ({articleQuery.flashcards.length})
                </CardTitle>
              </div>
              {articleQuery.flashcards.length > 3 && (
                <Button
                  variant="neutral"
                  size="sm"
                  onClick={() => setShowAllFlashcards(!showAllFlashcards)}
                >
                  {showAllFlashcards ? (
                    <>
                      <ChevronUp className="size-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="size-4" />
                      Show All ({articleQuery.flashcards.length})
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {visibleFlashcards?.map((flashcard, index) => (
                <Card
                  key={index}
                  className="cursor-pointer transition-all hover:shadow-lg"
                  onClick={() => toggleFlashcard(index)}
                >
                  <CardContent className="p-4">
                    <div className="min-h-[120px] flex items-center justify-center text-center">
                      {flippedCards.has(index) ? (
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-foreground/60 uppercase tracking-wide">
                            Answer
                          </div>
                          <p className="text-sm leading-relaxed">
                            {flashcard.answer}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-foreground/60 uppercase tracking-wide">
                            Question
                          </div>
                          <p className="text-sm leading-relaxed">
                            {flashcard.question}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 pb-4 px-4">
                    <div className="w-full text-center">
                      <span className="text-xs text-foreground/50">
                        Click to{' '}
                        {flippedCards.has(index)
                          ? 'show question'
                          : 'reveal answer'}
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
