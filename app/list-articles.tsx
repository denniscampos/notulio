'use client';
import { api } from '@/convex/_generated/api';
import { usePaginatedQuery } from 'convex/react';

const ARTICLES_PER_PAGE = 5;

export function ListArticles() {
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.articles.listArticles,
    {},
    { initialNumItems: ARTICLES_PER_PAGE }
  );
  return (
    <div>
      {results.length === 0 ? (
        <div>No articles found.</div>
      ) : isLoading && results.length > 0 ? (
        results.map((article) => (
          <div className="flex flex-col gap-5" key={article._id}>
            <p>{article?.title}</p>
            <p>{article?.aiSummary}</p>
            <p>{article.url}</p>
          </div>
        ))
      ) : null}

      <button
        onClick={() => loadMore(ARTICLES_PER_PAGE)}
        disabled={status !== 'CanLoadMore'}
      >
        Load More
      </button>
    </div>
  );
}
