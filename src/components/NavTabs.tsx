import React from 'react';

type Tab = 'recipient' | 'sponsor' | 'dashboard';

export default function NavTabs({
  current,
  onChange,
}: {
  current: Tab;
  onChange: (t: Tab) => void;
}) {
  const base =
    'px-4 py-2 rounded-xl border text-sm font-medium transition';
  const active =
    'bg-gray-900 text-white border-gray-900';
  const idle =
    'bg-white text-gray-700 hover:bg-gray-50 border-gray-300';

  return (
    <nav className="flex gap-2 mb-6">
      <button
        className={`${base} ${current === 'recipient' ? active : idle}`}
        onClick={() => onChange('recipient')}
      >
        Recipient Signup
      </button>
      <button
        className={`${base} ${current === 'sponsor' ? active : idle}`}
        onClick={() => onChange('sponsor')}
      >
        Sponsor Purchase
      </button>
      <button
        className={`${base} ${current === 'dashboard' ? active : idle}`}
        onClick={() => onChange('dashboard')}
      >
        Admin Dashboard
      </button>
    </nav>
  );
}
