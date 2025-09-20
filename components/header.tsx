import Link from 'next/link';
import { SignOut } from './sign-out';
import { getToken } from '@/lib/auth-server';
import { ArticleDialog } from '@/app/article-dialog';
import { buttonVariants } from './ui/button';

export async function Header() {
  const token = await getToken();
  const isAuthed = !!token;

  return (
    <header className="flex justify-between items-center p-4 shadow-md border-b-4">
      <span>
        <Link className="font-bold" href="/">
          Notulio
        </Link>
      </span>
      <nav>
        <ul className="flex gap-4">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </nav>

      <div className="flex gap-4">
        <ArticleDialog />
        {isAuthed ? (
          <SignOut />
        ) : (
          <Link
            className={buttonVariants({ variant: 'neutral' })}
            href="/sign-in"
          >
            Log in
          </Link>
        )}
      </div>
    </header>
  );
}
