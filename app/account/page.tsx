'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock3, ListChecks, MessageCircle, Truck } from 'lucide-react';
import { CustomerShell } from '@/components/customer-shell';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase, type CustomerProfile, type PickupRequest, STATUS_LABELS, STATUS_COLORS } from '@/lib/supabase';

export default function AccountPage() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [{ data: profileData }, { data: requestData }] = await Promise.all([
        supabase.from('customer_profiles').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('pickup_requests').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ]);
      setProfile(profileData as CustomerProfile | null);
      setRequests((requestData || []) as PickupRequest[]);
      setFetching(false);
    };
    void load();
  }, [user]);

  if (loading || fetching) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading your dashboard...</div>;
  if (!user) return null;

  const pending = requests.filter((request) => request.status === 'pending').length;
  const confirmed = requests.filter((request) => ['confirmed', 'assigned', 'on_the_way'].includes(request.status)).length;
  const completed = requests.filter((request) => request.status === 'completed').length;

  return <CustomerShell><div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-primary">Customer dashboard</p><h1 className="mt-1 font-heading text-3xl font-bold">Welcome back, {profile?.full_name || 'there'}</h1><p className="mt-2 text-muted-foreground">Keep your home, shop, or office clean with simple pickup requests.</p></div><Button asChild><Link href="/request">Request Pickup<ArrowRight className="ml-2 h-4 w-4" /></Link></Button></div>
    <div className="grid gap-4 sm:grid-cols-3"><Card><CardContent className="flex items-center gap-4 pt-6"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><Clock3 className="h-5 w-5" /></div><div><p className="text-sm text-muted-foreground">Pending Pickups</p><p className="font-heading text-2xl font-bold">{pending}</p></div></CardContent></Card><Card><CardContent className="flex items-center gap-4 pt-6"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700"><Truck className="h-5 w-5" /></div><div><p className="text-sm text-muted-foreground">Active Pickups</p><p className="font-heading text-2xl font-bold">{confirmed}</p></div></CardContent></Card><Card><CardContent className="flex items-center gap-4 pt-6"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><CheckCircle2 className="h-5 w-5" /></div><div><p className="text-sm text-muted-foreground">Completed</p><p className="font-heading text-2xl font-bold">{completed}</p></div></CardContent></Card></div>
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]"><Card><CardContent className="pt-6"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-heading text-xl font-bold">Recent requests</h2><p className="text-sm text-muted-foreground">Track your latest pickup activity.</p></div><Button asChild variant="ghost" size="sm"><Link href="/account/pickups">View all</Link></Button></div>{requests.length === 0 ? <div className="rounded-xl border border-dashed border-border p-8 text-center"><ListChecks className="mx-auto h-9 w-9 text-muted-foreground" /><p className="mt-3 font-medium">No pickup requests yet</p><p className="mt-1 text-sm text-muted-foreground">Your first request will appear here.</p></div> : <div className="space-y-3">{requests.slice(0, 4).map((request) => <Link key={request.id} href={`/account/pickups?request=${request.id}`} className="flex items-center justify-between gap-4 rounded-xl border border-border/60 p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"><div className="min-w-0"><p className="font-mono text-xs text-primary">{request.request_id}</p><p className="mt-1 truncate font-medium">{request.address}</p><p className="mt-1 text-xs text-muted-foreground">{request.waste_type} · {new Date(request.created_at).toLocaleDateString()}</p></div><span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[request.status]}`}>{STATUS_LABELS[request.status]}</span></Link>)}</div>}</CardContent></Card><Card className="bg-primary text-primary-foreground"><CardContent className="pt-6"><MessageCircle className="h-8 w-8" /><h2 className="mt-5 font-heading text-xl font-bold">Need help?</h2><p className="mt-2 text-sm leading-relaxed opacity-90">Our team is ready to answer questions about your pickup.</p><div className="mt-5 space-y-2"><Button asChild variant="secondary" className="w-full"><a href="https://wa.me/2349023338788?text=Assalamu%20Alaikum.%20I%20would%20like%20to%20contact%20CleanBin%20about%20waste%20collection." target="_blank" rel="noreferrer">WhatsApp CleanBin</a></Button><Button asChild variant="outline" className="w-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"><Link href="/contact">Contact CleanBin</Link></Button></div></CardContent></Card></div>
  </div></CustomerShell>;
}
