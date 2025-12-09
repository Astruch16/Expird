'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import {
  Check,
  ArrowRight,
  Sparkles,
  Zap,
  Crown,
  HelpCircle,
} from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for new agents getting started',
    monthlyPrice: 29.99,
    yearlyPrice: 24.99,
    icon: Zap,
    features: [
      'Up to 100 listings',
      'Interactive map view',
      'Basic analytics',
      'Email support',
      'Manual listing entry',
    ],
    notIncluded: [
      'Pipeline board',
      'Follow-up reminders',
      'Bulk import',
      'Priority support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Professional',
    description: 'For serious realtors ready to grow',
    monthlyPrice: 49.99,
    yearlyPrice: 39.99,
    icon: Sparkles,
    features: [
      'Unlimited listings',
      'Interactive map view',
      'Advanced analytics',
      'Pipeline board (Kanban)',
      'Follow-up reminders',
      'Bulk CSV import',
      'Outreach tracking',
      'Priority email support',
    ],
    notIncluded: [],
    cta: 'Get Started',
    popular: true,
  },
  {
    name: 'Team',
    description: 'For teams and brokerages',
    monthlyPrice: 99.99,
    yearlyPrice: 79.99,
    icon: Crown,
    features: [
      'Everything in Professional',
      'Up to 5 team members',
      'Team dashboard',
      'Shared listings',
      'Performance leaderboard',
      'Admin controls',
      'Phone support',
      'Custom onboarding',
    ],
    notIncluded: [],
    cta: 'Contact Sales',
    popular: false,
  },
];

const faqs = [
  {
    question: 'How do I get started with EXPIRD?',
    answer: 'Simply choose a plan and sign up. You can start tracking expired listings immediately after your payment is processed.',
  },
  {
    question: 'What happens if I want to cancel?',
    answer: 'You can cancel anytime from your account settings. Your access continues until the end of your billing period, and your data is saved for 30 days in case you want to return.',
  },
  {
    question: 'Can I change plans later?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and are prorated.',
  },
  {
    question: 'Is there a contract or commitment?',
    answer: 'No long-term contracts. Pay monthly and cancel anytime. Annual plans are billed upfront but can be cancelled with a prorated refund.',
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Background effects */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
            Simple, Transparent Pricing
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Choose the Plan That{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Fits Your Business
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Straightforward pricing with no hidden fees. Cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={cn('text-sm font-medium', !isAnnual && 'text-primary')}>
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-primary"
            />
            <span className={cn('text-sm font-medium', isAnnual && 'text-primary')}>
              Annual
            </span>
            {isAnnual && (
              <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                Save 20%
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  'relative p-8 rounded-2xl border transition-all duration-300',
                  plan.popular
                    ? 'border-primary bg-gradient-to-b from-primary/10 to-transparent scale-105 shadow-xl shadow-primary/10'
                    : 'border-border/50 bg-card/30 hover:border-border'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={cn(
                    'p-2 rounded-lg',
                    plan.popular ? 'bg-primary/20' : 'bg-muted'
                  )}>
                    <plan.icon className={cn(
                      'w-5 h-5',
                      plan.popular ? 'text-primary' : 'text-muted-foreground'
                    )} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">
                      {formatPrice(isAnnual ? plan.yearlyPrice : plan.monthlyPrice)}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  {isAnnual && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Billed {formatPrice(plan.yearlyPrice * 12)} annually
                    </p>
                  )}
                </div>

                <Link href="/signup">
                  <Button
                    className={cn(
                      'w-full mb-6',
                      plan.popular ? 'btn-glow' : ''
                    )}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    <span className={plan.popular ? 'relative z-10 flex items-center gap-2' : 'flex items-center gap-2'}>
                      {plan.cta}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Button>
                </Link>

                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-sm">
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-4 h-4 shrink-0" />
                      <span className="line-through">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Plans Include */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8">All Plans Include</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              'SSL Security',
              'Daily Backups',
              'Mobile Responsive',
              '99.9% Uptime',
              'Data Export',
              'GDPR Compliant',
              'Canadian Servers',
              '24/7 Monitoring',
            ].map((item) => (
              <div key={item} className="flex items-center justify-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <HelpCircle className="w-3.5 h-3.5 mr-1.5" />
              FAQ
            </Badge>
            <h2 className="text-3xl font-bold">Common Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-border/50 bg-card/30"
              >
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">Still have questions?</p>
            <Link href="/faq">
              <Button variant="outline">
                View All FAQs
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Closing More Deals?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join hundreds of Canadian realtors already using EXPIRD.
          </p>
          <Link href="/signup">
            <Button size="lg" className="btn-glow h-12 px-8">
              <span className="relative z-10 flex items-center gap-2">
                Get Started Today
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
