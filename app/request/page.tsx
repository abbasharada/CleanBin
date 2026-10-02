'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, Leaf, Loader2, Upload, X } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { useLang } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase, KANO_LGAS, WASTE_QUANTITIES, WASTE_TYPES } from '@/lib/supabase';
import { toast } from 'sonner';

const timeSlots = [
  { value: 'morning', label: 'Morning (7:00 AM - 12:00 PM)' },
  { value: 'afternoon', label: 'Afternoon (12:00 PM - 4:00 PM)' },
  { value: 'evening', label: 'Evening (4:00 PM - 7:00 PM)' },
];

interface FormValues {
  fullName: string;
  phone: string;
  address: string;
  lga: string;
  wasteType: string;
  wasteQuantity: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
}

const emptyForm: FormValues = {
  fullName: '', phone: '', address: '', lga: '', wasteType: '', wasteQuantity: '', preferredDate: '', preferredTime: '', notes: '',
};

export default function RequestPage() {
  const { t } = useLang();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    if (!user) return;
    const loadSavedDetails = async () => {
      const [{ data: profile }, { data: address }] = await Promise.all([
        supabase.from('customer_profiles').select('full_name, phone, address, lga').eq('user_id', user.id).maybeSingle(),
        supabase.from('saved_addresses').select('address, lga').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
      ]);
      const query = new URLSearchParams(window.location.search);
      const templateId = query.get('again');
      let template: Partial<FormValues> = {};
      if (templateId) {
        const { data: request } = await supabase.from('pickup_requests').select('*').eq('id', templateId).maybeSingle();
        if (request) {
          template = {
            address: request.address,
            lga: request.lga,
            wasteType: request.waste_type,
            wasteQuantity: request.waste_quantity,
            preferredTime: request.preferred_time || '',
            notes: request.notes || '',
          };
          setExistingPhotoUrl(request.photo_url);
        }
      }
      setForm((current) => ({
        ...current,
        fullName: profile?.full_name || current.fullName,
        phone: profile?.phone || current.phone,
        address: template.address || address?.address || profile?.address || current.address,
        lga: template.lga || address?.lga || profile?.lga || current.lga,
        wasteType: template.wasteType || current.wasteType,
        wasteQuantity: template.wasteQuantity || current.wasteQuantity,
        preferredTime: template.preferredTime || current.preferredTime,
        notes: template.notes || current.notes,
      }));
    };
    void loadSavedDetails();
  }, [user]);

  const updateForm = (key: keyof FormValues, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Photo must be less than 5MB.');
      return;
    }
    setPhoto(file);
    setExistingPhotoUrl(null);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    setExistingPhotoUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      let photoUrl = existingPhotoUrl;
      if (photo) {
        setUploadingPhoto(true);
        const extension = photo.name.split('.').pop() || 'jpg';
        const fileName = `${user.id}/${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage.from('pickup-photos').upload(fileName, photo);
        if (uploadError) throw new Error(`Photo upload failed: ${uploadError.message}`);
        photoUrl = supabase.storage.from('pickup-photos').getPublicUrl(fileName).data.publicUrl;
      }

      const { error } = await supabase.from('pickup_requests').insert({
        user_id: user.id,
        full_name: form.fullName,
        phone_number: form.phone,
        address: form.address,
        lga: form.lga,
        waste_type: form.wasteType,
        waste_quantity: form.wasteQuantity,
        preferred_date: form.preferredDate || null,
        preferred_time: form.preferredTime || null,
        photo_url: photoUrl,
        photos: photoUrl ? [photoUrl] : [],
        notes: form.notes || null,
        status: 'pending',
      });
      if (error) throw error;
      toast.success('Your pickup request has been submitted successfully.');
      router.push('/account/pickups?submitted=1');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('form.error'));
    } finally {
      setSubmitting(false);
      setUploadingPhoto(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Checking your account...</div>;

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/5 px-4 py-16">
        <Card className="w-full max-w-lg shadow-xl"><CardContent className="p-8 text-center sm:p-10">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Leaf className="h-7 w-7" /></div>
          <h1 className="font-heading text-3xl font-bold">Create your CleanBin account</h1>
          <p className="mt-4 text-muted-foreground">Create your CleanBin account to request a pickup. Your information will be saved securely, making your next pickup faster and easier.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center"><Button asChild size="lg"><a href="/auth/register">Create Account</a></Button><Button asChild size="lg" variant="outline"><a href="/auth/login">Login</a></Button></div>
        </CardContent></Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-16 lg:py-20"><div className="container mx-auto px-4 text-center sm:px-6 lg:px-8"><div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"><Leaf className="h-4 w-4" />Request Pickup</div><h1 className="text-balance font-heading text-4xl font-bold lg:text-5xl">Request a Waste Collection</h1><p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">Your saved details are ready. Review the information below and tell us what you need collected.</p></div></section>
      <section className="bg-background py-16"><div className="container mx-auto px-4 sm:px-6 lg:px-8"><div className="mx-auto max-w-2xl"><Card className="border-border/50 shadow-lg"><CardContent className="pt-6"><form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2"><div><Label htmlFor="full_name">{t('form.name')} *</Label><Input id="full_name" required value={form.fullName} onChange={(event) => updateForm('fullName', event.target.value)} className="mt-1.5" /></div><div><Label htmlFor="phone_number">{t('form.phone')} *</Label><Input id="phone_number" required value={form.phone} onChange={(event) => updateForm('phone', event.target.value)} className="mt-1.5" /></div></div>
        <div><Label htmlFor="address">{t('form.address')} *</Label><Input id="address" required value={form.address} onChange={(event) => updateForm('address', event.target.value)} className="mt-1.5" /></div>
        <div><Label htmlFor="lga">{t('form.lga')} *</Label><Select value={form.lga} onValueChange={(value) => updateForm('lga', value)} required><SelectTrigger className="mt-1.5"><SelectValue placeholder={t('form.selectLga')} /></SelectTrigger><SelectContent>{KANO_LGAS.map((lga) => <SelectItem key={lga} value={lga}>{lga}</SelectItem>)}</SelectContent></Select></div>
        <div className="grid gap-4 sm:grid-cols-2"><div><Label>{t('form.wasteType')} *</Label><Select value={form.wasteType} onValueChange={(value) => updateForm('wasteType', value)} required><SelectTrigger className="mt-1.5"><SelectValue placeholder={t('form.selectWasteType')} /></SelectTrigger><SelectContent>{WASTE_TYPES.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select></div><div><Label>{t('form.quantity')} *</Label><Select value={form.wasteQuantity} onValueChange={(value) => updateForm('wasteQuantity', value)} required><SelectTrigger className="mt-1.5"><SelectValue placeholder={t('form.selectQuantity')} /></SelectTrigger><SelectContent>{WASTE_QUANTITIES.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select></div></div>
        <div className="grid gap-4 sm:grid-cols-2"><div><Label htmlFor="preferred_date">{t('form.date')}</Label><Input id="preferred_date" type="date" value={form.preferredDate} onChange={(event) => updateForm('preferredDate', event.target.value)} className="mt-1.5" /></div><div><Label>{t('form.time')}</Label><Select value={form.preferredTime} onValueChange={(value) => updateForm('preferredTime', value)}><SelectTrigger className="mt-1.5"><SelectValue placeholder={t('form.selectTime')} /></SelectTrigger><SelectContent>{timeSlots.map((slot) => <SelectItem key={slot.value} value={slot.value}>{slot.label}</SelectItem>)}</SelectContent></Select></div></div>
        <div><Label>{t('form.photo')}</Label><p className="mb-2 mt-1 text-xs text-muted-foreground">Upload a photo of the waste (optional, max 5MB)</p><input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />{photoPreview || existingPhotoUrl ? <div className="relative overflow-hidden rounded-xl border border-border/50"><img src={photoPreview || existingPhotoUrl || ''} alt="Waste preview" className="h-48 w-full object-cover" /><button type="button" onClick={removePhoto} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"><X className="h-4 w-4" /></button></div> : <button type="button" onClick={() => fileInputRef.current?.click()} className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border transition-colors hover:border-primary hover:bg-primary/5"><Upload className="h-8 w-8 text-muted-foreground" /><span className="text-sm text-muted-foreground">Click to upload a photo</span></button>}</div>
        <div><Label htmlFor="notes">{t('form.notes')}</Label><Textarea id="notes" value={form.notes} onChange={(event) => updateForm('notes', event.target.value)} placeholder="Any additional information..." rows={3} className="mt-1.5" /></div>
        <Button type="submit" disabled={submitting || !form.lga || !form.wasteType || !form.wasteQuantity} size="lg" className="w-full">{submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{uploadingPhoto ? 'Uploading photo...' : 'Submitting...'}</> : <>{t('form.submit')}<ArrowRight className="ml-2 h-4 w-4" /></>}</Button>
      </form></CardContent></Card><div className="mt-6 flex items-start gap-3 rounded-xl border border-border/50 bg-secondary/30 p-4"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><p className="text-sm text-muted-foreground">After submitting, our team will review your request and contact you to confirm details and pricing.</p></div></div></div></section>
    </div>
  );
}
