'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-piccs-black/70 backdrop-blur-lg border-b border-piccs-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Blog */}
          <div className="flex items-center gap-3">
            <a
              href="https://piccreativespace.id"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img
                src="/logo-piccs-white.png"
                alt="PIC Creative Space"
                className="h-8 w-auto"
              />
            </a>
            <span className="hidden sm:inline text-xs text-piccs-gray font-medium tracking-wider uppercase border-l border-piccs-border/50 pl-3">
              <Link href="/" className="hover:text-piccs-neon transition-colors">
                Blog
              </Link>
            </span>
          </div>

          {/* Right — PIC Creative Space button (like BOOK NOW on main site) */}
          <a
            href="https://piccreativespace.id"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold tracking-wide text-piccs-black bg-piccs-neon rounded-lg hover:bg-piccs-neon-dark transition-all shadow-lg shadow-piccs-neon/20"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3L4 9v12h5v-7h6v7h5V9z"/>
            </svg>
            PIC Creative Space
          </a>
        </div>
      </div>
    </header>
  );
}
