'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Lock, Mail, Phone, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function CustomerRegisterPage() {
  const router = useRouter();
  const { signUp, session, loading } = useAuth();
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', password: '', confirmPassword: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && session) router.replace('/account');
  }, [loading, router, session]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.password.length < 8) {
      toast.error('Your password must be at least 8 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    const result = await signUp(form.email, form.password, form.fullName, form.phone);
    setSubmitting(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    if (result.needsEmailConfirmation) {
      toast.success('Account created. Check your email to verify your account, then log in.');
      router.push('/auth/login');
    } else {
      toast.success('Welcome to CleanBin.');
      router.push('/account');
    }
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
              <h1 className="font-heading text-2xl font-bold">Create your CleanBin account</h1>
              <p className="mt-2 text-sm text-muted-foreground">Save your details and make every pickup easier.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full name</Label>
                <div className="relative mt-1.5"><UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input id="fullName" required value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} className="pl-10" /></div>
              </div>
              <div>
                <Label htmlFor="phone">Phone number</Label>
                <div className="relative mt-1.5"><Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input id="phone" required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="pl-10" /></div>
              </div>
              <div>
                <Label htmlFor="email">Email address</Label>
                <div className="relative mt-1.5"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input id="email" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="pl-10" /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label htmlFor="password">Password</Label><div className="relative mt-1.5"><Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input id="password" type="password" minLength={8} required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="pl-10" /></div></div>
                <div><Label htmlFor="confirmPassword">Confirm password</Label><Input id="confirmPassword" type="password" minLength={8} required value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} className="mt-1.5" /></div>
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={submitting}>{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create account'}</Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">Already have an account? <Link href="/auth/login" className="font-semibold text-primary hover:underline">Log in</Link></p>
          </CardContent>
        </Card>
        <Link href="/" className="mt-6 flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" /> Back to website</Link>
      </div>
    </div>
  );
}
