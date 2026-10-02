'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Home as HomeIcon,
  Building2,
  Users,
  HardHat,
  Zap,
  ArrowRight,
  CheckCircle2,
  Recycle,
  Leaf,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLang } from '@/components/language-provider';
import { supabase, type Service } from '@/lib/supabase';
import { toast } from 'sonner';

const ICON_MAP: Record<string, LucideIcon> = {
  Home: HomeIcon,
  Building2,
  Users,
  HardHat,
  Zap,
  Leaf,
  Recycle,
};

export default function ServicesPage() {
  const { t } = useLang();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (error) {
        toast.error('Failed to load services');
      } else {
        setServices(data || []);
      }
      setLoading(false);
    };
    fetchServices();
  }, []);

  return (
    <div className="flex flex-col">
      <section className="py-16 lg:py-20 bg-gradient-to-br from-primary/10 via-background to-accent/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Leaf className="h-4 w-4" />
            {t('services.title')}
          </div>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold mb-6 text-balance">
            {t('services.subtitle')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From household bins to community-wide cleanup campaigns, we provide professional waste collection services tailored to your needs.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {services.map((service, i) => {
              const Icon = ICON_MAP[service.icon] || HomeIcon;
              return (
                <div
                  key={service.id}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}
                >
                  <div className={i % 2 === 1 ? 'lg:col-start-2' : ''}>
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white mb-6">
                      <Icon className="h-8 w-8" />
                    </div>
                    <h2 className="font-heading text-2xl lg:text-3xl font-bold mb-4">
                      {service.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild>
                      <Link href="/request">
                        Request This Service
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className={i % 2 === 1 ? 'lg:col-start-1' : ''}>
                    <Card className="bg-secondary/30 border-border/50 overflow-hidden">
                      <CardContent className="pt-6">
                        <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
                          <Icon className="h-24 w-24 text-primary/30" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Recycle className="h-12 w-12 mx-auto mb-4" />
          <h2 className="font-heading text-3xl font-bold mb-4">
            Not Sure Which Service You Need?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Our team will help you figure out the right service for your waste collection needs.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/contact">Contact Our Team</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
