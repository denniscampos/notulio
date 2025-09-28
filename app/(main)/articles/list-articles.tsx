'use client';

import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import {
  Preloaded,
  useConvexAuth,
  usePreloadedQuery,
  useQuery,
} from 'convex/react';
import { ArticleDialog } from './article-dialog';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ExternalLink, User, Calendar } from 'lucide-react';
import { Search } from './search';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/use-debounce';
import { useSearchParams, useRouter } from 'next/navigation';

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

export function ListArticles(props: {
  preloadedArticles: Preloaded<typeof api.articles.searchArticles>;
}) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialData = usePreloadedQuery(props.preloadedArticles);

  // Get search query from URL params
  const urlSearchQuery = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Update URL when debounced search query changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearchQuery) {
      params.set('search', debouncedSearchQuery);
    } else {
      params.delete('search');
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [debouncedSearchQuery, router, searchParams]);

  const [expandedTags, setExpandedTags] = useState<Set<string>>(new Set());
  const [additionalArticles, setAdditionalArticles] = useState<
    Doc<'articles'>[]
  >([]);
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Use searchArticles query with debounced search for the first page
  const searchResults = useQuery(api.articles.searchArticles, {
    searchQuery: debouncedSearchQuery,
    paginationOpts: {
      numItems: 10,
      cursor: null,
    },
  });

  // Separate query for loading more pages
  const loadMoreQuery = useQuery(
    api.articles.searchArticles,
    currentCursor && isLoadingMore
      ? {
          searchQuery: debouncedSearchQuery,
          paginationOpts: {
            numItems: 10,
            cursor: currentCursor,
          },
        }
      : 'skip'
  );

  // Reset additional articles when search query changes
  useEffect(() => {
    setAdditionalArticles([]);
    setCurrentCursor(null);
    setIsDone(false);
  }, [debouncedSearchQuery]);

  // Update pagination state when search results change
  useEffect(() => {
    if (searchResults) {
      setCurrentCursor(searchResults.continueCursor);
      setIsDone(searchResults.isDone);
    }
  }, [searchResults]);

  // Handle the load more query result
  useEffect(() => {
    if (loadMoreQuery && isLoadingMore) {
      setAdditionalArticles((prev) => [...prev, ...loadMoreQuery.page]);
      setCurrentCursor(loadMoreQuery.continueCursor);
      setIsDone(loadMoreQuery.isDone);
      setIsLoadingMore(false);
    }
  }, [loadMoreQuery, isLoadingMore]);

  // Use search results if available, otherwise fall back to initial data
  const currentResults = searchResults || initialData;
  const allArticles = [...currentResults.page, ...additionalArticles];

  // Function to trigger loading more articles
  const handleLoadMore = () => {
    if (!currentCursor || isDone || isLoadingMore) return;
    setIsLoadingMore(true);
  };

  const toggleExpandTags = (articleId: string) => {
    setExpandedTags((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(articleId)) {
        newSet.delete(articleId);
      } else {
        newSet.add(articleId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button and Search - Always visible */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-heading">My Articles</h1>
            <p className="text-foreground/60">
              {isLoading ? (
                'Loading...'
              ) : (
                <>
                  {allArticles.length} article
                  {allArticles.length !== 1 ? 's' : ''}
                  {!isDone && ' (more available)'}
                </>
              )}
            </p>
          </div>
          <ArticleDialog buttonText="Add Article" />
        </div>
        <Search searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="animate-spin w-8 h-8 border-2 border-border border-t-foreground rounded-full mb-4"></div>
          <p className="text-foreground/60">Loading your articles...</p>
        </div>
      ) : allArticles.length === 0 && isAuthenticated ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          {debouncedSearchQuery ? (
            <>
              <h2 className="text-2xl font-heading mb-4">No articles found</h2>
              <p className="text-foreground/60 mb-6">
                No articles match your search for "{debouncedSearchQuery}"
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-heading mb-4">No articles yet</h2>
              <p className="text-foreground/60 mb-6">
                Start building your knowledge base by adding your first article
              </p>
              <ArticleDialog buttonText="Add your first article" />
            </>
          )}
        </div>
      ) : (
        <>
          {/* Articles Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
            {allArticles.map((article) => (
              <Card
                key={article._id}
                className="flex flex-col hover:shadow-lg transition-shadow bg-secondary-background cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/articles/${article._id}`} className="flex-1">
                      <CardTitle className="line-clamp-2 text-lg hover:underline">
                        {article.title}
                      </CardTitle>
                    </Link>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 p-1 hover:bg-secondary-background rounded-base transition-colors"
                      title="Open original article"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="size-4" />
                    </a>
                  </div>
                  {article.description ? (
                    <Link href={`/articles/${article._id}`}>
                      <CardDescription className="line-clamp-3 hover:text-foreground/80 transition-colors">
                        {article.description}
                      </CardDescription>
                    </Link>
                  ) : null}
                </CardHeader>

                <Link
                  href={`/articles/${article._id}`}
                  className="flex-1 flex flex-col"
                >
                  <CardContent className="space-y-4 flex-1">
                    {/* Author */}
                    {article.author ? (
                      <div className="flex items-center gap-2 text-sm text-foreground/60">
                        <User className="size-4" />
                        <span>{article.author}</span>
                      </div>
                    ) : null}

                    {/* AI Summary */}
                    {article.aiSummary ? (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-foreground/80">
                          Summary
                        </h4>
                        <p className="text-sm text-foreground/70 line-clamp-3">
                          {article.aiSummary}
                        </p>
                      </div>
                    ) : null}

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-foreground/80">
                          Tags
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {(expandedTags.has(article._id)
                            ? article.tags
                            : article.tags.slice(0, 4)
                          ).map((tag, index) => (
                            <span
                              key={index}
                              className={`inline-flex items-center justify-center rounded-base border-2 px-2.5 py-0.5 text-xs font-base w-fit whitespace-nowrap shrink-0 ${getTagColor(
                                tag
                              )}`}
                            >
                              {tag}
                            </span>
                          ))}
                          {article.tags.length > 4 && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleExpandTags(article._id);
                              }}
                              className="inline-flex items-center justify-center rounded-base border-2 px-2.5 py-0.5 text-xs font-base w-fit whitespace-nowrap shrink-0 bg-secondary-background text-foreground border-border hover:bg-border/50 transition-colors cursor-pointer"
                            >
                              {expandedTags.has(article._id)
                                ? 'Show less'
                                : `+${article.tags.length - 4} more`}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Link>

                <Link href={`/articles/${article._id}`}>
                  <CardFooter className="pt-0">
                    <div className="flex items-center justify-between w-full text-xs text-foreground/50">
                      <span>
                        {article.flashcards?.length || 0} flashcard
                        {article.flashcards?.length !== 1 ? 's' : ''}
                      </span>
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        <span>
                          {new Date(article._creationTime).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardFooter>
                </Link>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          {!isDone ? (
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                size="lg"
              >
                {isLoadingMore ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-border border-t-foreground rounded-full mr-2" />
                    Loading...
                  </>
                ) : (
                  'Load More Articles'
                )}
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
