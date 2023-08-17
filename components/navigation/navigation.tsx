import Link from 'next/link';

const routes = [
  {
    path: '/',
    name: 'Game',
  },
  {
    path: '/blog',
    name: 'Blog',
  },
  {
    path: '/wiki',
    name: 'Wiki',
  },
];

export function Navigation() {
  return (
    <nav>
      {routes.map(({ path, name }) => (
        <Link key={path} href={path}>
          {name}
        </Link>
      ))}
    </nav>
  );
}
