'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Leaf, Loader2, Lock, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function CustomerLoginPage() {
  const router = useRouter();
  const { signIn, session, loading, isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && session) router.replace(isAdmin ? '/admin' : '/account');
  }, [isAdmin, loading, router, session]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) {
      toast.error(error);
      return;
    }
    router.push('/account');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/5 px-4 py-12">
      <div className="mx-auto w-full max-w-md">
        <Link href="/" className="mb-8 flex justify-center">
          <img src="/IMG-20260806-WA0001.jpg" alt="CleanBin" className="h-28 w-auto object-contain" />
        </Link>
        <Card className="shadow-xl">
          <CardContent className="pt-6">
            <div className="mb-6 text-center">
              <h1 className="font-heading text-2xl font-bold">Welcome back</h1>
              <p className="mt-2 text-sm text-muted-foreground">Log in to manage your CleanBin pickups.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email address</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="pl-10" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/auth/forgot-password" className="text-xs font-medium text-primary hover:underline">Forgot password?</Link>
                </div>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="pl-10" />
                </div>
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Log in'}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              New to CleanBin? <Link href="/auth/register" className="font-semibold text-primary hover:underline">Create an account</Link>
            </p>
          </CardContent>
        </Card>
        <Link href="/" className="mt-6 flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to website
        </Link>
      </div>
    </div>
  );
}
