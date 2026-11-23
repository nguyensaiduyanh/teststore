'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/context/auth';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleRegister(formData: { fullName: string; email: string; password: string }) {
    setSubmitting(true);
    setError('');
    try {
      await register(formData.fullName, formData.email, formData.password);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại.');
    } finally {
      setSubmitting(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    handleRegister({ fullName, email, password });
  }

  return (
    <div className="auth-card">
      <h1>Đăng ký tài khoản</h1>
      {error ? <p className="error">{error}</p> : null}
      <form className="form" onSubmit={onSubmit}>
        <label>
          Họ và tên
          <input
            className="input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nguyễn Văn A"
            required
          />
        </label>
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
          Mật khẩu (tối thiểu 8 ký tự)
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </label>
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Đang xử lý…' : 'Đăng ký'}
        </button>
      </form>
      <p className="muted">
        Đã có tài khoản? <Link href="/login">Đăng nhập</Link>
      </p>
    </div>
  );
}