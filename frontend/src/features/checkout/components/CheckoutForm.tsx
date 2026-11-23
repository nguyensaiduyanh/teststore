'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';

export interface CheckoutFormValue {
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
}

export default function CheckoutForm({
  onSubmit,
  submitting,
}: {
  onSubmit: (data: CheckoutFormValue) => void;
  submitting?: boolean;
}) {
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!recipientName.trim() || !recipientPhone.trim() || !shippingAddress.trim()) {
      setError('Vui lòng điền đầy đủ thông tin người nhận.');
      return;
    }
    setError('');
    onSubmit({ recipientName, recipientPhone, shippingAddress });
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Họ tên người nhận
        <input
          className="input"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          placeholder="Nguyễn Văn A"
        />
      </label>
      <label>
        Số điện thoại
        <input
          className="input"
          value={recipientPhone}
          onChange={(e) => setRecipientPhone(e.target.value)}
          placeholder="0901234567"
        />
      </label>
      <label>
        Địa chỉ giao hàng
        <textarea
          className="input"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          placeholder="Số nhà, đường, phường, quận, thành phố"
        />
      </label>
      {error ? <p className="error">{error}</p> : null}
      <button className="btn btn-primary" type="submit" disabled={submitting}>
        {submitting ? 'Đang đặt hàng…' : 'Xác nhận đặt hàng'}
      </button>
    </form>
  );
}