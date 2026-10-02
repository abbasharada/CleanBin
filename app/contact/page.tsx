'use client';

import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLang } from '@/components/language-provider';
import { supabase, whatsappLink, type SiteSettings } from '@/lib/supabase';
import { toast } from 'sonner';

export default function ContactPage() {
  const { t } = useLang();
  const [submitting, setSubmitting] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', '00000000-0000-0000-0000-000000000001')
        .maybeSingle();
      if (data) setSettings(data);
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = (formData.get('phone') as string) || null;
    const subject = (formData.get('subject') as string) || null;
    const message = formData.get('message') as string;

    const { error } = await supabase.from('contact_messages').insert({
      full_name: name,
      email,
      phone,
      subject,
      message,
    });

    if (error) {
      toast.error('Failed to send message. Please try again.');
      setSubmitting(false);
      return;
    }

    const waNumber = settings?.whatsapp_number || '2349023338788';
    const waMessage = `New Contact Form Message:\n\nName: ${name}\nEmail: ${email}\n${phone ? `Phone: ${phone}\n` : ''}\n${message}`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`, '_blank');

    toast.success('Thank you for reaching out! We will get back to you soon.');
    (e.target as HTMLFormElement).reset();
    setSubmitting(false);
  };

  const phone = settings?.phone || '+234 902 333 8788';
  const email = settings?.email || 'info@kanocleanup.com';
  const address = settings?.address || 'Kano State, Nigeria';
  const waNumber = settings?.whatsapp_number || '2349023338788';

  const contactInfo = [
    { icon: Phone, label: 'Phone', value: phone },
    { icon: MessageCircle, label: 'WhatsApp', value: `+${waNumber}` },
    { icon: Mail, label: 'Email', value: email },
    { icon: MapPin, label: 'Office Address', value: address },
    { icon: Clock, label: 'Working Hours', value: 'Mon - Sat: 7:00 AM - 7:00 PM' },
  ];

  return (
    <div className="flex flex-col">
      <section className="py-16 lg:py-20 bg-gradient-to-br from-primary/10 via-background to-accent/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Phone className="h-4 w-4" />
            Contact
          </div>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold mb-6 text-balance">
            {t('contact.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-heading text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-4 mb-8">
                {contactInfo.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-border/50 hover:bg-secondary/30 transition-colors">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{item.label}</div>
                      <div className="font-medium">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl overflow-hidden border border-border/50">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31107.5!2d8.5!3d12.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDAwJzAwLjAiTiA4wrAzMCcwMC4wIkU!5e0!3m2!1sen!2sng!4v1700000000000"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Kano State Map"
                />
              </div>
            </div>

            <div>
              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <h2 className="font-heading text-2xl font-bold mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" required placeholder="Your full name" className="mt-1.5" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" name="email" type="email" required placeholder="you@example.com" className="mt-1.5" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone (optional)</Label>
                        <Input id="phone" name="phone" placeholder="0902 333 8788" className="mt-1.5" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" name="subject" required placeholder="What is this about?" className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" name="message" required placeholder="Your message..." rows={5} className="mt-1.5" />
                    </div>
                    <Button type="submit" disabled={submitting} className="w-full">
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
