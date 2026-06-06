import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Bars3Icon,
  XMarkIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const navLinks = [
  { href: '/',        label: 'Home'     },
  { href: '/convert', label: 'Convert'  },
  { href: '/compress', label: 'Compress' },
  { href: '/pricing', label: 'Pricing'  },
];

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center group-hover:bg-primary-700 transition-colors duration-200">
                <DocumentTextIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors duration-200">
                FilePro
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    pathname === link.href
                      ? 'text-primary-600'
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/pricing"
                className="bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 hover:shadow-md cursor-pointer"
              >
                Go Premium
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-200 cursor-pointer"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="md:hidden border-t border-gray-100 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer ${
                    pathname === link.href
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2">
                <Link
                  href="/pricing"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-400 rounded-lg text-center transition-colors duration-200 cursor-pointer"
                >
                  Go Premium
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4 cursor-pointer group w-fit">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">FilePro</span>
              </Link>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                Fast, free, and secure file conversion and compression. Files auto-deleted after 1 hour.
              </p>
            </div>

            {/* Convert */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Convert</h3>
              <ul className="space-y-2.5">
                {[
                  { href: '/pdf-to-word', label: 'PDF to Word' },
                  { href: '/word-to-pdf', label: 'Word to PDF' },
                  { href: '/jpg-to-png', label: 'JPG to PNG' },
                  { href: '/mp4-to-mp3', label: 'MP4 to MP3' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200 cursor-pointer"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Compress */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Compress</h3>
              <ul className="space-y-2.5">
                {[
                  { href: '/compress-pdf', label: 'Compress PDF' },
                  { href: '/compress-image', label: 'Compress Image' },
                  { href: '/compress-video', label: 'Compress Video' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200 cursor-pointer"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2.5">
                {[
                  { href: '/pricing', label: 'Pricing' },
                  { href: '/privacy', label: 'Privacy Policy' },
                  { href: '/terms', label: 'Terms of Service' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200 cursor-pointer"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © 2026 FilePro. All rights reserved.
            </p>
            <p className="text-sm text-gray-400">
              Files are automatically deleted after 1 hour for your privacy.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
