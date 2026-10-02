'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, ArrowRight, Leaf, Building, Users, Landmark, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useLang } from '@/components/language-provider';
import { supabase, type PricingTier } from '@/lib/supabase';
import { toast } from 'sonner';

const ICON_MAP: Record<string, LucideIcon> = {
  Leaf,
  Building,
  Users,
  Landmark,
};

const contracts = [
  {
    icon: Building,
    title: 'Monthly Contracts',
    desc: 'Recurring waste collection agreements for homes and businesses that need regular service.',
  },
  {
    icon: Users,
    title: 'Community Contracts',
    desc: 'Partnerships with estates, schools, markets, and organizations for ongoing waste management.',
  },
  {
    icon: Landmark,
    title: 'Government Partnerships',
    desc: 'Environmental cleanup projects and sanitation contracts with local government agencies.',
  },
];

export default function PricingPage() {
  const { t } = useLang();
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTiers = async () => {
      const { data, error } = await supabase
        .from('pricing_tiers')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (error) {
        toast.error('Failed to load pricing');
      } else {
        setTiers(data || []);
      }
      setLoading(false);
    };
    fetchTiers();
  }, []);

  return (
    <div className="flex flex-col">
      <section className="py-16 lg:py-20 bg-gradient-to-br from-primary/10 via-background to-accent/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Leaf className="h-4 w-4" />
            Pricing
          </div>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold mb-6 text-balance">
            {t('pricing.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {tiers.map((tier) => {
              const Icon = ICON_MAP[tier.icon] || Leaf;
              return (
                <Card
                  key={tier.id}
                  className={`relative flex flex-col ${
                    tier.highlight
                      ? 'border-primary shadow-xl lg:scale-105 bg-primary/5'
                      : 'border-border/50'
                  }`}
                >
                  {tier.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary text-primary-foreground px-4 py-1 text-xs font-semibold">
                      Most Popular
                    </div>
                  )}
                  <CardContent className="pt-6 flex-1">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl mb-4 ${tier.highlight ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-heading text-2xl font-bold mb-1">{tier.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
                    <div className="text-2xl font-bold font-heading mb-6">{tier.price}</div>
                    <ul className="space-y-3">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <div className={`flex h-5 w-5 items-center justify-center rounded-full ${tier.highlight ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                            <Check className="h-3 w-3" />
                          </div>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button asChild className="w-full" variant={tier.highlight ? 'default' : 'outline'}>
                      <Link href="/request">
                        Request Pickup
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-8">
            Note: Pricing varies depending on volume and location. Final pricing is confirmed when we contact you.
          </p>
        </div>
      </section>

      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">Contract Options</h2>
            <p className="text-muted-foreground">Beyond one-time pickups, we offer ongoing waste management partnerships.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {contracts.map((contract, i) => (
              <Card key={i} className="border-border/50 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 mb-4">
                    <contract.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{contract.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{contract.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">Get a Custom Quote</h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Have a large project or ongoing waste management needs? We will create a plan that works for you.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/contact">Contact Us for a Quote</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
