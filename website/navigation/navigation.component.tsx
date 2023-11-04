import Link from 'next/link';

export type NavigationProps = {
  // Empty for now.
};

export function Navigation(props: NavigationProps) {
  const {} = props;

  return (
    <nav className="navigation">
      {routes.map(({ path, name }) => (
        <Link key={path} href={path}>
          {name}
        </Link>
      ))}
    </nav>
  );
}

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
