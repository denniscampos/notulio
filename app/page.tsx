// import { ArticleForm } from './article-form';
import { fetchQuery, preloadQuery } from 'convex/nextjs';
import { ListArticles } from './list-articles';
import { api } from '@/convex/_generated/api';
import { getToken } from '@/lib/auth-server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const token = await getToken();
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
  console.log('preloadedArticles', preloadedArticles);
  return (
    <div>
      {/* <ArticleForm /> */}
      <ListArticles preloadedArticles={preloadedArticles} />
    </div>
  );
}
