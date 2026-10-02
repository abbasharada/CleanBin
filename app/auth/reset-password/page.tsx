'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { session, loading, updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !session) toast.error('This reset link has expired. Please request a new one.');
  }, [loading, session]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.length < 8 || password !== confirmPassword) {
      toast.error(password !== confirmPassword ? 'Passwords do not match.' : 'Password must be at least 8 characters.');
      return;
    }
    setSubmitting(true);
    const { error } = await updatePassword(password);
    setSubmitting(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success('Password updated successfully.');
    router.push('/account');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/5 px-4 py-12"><div className="mx-auto w-full max-w-md"><Card className="shadow-xl"><CardContent className="pt-6"><div className="mb-6 text-center"><img src="/IMG-20260806-WA0001.jpg" alt="CleanBin" className="mx-auto mb-5 h-24 w-auto object-contain" /><h1 className="font-heading text-2xl font-bold">Choose a new password</h1></div>{session ? <form onSubmit={handleSubmit} className="space-y-4"><div><Label htmlFor="password">New password</Label><div className="relative mt-1.5"><Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input id="password" type="password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} className="pl-10" /></div></div><div><Label htmlFor="confirmPassword">Confirm new password</Label><Input id="confirmPassword" type="password" minLength={8} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-1.5" /></div><Button type="submit" className="w-full" size="lg" disabled={submitting}>{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update password'}</Button></form> : <p className="text-center text-sm text-muted-foreground">Please open the reset link from your email again.</p>}</CardContent></Card><Link href="/" className="mt-6 flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" /> Back to website</Link></div></div>
  );
}
