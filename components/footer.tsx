'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { useLang } from '@/components/language-provider';
import { WHATSAPP_NUMBER } from '@/lib/supabase';

export function Footer() {
  const { t } = useLang();
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="border-t border-border bg-secondary/30 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/IMG-20260806-WA0001.jpg"
                alt="CleanBin"
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footer.about')}
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-accent/10 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-accent/10 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-accent/10 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4">{t('footer.links')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">{t('nav.home')}</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">{t('nav.services')}</Link></li>
              <li><Link href="/request" className="hover:text-primary transition-colors">{t('nav.request')}</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">{t('nav.about')}</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">{t('nav.pricing')}</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4">{t('footer.services')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Household Waste Collection</li>
              <li>Commercial Waste Collection</li>
              <li>Community Cleanup</li>
              <li>Construction Waste Removal</li>
              <li>Emergency Waste Collection</li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <span>+234 902 333 8788</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <span>info@kanocleanup.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <span>Kano State, Nigeria</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-xs">WhatsApp: +{WHATSAPP_NUMBER}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CleanBin. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
