import './layout.scss';

import { Navigation } from '@app/website/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
