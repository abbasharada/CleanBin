import './globals.css';
import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { LanguageProvider } from '@/components/language-provider';
import { AuthProvider } from '@/components/auth-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: 'CleanBin Waste Collection & Environmental Services',
  description:
    'CleanBin is a digital waste collection platform for Kano State. Request professional waste pickup for homes, businesses, and communities.',
  keywords: [
    'Waste Collection Kano',
    'Waste Disposal Kano',
    'CleanBin',
    'Shara Pickup Kano',
    'Refuse Collection Kano',
    'Waste Management Kano',
    'Environmental Services Kano',
  ],
  openGraph: {
    title: 'CleanBin — Waste Collection & Environmental Services',
    description:
      'Request professional waste collection services across Kano State. Cleaner communities, healthier environments.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jakarta.variable} font-sans`}>
        <AuthProvider>
          <LanguageProvider>
            <div className="relative min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <WhatsAppButton />
              <Toaster />
            </div>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
