'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CalendarDays, ChevronRight, Clock3, MapPin, Package, X } from 'lucide-react';
import { CustomerShell } from '@/components/customer-shell';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase, type PickupRequest, type PickupRequestEvent, STATUS_COLORS, STATUS_LABELS, WASTE_TYPES } from '@/lib/supabase';
import { toast } from 'sonner';

export default function CustomerPickupsPage() {
  const { user, loading } = useAuth();
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [selected, setSelected] = useState<PickupRequest | null>(null);
  const [events, setEvents] = useState<PickupRequestEvent[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data, error } = await supabase.from('pickup_requests').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (error) toast.error('Could not load your pickup history.');
      setRequests((data || []) as PickupRequest[]);
      const requestId = new URLSearchParams(window.location.search).get('request');
      const target = (data || []).find((request) => request.id === requestId) as PickupRequest | undefined;
      if (target) void openRequest(target);
      setFetching(false);
    };
    void load();
  }, [user]);

  const openRequest = async (request: PickupRequest) => {
    setSelected(request);
    const { data } = await supabase.from('pickup_request_events').select('*').eq('pickup_request_id', request.id).order('created_at', { ascending: true });
    setEvents((data || []) as PickupRequestEvent[]);
  };

  if (loading || fetching) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading your pickups...</div>;
  if (!user) return null;

  return <CustomerShell><div className="space-y-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-primary">Your activity</p><h1 className="mt-1 font-heading text-3xl font-bold">My Pickups</h1><p className="mt-2 text-muted-foreground">View every request and track its progress.</p></div><Button asChild><Link href="/request">Request Pickup<ArrowRight className="ml-2 h-4 w-4" /></Link></Button></div>{requests.length === 0 ? <Card><CardContent className="py-16 text-center"><Package className="mx-auto h-10 w-10 text-muted-foreground" /><h2 className="mt-4 font-heading text-xl font-bold">No pickups yet</h2><p className="mt-2 text-sm text-muted-foreground">Your submitted requests will show here.</p><Button asChild className="mt-6"><Link href="/request">Make your first request</Link></Button></CardContent></Card> : <div className="grid gap-4">{requests.map((request) => <Card key={request.id} className="cursor-pointer transition-shadow hover:shadow-md" onClick={() => void openRequest(request)}><CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="font-mono text-xs text-primary">{request.request_id}</p><h2 className="mt-1 truncate font-heading font-semibold">{request.address}</h2><div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{new Date(request.created_at).toLocaleDateString()}</span><span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{request.lga}</span><span>{WASTE_TYPES.find((type) => type.value === request.waste_type)?.label || request.waste_type}</span></div></div><div className="flex items-center justify-between gap-3 sm:justify-end"><Badge className={STATUS_COLORS[request.status]}>{STATUS_LABELS[request.status]}</Badge><ChevronRight className="h-5 w-5 text-muted-foreground" /></div></CardContent></Card>)}</div>}</div>{selected && <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" onClick={() => setSelected(null)}><div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-background p-6 sm:rounded-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-xs text-primary">{selected.request_id}</p><h2 className="mt-1 font-heading text-2xl font-bold">Pickup details</h2></div><button onClick={() => setSelected(null)} className="rounded-full p-2 hover:bg-secondary" aria-label="Close"><X className="h-5 w-5" /></button></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><div><p className="text-xs text-muted-foreground">Address</p><p className="mt-1 font-medium">{selected.address}, {selected.lga}</p></div><div><p className="text-xs text-muted-foreground">Current status</p><Badge className={`mt-1 ${STATUS_COLORS[selected.status]}`}>{STATUS_LABELS[selected.status]}</Badge></div><div><p className="text-xs text-muted-foreground">Waste type</p><p className="mt-1 font-medium">{WASTE_TYPES.find((type) => type.value === selected.waste_type)?.label || selected.waste_type}</p></div><div><p className="text-xs text-muted-foreground">Quantity</p><p className="mt-1 font-medium">{selected.waste_quantity}</p></div><div><p className="text-xs text-muted-foreground">Preferred date</p><p className="mt-1 font-medium">{selected.preferred_date || 'Not specified'}</p></div><div><p className="text-xs text-muted-foreground">Preferred time</p><p className="mt-1 font-medium">{selected.preferred_time || 'Not specified'}</p></div></div>{selected.notes && <div className="mt-5 rounded-xl bg-secondary/40 p-4"><p className="text-xs text-muted-foreground">Notes</p><p className="mt-1 text-sm">{selected.notes}</p></div>}<div className="mt-7"><h3 className="font-heading font-semibold">Request history</h3><div className="mt-4 space-y-3">{events.map((event) => <div key={event.id} className="flex gap-3"><div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" /><div><p className="text-sm font-medium">{STATUS_LABELS[event.status]}</p><p className="text-xs text-muted-foreground">{new Date(event.created_at).toLocaleString()}</p></div></div>)}</div></div>{selected.status === 'completed' && <Button asChild className="mt-7 w-full"><Link href={`/request?again=${selected.id}`}>Request Again<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>}</div></div>}</CustomerShell>;
}
