'use client';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { usePaginatedQuery } from 'convex/react';
import { ArticleDialog } from './article-dialog';

const ARTICLES_PER_PAGE = 5;

export function ListArticles() {
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.articles.listArticles,
    {},
    { initialNumItems: ARTICLES_PER_PAGE }
  );
  return (
    // TODO: Fix loading states
    <div>
      {results.length === 0 ? (
        <ArticleDialog />
      ) : results.length > 0 ? (
        results.map((article) => (
          <div className="flex flex-col gap-5" key={article._id}>
            <p>{article?.title}</p>
            <p>{article?.aiSummary}</p>
            <p>{article.url}</p>
          </div>
        ))
      ) : null}

      {results.length >= 5 ? (
        <Button
          onClick={() => loadMore(ARTICLES_PER_PAGE)}
          disabled={status !== 'CanLoadMore'}
        >
          Load More
        </Button>
      ) : null}
    </div>
  );
}
