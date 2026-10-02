'use client';

import { useEffect, useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { CustomerShell } from '@/components/customer-shell';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase, KANO_LGAS, type CustomerProfile, type SavedAddress } from '@/lib/supabase';
import { toast } from 'sonner';

export default function CustomerProfilePage() {
  const { user, loading, updatePassword } = useAuth();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [form, setForm] = useState({ full_name: '', phone: '', address: '', lga: '' });
  const [addressForm, setAddressForm] = useState({ address_name: '', address: '', lga: '' });
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);

  const load = async () => {
    if (!user) return;
    const [{ data: profileData }, { data: addressData }] = await Promise.all([
      supabase.from('customer_profiles').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('saved_addresses').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    ]);
    const nextProfile = profileData as CustomerProfile | null;
    setProfile(nextProfile);
    setForm({ full_name: nextProfile?.full_name || '', phone: nextProfile?.phone || '', address: nextProfile?.address || '', lga: nextProfile?.lga || '' });
    setAddresses((addressData || []) as SavedAddress[]);
    setFetching(false);
  };

  useEffect(() => { void load(); }, [user]);

  const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('customer_profiles').update(form).eq('user_id', user.id);
    setSaving(false);
    if (error) toast.error('Could not save your profile.'); else toast.success('Profile updated.');
  };

  const addAddress = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !addressForm.address_name || !addressForm.address || !addressForm.lga) return;
    const { error } = await supabase.from('saved_addresses').insert({ ...addressForm, user_id: user.id });
    if (error) toast.error('Could not save this address.'); else { toast.success('Address saved.'); setAddressForm({ address_name: '', address: '', lga: '' }); void load(); }
  };

  const deleteAddress = async (id: string) => {
    const { error } = await supabase.from('saved_addresses').delete().eq('id', id);
    if (error) toast.error('Could not remove this address.'); else setAddresses((current) => current.filter((address) => address.id !== id));
  };

  const changePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.length < 8) { toast.error('Password must be at least 8 characters.'); return; }
    const { error } = await updatePassword(password);
    if (error) toast.error(error); else { toast.success('Password changed.'); setPassword(''); }
  };

  if (loading || fetching) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading your profile...</div>;
  if (!user) return null;

  return <CustomerShell><div className="space-y-6"><div><p className="text-sm font-medium text-primary">Account settings</p><h1 className="mt-1 font-heading text-3xl font-bold">My Profile</h1><p className="mt-2 text-muted-foreground">Keep your contact and pickup details up to date.</p></div><Card><CardContent className="pt-6"><h2 className="font-heading text-xl font-bold">Personal information</h2><form onSubmit={saveProfile} className="mt-5 grid gap-4 sm:grid-cols-2"><div><Label htmlFor="full_name">Full name</Label><Input id="full_name" value={form.full_name} onChange={(event) => setForm({ ...form, full_name: event.target.value })} className="mt-1.5" /></div><div><Label htmlFor="phone">Phone number</Label><Input id="phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="mt-1.5" /></div><div><Label>Email address</Label><Input value={user.email || profile?.email || ''} disabled className="mt-1.5" /></div><div><Label htmlFor="lga">Local Government Area</Label><Select value={form.lga} onValueChange={(value) => setForm({ ...form, lga: value })}><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select your LGA" /></SelectTrigger><SelectContent>{KANO_LGAS.map((lga) => <SelectItem key={lga} value={lga}>{lga}</SelectItem>)}</SelectContent></Select></div><div className="sm:col-span-2"><Label htmlFor="address">Home address</Label><Input id="address" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} className="mt-1.5" /></div><div className="sm:col-span-2"><Button type="submit" disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save changes'}</Button></div></form></CardContent></Card><div className="grid gap-6 lg:grid-cols-2"><Card><CardContent className="pt-6"><h2 className="font-heading text-xl font-bold">Saved addresses</h2><p className="mt-1 text-sm text-muted-foreground">Save home, shop, and office locations for faster requests.</p><form onSubmit={addAddress} className="mt-5 space-y-3"><Input placeholder="Address name (Home, Shop...)" value={addressForm.address_name} onChange={(event) => setAddressForm({ ...addressForm, address_name: event.target.value })} required /><Input placeholder="Full address" value={addressForm.address} onChange={(event) => setAddressForm({ ...addressForm, address: event.target.value })} required /><Select value={addressForm.lga} onValueChange={(value) => setAddressForm({ ...addressForm, lga: value })} required><SelectTrigger><SelectValue placeholder="Select LGA" /></SelectTrigger><SelectContent>{KANO_LGAS.map((lga) => <SelectItem key={lga} value={lga}>{lga}</SelectItem>)}</SelectContent></Select><Button type="submit" variant="outline"><Plus className="mr-2 h-4 w-4" />Save address</Button></form><div className="mt-5 space-y-2">{addresses.map((address) => <div key={address.id} className="flex items-center justify-between gap-3 rounded-xl border border-border/60 p-3"><div><p className="text-sm font-semibold">{address.address_name}</p><p className="text-xs text-muted-foreground">{address.address}, {address.lga}</p></div><button onClick={() => void deleteAddress(address.id)} className="rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600" aria-label={`Remove ${address.address_name}`}><Trash2 className="h-4 w-4" /></button></div>)}</div></CardContent></Card><Card><CardContent className="pt-6"><h2 className="font-heading text-xl font-bold">Change password</h2><p className="mt-1 text-sm text-muted-foreground">Use a strong password you do not reuse elsewhere.</p><form onSubmit={changePassword} className="mt-5 space-y-3"><Label htmlFor="new_password">New password</Label><Input id="new_password" type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required /><Button type="submit" variant="outline">Update password</Button></form></CardContent></Card></div></div></CustomerShell>;
}
