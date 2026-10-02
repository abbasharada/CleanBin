'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Home as HomeIcon,
  Leaf,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Recycle,
  ShoppingBag,
  Sparkles,
  Truck,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLang } from '@/components/language-provider';
import { whatsappLink } from '@/lib/supabase';

const heroImage =
  'https://images.pexels.com/photos/11218601/pexels-photo-11218601.jpeg?auto=compress&cs=tinysrgb&w=1600';
const cleaningImage =
  'https://images.pexels.com/photos/4276426/pexels-photo-4276426.jpeg?auto=compress&cs=tinysrgb&w=1200';
const communityImage =
  'https://images.pexels.com/photos/36308694/pexels-photo-36308694.jpeg?auto=compress&cs=tinysrgb&w=1200';

const howItWorks = [
  {
    step: '1',
    icon: Phone,
    title: 'Request a Pickup',
    desc: 'Tell us where the waste is and what type of waste you need removed.',
  },
  {
    step: '2',
    icon: Package,
    title: 'Choose Your Pickup Size',
    desc: 'Select the appropriate collection option for a small or large amount of waste.',
  },
  {
    step: '3',
    icon: Truck,
    title: 'We Come to You',
    desc: 'Our collection team arrives at your location at the arranged time.',
  },
  {
    step: '4',
    icon: Sparkles,
    title: 'We Clean & Collect',
    desc: 'If you need cleaning as well, we clean the waste area and collect the waste afterward.',
  },
  {
    step: '5',
    icon: Leaf,
    title: 'Your Area Is Clean',
    desc: 'We transport the collected waste for proper disposal. Your space is left clean.',
  },
];

const smallPickupUses = [
  { icon: HomeIcon, label: 'Household waste' },
  { icon: Users, label: 'Small compounds' },
  { icon: ShoppingBag, label: 'Small shops' },
  { icon: Package, label: 'Small amounts of accumulated waste' },
];

const largePickupUses = [
  { icon: Users, label: 'Large compounds' },
  { icon: ShoppingBag, label: 'Businesses' },
  { icon: Truck, label: 'Construction-related waste' },
  { icon: Leaf, label: 'Community or area cleanup' },
];

const whyChooseUs = [
  { icon: Clock, title: 'Fast Response', desc: 'Submit a request and our team contacts you quickly to arrange pickup.' },
  { icon: Sparkles, title: 'Clean & Collect', desc: 'We do not just collect waste. We can clean the area too.' },
  { icon: Leaf, title: 'Eco-Friendly', desc: 'Waste is transported for proper disposal, not dumped illegally.' },
  { icon: MapPin, title: 'Starting Locally', desc: 'We are building a service that grows with our community.' },
];

const futurePlans = [
  { icon: MapPin, label: 'More collection areas' },
  { icon: Truck, label: 'More pickup vehicles' },
  { icon: Calendar, label: 'Regular waste collection' },
  { icon: Recycle, label: 'Recycling' },
  { icon: Phone, label: 'Mobile application' },
  { icon: Users, label: 'Community cleanup services' },
  { icon: ShoppingBag, label: 'Business waste management' },
  { icon: Leaf, label: 'Larger environmental projects' },
];

