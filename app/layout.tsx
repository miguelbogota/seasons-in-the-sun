import '@app/styles/index.scss';

import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seasons in the sun',
  description: 'Game',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.jsdelivr.net/npm/gun/gun.js" suppressHydrationWarning></script>
        <script src="https://cdn.jsdelivr.net/npm/gun/sea.js" suppressHydrationWarning></script>
        <script src="https://cdn.jsdelivr.net/npm/gun/axe.js" suppressHydrationWarning></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
