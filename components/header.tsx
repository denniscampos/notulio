import Link from 'next/link';

export function Header() {
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

      <Link href="/sign-up">Sign Up</Link>
    </header>
  );
}
