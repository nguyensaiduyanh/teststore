'use client';

import Link from 'next/link';
import { useAuth } from '@/features/auth/context/auth';

export default function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link className="navbar-brand" href="/">
          Single Store
        </Link>
        <nav className="nav-links">
          <Link href="/">Trang chủ</Link>
          <Link href="/products">Sản phẩm</Link>
          {isAuthenticated ? (
            <>
              <Link href="/cart">Giỏ hàng</Link>
              <Link href="/orders">Đơn hàng</Link>
            </>
          ) : null}
        </nav>
        <div className="nav-user">
          {isAuthenticated ? (
            <>
              <span className="nav-name">{user?.fullName}</span>
              <button className="btn btn-ghost" onClick={logout}>
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost" href="/login">
                Đăng nhập
              </Link>
              <Link className="btn btn-primary" href="/register">
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}