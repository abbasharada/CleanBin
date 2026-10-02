'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { whatsappLink } from '@/lib/supabase';

export function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] text-white px-4 py-3 shadow-lg hover:bg-[#1da851] transition-all duration-300 hover:scale-105 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <MessageCircle className="h-6 w-6" />
      <span className="hidden sm:inline font-medium text-sm">WhatsApp Us</span>
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
      </span>
    </a>
  );
}
