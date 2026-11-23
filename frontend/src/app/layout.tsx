import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { AuthProvider } from '@/features/auth/context/auth';

export const metadata: Metadata = {
  title: 'Single Store',
  description: 'Cửa hàng trực tuyến – đặt hàng và mua sắm.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}