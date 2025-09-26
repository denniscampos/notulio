import { getToken } from '@/lib/auth-server';
import { ArticleDetail } from './article-detail';
import { redirect } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import { preloadQuery } from 'convex/nextjs';
import { Id } from '@/convex/_generated/dataModel';

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: Id<'articles'> }>;
}) {
  const id = (await params).id;
  const token = await getToken();

  if (!token) {
    redirect('/sign-in');
  }

  const preloadedArticle = await preloadQuery(
    api.articles.getArticleById,
    { id },
    { token }
  );

  return (
    <div className="mx-auto max-w-4xl py-10 px-4">
      <ArticleDetail preloadedArticle={preloadedArticle} />
    </div>
  );
}
