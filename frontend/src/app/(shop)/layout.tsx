import type { ReactNode } from 'react';
import NavBar from '@/components/NavBar';

export default function ShopLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="container">{children}</main>
      <footer className="footer">© {new Date().getFullYear()} Single Store</footer>
    </div>
  );
}