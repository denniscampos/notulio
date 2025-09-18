'use client';
import { useState } from 'react';
import { createArticleMetadata } from './actions';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function ArticleForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [articleURL, setArticleURL] = useState<string>('');

  const handleArticleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await createArticleMetadata({ url: articleURL });
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div>
      <h2>Paste an Article URL: </h2>
      <form onSubmit={handleArticleSubmit}>
        <input
          type="text"
          placeholder="https://www.example.com/blog/123"
          onChange={(e) => setArticleURL(e.target.value)}
        />
        <button disabled={status === 'loading'}>
          {status === 'loading'
            ? 'Saving + summarizing...'
            : 'Save + Summarize'}
        </button>
      </form>
      {status === 'error' ? (
        <p className="text-red-500">Something went wrong</p>
      ) : null}
    </div>
  );
}
