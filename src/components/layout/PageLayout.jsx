import { useState } from 'react';
import Sidebar from './Sidebar';

export default function PageLayout({ title, subtitle, actions, children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-7 h-16 bg-white border-b border-gray-200 gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              className="lg:hidden text-xl text-gray-600 w-9 h-9 rounded-md flex items-center justify-center hover:bg-gray-50 hover:text-gray-900"
              onClick={() => setMenuOpen(true)}
              aria-label="Buka menu"
            >
              ☰
            </button>
            <div className="flex items-baseline gap-2.5 min-w-0 sm:flex-col sm:items-start sm:gap-0">
              <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">{title}</h1>
              {subtitle && <p className="text-xs text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis hidden sm:block">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
        </header>
        <main className="flex-1 px-3 sm:px-5 lg:px-7 py-4 sm:py-6">{children}</main>
      </div>
    </div>
  );
}
