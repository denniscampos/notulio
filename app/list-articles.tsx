'use client';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { usePaginatedQuery } from 'convex/react';
import { ArticleDialog } from './article-dialog';
import { Welcome } from './welcome';

const ARTICLES_PER_PAGE = 5;

export function ListArticles() {
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.articles.listArticles,
    {},
    { initialNumItems: ARTICLES_PER_PAGE }
  );

  if (isLoading) {
    return <div>Loading... </div>;
  }

  if (results.length === 0) {
    return (
      <div>
        <Welcome />
        <ArticleDialog buttonText="Add your first article" />
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      {results.map((article) => (
        <div key={article._id} className="flex flex-col gap-5">
          <p>{article.title}</p>
          <p>{article.aiSummary}</p>
          <p>{article.url}</p>
        </div>
      ))}

      <div className="flex flex-col items-center justify-center py-6">
        <Button
          disabled={status !== 'CanLoadMore'}
          onClick={() => loadMore(ARTICLES_PER_PAGE)}
        >
          Load more
        </Button>
      </div>
    </div>
  );
}
