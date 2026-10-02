'use client';

import { useEffect, useState } from 'react';
import { Mail, Phone, Search, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase, type CustomerProfile, type PickupRequest, STATUS_COLORS, STATUS_LABELS } from '@/lib/supabase';
import { toast } from 'sonner';

export function AdminCustomersTab() {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data: profileData, error: profileError }, { data: requestData, error: requestError }] = await Promise.all([
        supabase.from('customer_profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('pickup_requests').select('*').order('created_at', { ascending: false }),
      ]);
      if (profileError || requestError) toast.error('Could not load customers.');
      setCustomers((profileData || []) as CustomerProfile[]);
      setRequests((requestData || []) as PickupRequest[]);
      setLoading(false);
    };
    void load();
  }, []);

  const visibleCustomers = customers.filter((customer) => {
    const query = search.toLowerCase();
    return !query || customer.full_name.toLowerCase().includes(query) || customer.email.toLowerCase().includes(query) || customer.phone.includes(query);
  });

  const customerRequests = selected ? requests.filter((request) => request.user_id === selected.user_id) : [];

  if (loading) return <div className="flex justify-center py-20 text-muted-foreground"><Users className="mr-2 h-5 w-5 animate-pulse" />Loading customers...</div>;

  return <div className="space-y-4"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-10" placeholder="Search by name, email, or phone..." value={search} onChange={(event) => setSearch(event.target.value)} /></div>{visibleCustomers.length === 0 ? <Card><CardContent className="py-16 text-center text-muted-foreground">No registered customers found.</CardContent></Card> : <div className="grid gap-4 md:grid-cols-2">{visibleCustomers.map((customer) => { const customerRequestsList = requests.filter((request) => request.user_id === customer.user_id); const active = customerRequestsList.filter((request) => !['completed', 'cancelled'].includes(request.status)).length; const completed = customerRequestsList.filter((request) => request.status === 'completed').length; return <Card key={customer.user_id} className="cursor-pointer transition-shadow hover:shadow-md" onClick={() => setSelected(customer)}><CardContent className="pt-6"><div className="flex items-start justify-between gap-3"><div><h2 className="font-heading text-lg font-bold">{customer.full_name || 'Unnamed customer'}</h2><p className="mt-1 text-xs text-muted-foreground">Joined {new Date(customer.created_at).toLocaleDateString()}</p></div><Badge variant="outline">{customerRequestsList.length} pickups</Badge></div><div className="mt-4 space-y-2 text-sm text-muted-foreground"><p className="flex items-center gap-2"><Mail className="h-4 w-4" />{customer.email}</p><p className="flex items-center gap-2"><Phone className="h-4 w-4" />{customer.phone || 'No phone saved'}</p></div><div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs"><div className="rounded-lg bg-blue-50 p-2 text-blue-700"><p className="font-bold">{active}</p>Active</div><div className="rounded-lg bg-emerald-50 p-2 text-emerald-700"><p className="font-bold">{completed}</p>Completed</div></div></CardContent></Card>; })}</div>}<Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}><DialogContent className="max-w-lg"><DialogHeader><DialogTitle>{selected?.full_name || 'Customer profile'}</DialogTitle></DialogHeader>{selected && <div className="space-y-5"><div className="rounded-xl bg-secondary/40 p-4 text-sm"><p>{selected.email}</p><p className="mt-1 text-muted-foreground">{selected.phone || 'No phone saved'}</p><p className="mt-1 text-muted-foreground">{selected.address ? `${selected.address}${selected.lga ? `, ${selected.lga}` : ''}` : 'No saved home address'}</p></div><div><h3 className="font-heading font-semibold">Pickup history</h3><div className="mt-3 max-h-64 space-y-2 overflow-y-auto">{customerRequests.length === 0 ? <p className="text-sm text-muted-foreground">No pickup requests yet.</p> : customerRequests.map((request) => <div key={request.id} className="flex items-center justify-between gap-3 rounded-lg border border-border/60 p-3"><div><p className="font-mono text-xs text-primary">{request.request_id}</p><p className="text-sm">{request.address}</p></div><Badge className={STATUS_COLORS[request.status]}>{STATUS_LABELS[request.status]}</Badge></div>)}</div></div></div>}</DialogContent></Dialog></div>;
}
