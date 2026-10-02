'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLang, type Language } from '@/components/language-provider';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth-provider';

const navLinks = [
  { href: '/', key: 'nav.home' },
  { href: '/services', key: 'nav.services' },
  { href: '/request', key: 'nav.request' },
  { href: '/about', key: 'nav.about' },
  { href: '/pricing', key: 'nav.pricing' },
  { href: '/contact', key: 'nav.contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const { t, lang, setLang } = useLang();
  const { session, isAdmin: accountIsAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) return null;

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-background/95 backdrop-blur-md shadow-md border-b border-border'
          : 'bg-background/80 backdrop-blur-sm'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/IMG-20260806-WA0001.jpg"
              alt="CleanBin"
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent/10 hover:text-accent',
                  pathname === link.href
                    ? 'text-primary font-semibold'
                    : 'text-foreground/70'
                )}
              >
                {t(link.key)}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'en' ? 'ha' : 'en')}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md border border-border hover:bg-accent/10 transition-colors"
              aria-label="Toggle language"
            >
              <Globe className="h-4 w-4" />
              {lang === 'en' ? 'HA' : 'EN'}
            </button>
            <Button asChild size="sm" variant="outline">
              <Link href={session ? (accountIsAdmin ? '/admin' : '/account') : '/auth/login'}>{session ? (accountIsAdmin ? 'Admin' : 'My Account') : 'Log in'}</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/request">{t('cta.request')}</Link>
            </Button>
          </div>

          <button
            className="md:hidden p-2 rounded-md hover:bg-accent/10"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {open && (
          <div className="md:hidden border-t border-border py-4 space-y-1 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent/10',
                  pathname === link.href
                    ? 'text-primary font-semibold bg-primary/5'
                    : 'text-foreground/70'
                )}
              >
                {t(link.key)}
              </Link>
            ))}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setLang(lang === 'en' ? 'ha' : 'en' as Language)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md border border-border"
              >
                <Globe className="h-4 w-4" />
                {lang === 'en' ? 'Hausa' : 'English'}
              </button>
              <Button asChild size="sm" variant="outline">
                <Link href={session ? (accountIsAdmin ? '/admin' : '/account') : '/auth/login'}>{session ? (accountIsAdmin ? 'Admin' : 'My Account') : 'Log in'}</Link>
              </Button>
              <Button asChild size="sm" className="flex-1">
                <Link href="/request">{t('cta.request')}</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
