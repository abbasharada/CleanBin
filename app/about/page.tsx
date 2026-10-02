'use client';

import {
  Leaf,
  Target,
  Eye,
  Heart,
  Users,
  Recycle,
  Shield,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const values = [
  {
    icon: Shield,
    title: 'Integrity',
    desc: 'We operate with honesty and transparency in every interaction.',
  },
  {
    icon: Recycle,
    title: 'Sustainability',
    desc: 'We are committed to environmentally responsible waste management.',
  },
  {
    icon: Users,
    title: 'Community',
    desc: 'We serve communities and build partnerships that create lasting impact.',
  },
  {
    icon: TrendingUp,
    title: 'Excellence',
    desc: 'We strive for the highest standards in service delivery.',
  },
];

const objectives = [
  'Improve environmental cleanliness',
  'Simplify waste collection requests',
  'Reduce illegal dumping',
  'Support public health initiatives',
  'Promote environmental awareness',
  'Create employment opportunities',
  'Support government sanitation efforts',
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <section className="py-16 lg:py-20 bg-gradient-to-br from-primary/10 via-background to-accent/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Leaf className="h-4 w-4" />
            About Us
          </div>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold mb-6 text-balance">
            Our Story
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            CleanBin was born out of a simple idea: that everyone in Kano State deserves access to reliable, professional waste collection services.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl font-bold mb-6">Company Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Across many communities in Kano State, waste management remains a significant challenge. Accumulated household waste, uncollected commercial waste, illegal dumping, and blocked drainage channels are common issues that affect public health and quality of life.
              </p>
              <p>
                Many residents do not know who to contact when they need waste removed from their premises. CleanBin was created to solve this problem. to serve as a bridge between waste generators and waste collection teams, helping create cleaner communities and healthier environments.
              </p>
              <p>
                Our digital platform allows residents, businesses, schools, markets, and communities to quickly submit waste collection requests. Once a request is received, our team reviews it, contacts the customer, dispatches a collection team, and ensures the waste is properly removed. This process creates a faster and more organized waste management system for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-4">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-3">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To build cleaner, healthier, and more sustainable communities through technology-driven waste management solutions.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 mb-4">
                  <Eye className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-3">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To become the leading waste management and environmental services platform in Northern Nigeria.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground">The principles that guide everything we do.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <Card key={i} className="border-border/50 hover:shadow-lg transition-shadow text-center">
                <CardContent className="pt-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mx-auto mb-4">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">Core Objectives</h2>
              <p className="text-muted-foreground">What we aim to achieve for Kano State.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {objectives.map((obj, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-background border border-border/50">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-sm font-medium">{obj}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">Our Team</h2>
            <p className="text-muted-foreground">Dedicated professionals working towards a cleaner Kano.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Musa Musa Kabir', role: 'Founder & CEO', initials: 'MMK' },
              { name: 'Abubakar Sadik yusuf', role: 'Operations Manager', initials: 'ASY' },
              { name: 'Yusuf Bello', role: 'Field Coordinator', initials: 'YB' },
              { name: 'Zainab Aliyu', role: 'Customer Relations', initials: 'ZA' },
            ].map((member, i) => (
              <Card key={i} className="border-border/50 text-center">
                <CardContent className="pt-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white text-2xl font-bold mx-auto mb-4">
                    {member.initials}
                  </div>
                  <h3 className="font-heading font-semibold text-lg">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
