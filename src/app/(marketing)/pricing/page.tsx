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
  Shield,
  Clock,
  Smartphone,
  Activity,
  Download,
  Lock,
  Server,
  Eye,
  Percent,
} from 'lucide-react';
import { motion } from 'framer-motion';

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
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyber-blue/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyber-purple/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Elegant tagline - matching other pages */}
          <motion.div
            className="mb-6 flex items-center justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyber-blue/50" />
            <span className="text-sm font-medium tracking-widest uppercase text-cyber-blue/80">
              Simple, Transparent Pricing
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyber-blue/50" />
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Choose the Plan That{' '}
            <span className="bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
              Fits Your Business
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Straightforward pricing with no hidden fees. Cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={cn('text-sm font-medium', !isAnnual && 'text-cyber-blue')}>
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-cyber-blue"
            />
            <span className={cn('text-sm font-medium', isAnnual && 'text-cyber-blue')}>
              Annual
            </span>
            {isAnnual && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-md" />
                <Badge variant="secondary" className="relative bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1">
                  <Percent className="w-3 h-3 mr-1" />
                  Save 20%
                </Badge>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={cn(
                  'relative p-8 rounded-2xl border transition-all duration-300',
                  plan.popular
                    ? 'border-cyber-blue bg-gradient-to-b from-cyber-blue/10 to-transparent scale-105 shadow-xl shadow-cyber-blue/10'
                    : 'border-border/50 bg-card/30 hover:border-border'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <motion.div
                      className="relative"
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full blur-md opacity-60" />
                      <Badge className="relative bg-gradient-to-r from-cyber-blue to-cyber-purple text-white border-0 px-4 py-1.5 shadow-lg">
                        <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                        Most Popular
                      </Badge>
                    </motion.div>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={cn(
                    'p-2.5 rounded-xl',
                    plan.popular
                      ? 'bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 border border-cyber-blue/30'
                      : 'bg-muted'
                  )}>
                    <plan.icon className={cn(
                      'w-5 h-5',
                      plan.popular ? 'text-cyber-blue' : 'text-muted-foreground'
                    )} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className={cn(
                      'text-4xl font-bold',
                      plan.popular && 'bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent'
                    )}>
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
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative mb-6"
                  >
                    {/* Animated gradient border for all buttons */}
                    <motion.div
                      className={cn(
                        'absolute -inset-[1px] rounded-lg bg-gradient-to-r opacity-70',
                        plan.popular
                          ? 'from-cyber-blue via-cyber-purple to-cyber-blue'
                          : 'from-cyber-blue/50 via-cyber-purple/50 to-cyber-blue/50'
                      )}
                      animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      style={{ backgroundSize: '200% 100%' }}
                    />
                    <Button
                      className={cn(
                        'relative w-full bg-background hover:bg-background/90 text-foreground border-0',
                        plan.popular && 'font-semibold'
                      )}
                    >
                      <span className="flex items-center gap-2">
                        {plan.cta}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </Button>
                  </motion.div>
                </Link>

                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-sm">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-emerald-500" />
                      </div>
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Plans Include */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            className="mb-4 flex items-center justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-cyber-blue/50" />
            <span className="text-sm font-medium tracking-widest uppercase text-cyber-blue/80">
              Included in Every Plan
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-cyber-blue/50" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-10">All Plans Include</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'SSL Security', icon: Shield, gradient: 'from-emerald-500 to-teal-500' },
              { label: 'Daily Backups', icon: Clock, gradient: 'from-blue-500 to-cyan-500' },
              { label: 'Mobile Responsive', icon: Smartphone, gradient: 'from-violet-500 to-purple-500' },
              { label: '99.9% Uptime', icon: Activity, gradient: 'from-rose-500 to-pink-500' },
              { label: 'Data Export', icon: Download, gradient: 'from-amber-500 to-orange-500' },
              { label: 'GDPR Compliant', icon: Lock, gradient: 'from-cyan-500 to-blue-500' },
              { label: 'Canadian Servers', icon: Server, gradient: 'from-indigo-500 to-violet-500' },
              { label: '24/7 Monitoring', icon: Eye, gradient: 'from-teal-500 to-emerald-500' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-border/30 bg-card/20 hover:bg-card/40 hover:border-border/50 transition-all duration-300"
              >
                <motion.div
                  className={`p-2.5 rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <item.icon className="w-5 h-5 text-white" />
                </motion.div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Elegant FAQ tagline */}
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-violet-500/50" />
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20">
                <HelpCircle className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-sm font-medium tracking-widest uppercase text-violet-400">
                  FAQ
                </span>
              </div>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-violet-500/50" />
            </div>
            <h2 className="text-3xl font-bold">Common Questions</h2>
          </motion.div>

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
