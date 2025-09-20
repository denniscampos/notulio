// import { ArticleForm } from './article-form';
import { ListArticles } from './list-articles';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col justify-center items-center">
      {/* <ArticleForm /> */}
      <div className="p-4 text-center">
        <h2 className="text-2xl font-bold pb-3">Welcome to Notulio</h2>
        <p>
          Start building your knowledge vault by saving articles that matter to
          you. AI-powered summaries help you remember and learn from everything
          you read.
        </p>
      </div>

      <ListArticles />
    </div>
  );
}
