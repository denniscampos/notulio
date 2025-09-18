import { ArticleForm } from './article-form';
import { ListArticles } from './list-articles';

export default function Home() {
  return (
    <div>
      <h2>Main page..</h2>
      <ArticleForm />

      <ListArticles />
    </div>
  );
}
