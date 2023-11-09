import '@app/theme/index.scss';

import clsx from 'clsx';
import { type Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  style: ['normal'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Seasons in the sun',
  description: 'Game',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontClasses = clsx(inter.className);

  return (
    <html lang="en">
      <head>
        <script src="https://cdn.jsdelivr.net/npm/gun/gun.js" suppressHydrationWarning></script>
        <script src="https://cdn.jsdelivr.net/npm/gun/sea.js" suppressHydrationWarning></script>
        <script src="https://cdn.jsdelivr.net/npm/gun/axe.js" suppressHydrationWarning></script>
      </head>
      <body className={fontClasses}>{children}</body>
    </html>
  );
}
