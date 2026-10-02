'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ListChecks, UserRound, LogOut, Leaf, Bell } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const links = [
  { href: '/account', label: 'Overview', icon: LayoutDashboard },
  { href: '/account/pickups', label: 'My Pickups', icon: ListChecks },
  { href: '/account/profile', label: 'My Profile', icon: UserRound },
];

export function CustomerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading your account...</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-secondary/20">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <img src="/IMG-20260806-WA0001.jpg" alt="CleanBin" className="h-11 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/contact" className="hidden sm:inline-flex">
              <Button variant="ghost" size="sm">Contact CleanBin</Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Log out</span>
            </Button>
          </div>
        </div>
      </header>
      <div className="container mx-auto grid gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8 lg:py-8">
        <aside className="rounded-2xl border border-border/60 bg-background p-2 lg:h-fit lg:p-3">
          <nav className="grid grid-cols-3 gap-1 lg:grid-cols-1">
            {links.map((link) => {
              const Icon = link.icon;
              const active = link.href === '/account' ? pathname === link.href : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors lg:justify-start',
                    active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-3 hidden rounded-xl bg-primary/5 p-3 lg:block">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
              <Bell className="h-4 w-4" />
              Need help?
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">Contact our team or message CleanBin on WhatsApp.</p>
            <Link href="/contact" className="mt-2 inline-flex text-xs font-semibold text-primary">Get support</Link>
          </div>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
