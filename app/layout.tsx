import '@app/styles/globals.scss';

import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seasons in the sun',
  description: 'Game',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
