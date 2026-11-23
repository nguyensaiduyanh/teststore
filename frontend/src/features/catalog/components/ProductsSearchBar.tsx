'use client';

import { useState } from 'react';

export default function ProductsSearchBar({ defaultValue, onSearch }: { defaultValue: string; onSearch: (query: string) => void }) {
  return (
    <form
      className="searchbar"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        onSearch(String(form.get('q') ?? ''));
      }}
    >
      <input className="input" name="q" defaultValue={defaultValue} placeholder="Tìm kiếm sản phẩm…" />
      <button className="btn btn-primary" type="submit">
        Tìm
      </button>
    </form>
  );
}