import Link from 'next/link';
import { SignOut } from './sign-out';
import { getToken } from '@/lib/auth-server';

export async function Header() {
  const token = await getToken();
  const isAuthed = !!token;

  return (
    <header className="flex justify-between items-center p-4">
      <h1>Notulio</h1>
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
      {isAuthed ? (
        <SignOut />
      ) : (
        <Link href="/sign-in" className="text-blue-500 hover:text-blue-700">
          Log in
        </Link>
      )}
    </header>
  );
}