export default function HomePage() {
  const { t } = useLang();

  return (
    <div className="flex flex-col">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Waste collection vehicle" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/60" />
          <div className="absolute inset-0 bg-grid-pattern opacity-40" />
        </div>
        <div className="container relative mx-auto px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-2xl">
            <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Leaf className="h-4 w-4" />
              Waste Collection & Environmental Services
            </div>
            <h1 className="animate-fade-in-up mt-6 text-balance font-heading text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl" style={{ animationDelay: '0.1s' }}>
              You Have Waste?<br />
              <span className="text-primary">CleanBin Comes to You.</span>
            </h1>
            <p className="animate-fade-in-up mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground" style={{ animationDelay: '0.2s' }}>
              Convenient waste collection from homes, shops, compounds, and local areas. Request a pickup and our team comes to you.
            </p>
            <div className="animate-fade-in-up mt-8 flex flex-col gap-4 sm:flex-row" style={{ animationDelay: '0.3s' }}>
              <Button asChild size="lg" className="text-base">
                <Link href="/request">
                  Request Waste Pickup
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-[#25D366]/30 text-[#1da851] hover:bg-[#25D366]/10 hover:text-[#1da851]">
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Chat on WhatsApp
                </a>
              </Button>
            </div>
            <div className="animate-fade-in-up mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground" style={{ animationDelay: '0.4s' }}>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" />Request in minutes</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" />Small & large pickups</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" />Clean & collect service</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHAT CLEANBIN DOES ============ */}
      <section className="border-b border-border/50 bg-background py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                <Leaf className="h-4 w-4" />
                What CleanBin Does
              </div>
              <h2 className="mt-4 text-balance font-heading text-3xl font-bold lg:text-4xl">
                Not just reporting waste.<br />We collect and transport it.
              </h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                CleanBin is a private waste collection and environmental service platform. We provide an actual waste collection and transportation service, not just a website for reporting waste.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Customers can request collection depending on the amount of waste they have, from a small household pickup to a large community cleanup. The exact vehicle and transport option is determined by CleanBin based on your request.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Truck className="h-5 w-5 text-primary" /></div>
                  <span className="text-sm font-medium">Collection service</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Sparkles className="h-5 w-5 text-primary" /></div>
                  <span className="text-sm font-medium">Cleaning service</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Recycle className="h-5 w-5 text-primary" /></div>
                  <span className="text-sm font-medium">Proper disposal</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><MapPin className="h-5 w-5 text-primary" /></div>
                  <span className="text-sm font-medium">We come to you</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
                <img src={communityImage} alt="Workers cleaning a street" className="h-full w-full object-cover" />
              </div>
              <div className="absolute -bottom-5 -right-5 hidden rounded-2xl bg-primary p-5 text-primary-foreground shadow-xl sm:block">
                <Recycle className="mb-2 h-7 w-7" />
                <div className="font-heading text-xl font-bold">Eco-Friendly</div>
                <div className="text-sm opacity-90">Waste Management</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="bg-secondary/30 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-primary"><Clock className="h-4 w-4" />Simple Process</div>
            <h2 className="mt-4 font-heading text-3xl font-bold lg:text-4xl">How CleanBin Works</h2>
            <p className="mt-4 text-muted-foreground">From request to a clean area in five simple steps, anyone can do it.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {howItWorks.map((item, i) => (
              <div key={i} className="relative text-center">
                <div className="relative mx-auto mb-5 inline-flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/15 bg-background shadow-sm transition-transform hover:scale-105">
                  <item.icon className="h-9 w-9 text-primary" />
                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{item.step}</span>
                </div>
                <h3 className="font-heading text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PICKUP OPTIONS ============ */}
      <section className="bg-background py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-primary"><Truck className="h-4 w-4" />Pickup Options</div>
            <h2 className="mt-4 font-heading text-3xl font-bold lg:text-4xl">Small or Large, We Collect It</h2>
            <p className="mt-4 text-muted-foreground">Choose the pickup size that matches the amount of waste you need removed.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Small Pickup */}
            <Card className="group border-border/50 transition-all duration-300 hover:shadow-lg">
              <CardContent className="pt-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <Package className="h-7 w-7" />
                </div>
                <h3 className="mt-5 font-heading text-2xl font-bold">Small Pickup</h3>
                <p className="mt-2 text-sm text-muted-foreground">For smaller amounts of waste from everyday spaces.</p>
                <div className="mt-6 space-y-3">
                  {smallPickupUses.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary"><item.icon className="h-4 w-4 text-muted-foreground" /></div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
                <Button asChild variant="outline" className="mt-7 w-full">
                  <Link href="/request">Request Small Pickup<ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
            {/* Large Pickup */}
            <Card className="group border-border/50 transition-all duration-300 hover:shadow-lg">
              <CardContent className="pt-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-50 text-amber-700 transition-colors group-hover:bg-amber-600 group-hover:text-white">
                  <Truck className="h-7 w-7" />
                </div>
                <h3 className="mt-5 font-heading text-2xl font-bold">Large Pickup</h3>
                <p className="mt-2 text-sm text-muted-foreground">For bigger amounts of waste from larger spaces and operations.</p>
                <div className="mt-6 space-y-3">
                  {largePickupUses.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary"><item.icon className="h-4 w-4 text-muted-foreground" /></div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
                <Button asChild variant="outline" className="mt-7 w-full">
                  <Link href="/request">Request Large Pickup<ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ============ MUYI SHARA SANNAN MU KWASHE ============ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent py-20 text-primary-foreground">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Special Service
              </div>
              <h2 className="mt-6 font-heading text-3xl font-bold lg:text-4xl">
                Muyi Shara, Sannan Mu Kwashe.
              </h2>
              <p className="mt-4 text-lg leading-relaxed opacity-90">
                We clean the waste area and take the waste away.
              </p>
              <p className="mt-4 leading-relaxed opacity-80">
                This service is for customers who do not only need waste transportation, but also need the surrounding area cleaned before the waste is collected.
              </p>
              <div className="mt-8 space-y-3">
                {['Dirty compounds', 'Shops', 'Small business locations', 'Streets and areas', 'Accumulated waste locations'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 opacity-90" />
                    <span className="text-sm font-medium opacity-90">{item}</span>
                  </div>
                ))}
              </div>
              <Button asChild size="lg" variant="secondary" className="mt-8">
                <Link href="/request">Request This Service<ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
                <img src={cleaningImage} alt="Cleaning and sweeping a waste area" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHY CHOOSE CLEANBIN ============ */}
      <section className="bg-background py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-primary"><Leaf className="h-4 w-4" />Why CleanBin</div>
            <h2 className="mt-4 font-heading text-3xl font-bold lg:text-4xl">Why Choose CleanBin</h2>
            <p className="mt-4 text-muted-foreground">We are building a waste collection service people can rely on.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item, i) => (
              <Card key={i} className="group border-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary">
                    <item.icon className="h-6 w-6 text-primary transition-colors group-hover:text-primary-foreground" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SERVICE AREA + MVP ============ */}
      <section className="bg-secondary/30 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-medium text-primary"><MapPin className="h-4 w-4" />Service Area</div>
              <h2 className="mt-4 font-heading text-3xl font-bold lg:text-4xl">Starting Locally, Growing Steadily</h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                CleanBin is launching as an MVP, starting with municipal and local community waste collection. We are beginning with a manageable service area, learning from our customers, improving our operations, and expanding our coverage over time.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                We are a private waste collection and environmental service platform, not a government agency. Our focus is on providing reliable, convenient waste collection that grows with the communities we serve.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium text-muted-foreground">Private service</span>
                <span className="rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium text-muted-foreground">Community focused</span>
                <span className="rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium text-muted-foreground">Expanding gradually</span>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-medium text-primary"><Recycle className="h-4 w-4" />Future Plans</div>
              <h3 className="mt-4 font-heading text-2xl font-bold">Where CleanBin Can Go</h3>
              <p className="mt-3 text-sm text-muted-foreground">These are future possibilities, not services that are available today.</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {futurePlans.map((plan, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-border/50 bg-background p-3">
                    <plan.icon className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm font-medium">{plan.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="bg-gradient-to-r from-primary to-accent py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <Leaf className="mx-auto mb-4 h-12 w-12" />
            <h2 className="font-heading text-3xl font-bold lg:text-4xl">Ready to Clean Up Your Area?</h2>
            <p className="mt-4 text-lg opacity-90">Request a waste pickup today or message us on WhatsApp for immediate assistance.</p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" variant="secondary" className="text-base">
                <Link href="/request">{t('cta.request')}<ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button asChild size="lg" className="bg-[#25D366] text-base text-white hover:bg-[#1da851]">
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />{t('cta.whatsapp')}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
