'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const { error } = await sendPasswordReset(email);
    setSubmitting(false);
    if (error) {
      toast.error(error);
      return;
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/5 px-4 py-12">
      <div className="mx-auto w-full max-w-md">
        <Card className="shadow-xl"><CardContent className="pt-6">
          <div className="mb-6 text-center"><img src="/IMG-20260806-WA0001.jpg" alt="CleanBin" className="mx-auto mb-5 h-24 w-auto object-contain" /><h1 className="font-heading text-2xl font-bold">Reset your password</h1><p className="mt-2 text-sm text-muted-foreground">We will send a secure reset link to your email.</p></div>
          {sent ? <div className="rounded-xl bg-primary/5 p-4 text-center text-sm text-muted-foreground">Check your inbox for the password reset link. <Link href="/auth/login" className="font-semibold text-primary hover:underline">Return to login</Link></div> : <form onSubmit={handleSubmit} className="space-y-4"><div><Label htmlFor="email">Email address</Label><div className="relative mt-1.5"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="pl-10" /></div></div><Button type="submit" className="w-full" size="lg" disabled={submitting}>{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send reset link'}</Button></form>}
        </CardContent></Card>
        <Link href="/auth/login" className="mt-6 flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" /> Back to login</Link>
      </div>
    </div>
  );
}
