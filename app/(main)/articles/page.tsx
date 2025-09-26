// import { ArticleForm } from './article-form';
import { fetchQuery, preloadQuery } from 'convex/nextjs';
import { ListArticles } from './list-articles';
import { api } from '@/convex/_generated/api';
import { getToken } from '@/lib/auth-server';
import { redirect } from 'next/navigation';

export default async function ArticlesPage() {
  const token = await getToken();
  if (!token) {
    redirect('/sign-in');
  }
  const preloadedArticles = await preloadQuery(
    api.articles.listArticles,
    {
      paginationOpts: {
        numItems: 5,
        cursor: null,
      },
    },
    { token }
  );
  return (
    <div className="mx-auto max-w-7xl py-10 px-4">
      {/* <ArticleForm /> */}
      <ListArticles preloadedArticles={preloadedArticles} />
    </div>
  );
}
