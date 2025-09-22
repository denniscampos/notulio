'use client';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import {
  Preloaded,
  useConvexAuth,
  usePaginatedQuery,
  usePreloadedQuery,
  useQuery,
} from 'convex/react';
import { ArticleDialog } from './article-dialog';
import { Welcome } from './welcome';
import { useEffect, useState } from 'react';

const ARTICLES_PER_PAGE = 5;

export function ListArticles(props: {
  preloadedArticles: Preloaded<typeof api.articles.listArticles>;
}) {
  const { isLoading } = useConvexAuth();
  const articlesQuery = usePreloadedQuery(props.preloadedArticles);
  const [articles, setArticles] = useState(articlesQuery);
  console.log('articles', articlesQuery);
  useEffect(() => {
    if (!isLoading) {
      setArticles(articlesQuery);
    }
  }, [articlesQuery, isLoading]);
  // console.log(articlesQuery.page.length === 0);
  if (articles.page.length === 0) {
    return <ArticleDialog buttonText="Add your first article" />;
  } else {
    return articles.page.map((article) => (
      <div key={article._id}>
        <h2>{article.title}</h2>
        <p>{article.description}</p>
        <p>{article.author}</p>
        <p>{article.aiSummary}</p>
        <p>{article.body}</p>
      </div>
    ));
  }
}
