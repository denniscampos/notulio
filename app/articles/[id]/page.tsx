import { ArticleDetail } from './article-detail';

export default function ArticleDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="mx-auto max-w-4xl py-10 px-4">
      <ArticleDetail articleId={params.id} />
    </div>
  );
}
