import Link from 'next/link';

const routes = [
  {
    path: '/',
    name: 'Wiki',
  },
  {
    path: '/getting-started',
    name: 'Getting started',
  },
];

export default function WikiLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <h1>Wiki page</h1>
      <p>This is the full layout for the wiki.</p>

      {routes.map(({ path, name }) => (
        <Link key={path} href={`/wiki/${path}`}>
          {name}
        </Link>
      ))}

      {children}
    </main>
  );
}
