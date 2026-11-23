'use client';

import { Suspense, useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/features/auth/context/auth';

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const next = searchParams.get('next') ?? '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin(credentials: { email: string; password: string }) {
    setSubmitting(true);
    setError('');
    try {
      const loggedInUser = await login(
          credentials.email,
          credentials.password
      );

      if (loggedInUser.roles.includes('ADMIN')) {
        router.push('/admin');
      } else {
        router.push(next);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại.');
    } finally {
      setSubmitting(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    handleLogin({ email, password });
  }

  return (
    <div className="auth-card">
      <h1>Đăng nhập</h1>
      {error ? <p className="error">{error}</p> : null}
      <form className="form" onSubmit={onSubmit}>
        <label>
          Email
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>
        <label>
          Mật khẩu
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Đang xử lý…' : 'Đăng nhập'}
        </button>
      </form>
      <p className="muted">
        Chưa có tài khoản? <Link href="/register">Đăng ký</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="muted">Đang tải…</p>}>
      <LoginForm />
    </Suspense>
  );
}