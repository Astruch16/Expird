'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  ArrowRight,
  HelpCircle,
  ChevronDown,
  MessageCircle,
} from 'lucide-react';

const faqCategories = [
  {
    name: 'Getting Started',
    faqs: [
      {
        question: 'What is EXPIRD?',
        answer: 'EXPIRD is a comprehensive platform designed specifically for Canadian realtors to track, manage, and convert expired and terminated MLS listings. It provides tools like interactive maps, pipeline management, follow-up reminders, and analytics to help you close more deals.',
      },
      {
        question: 'Who is EXPIRD for?',
        answer: 'EXPIRD is built exclusively for licensed real estate agents in Canada, particularly those working in Greater Vancouver, Fraser Valley, and Chilliwack regions. Whether you\'re a new agent or an experienced professional, EXPIRD helps you tap into the expired listings market.',
      },
      {
        question: 'How do I get started?',
        answer: 'Simply sign up for a free 14-day trial. No credit card required! Once you\'re in, you can start adding listings manually or import them via CSV. Our guided tour will walk you through all the features.',
      },
      {
        question: 'Is there a mobile app?',
        answer: 'EXPIRD is a fully responsive web application that works beautifully on mobile devices. Simply access it through your mobile browser. A dedicated mobile app is on our roadmap.',
      },
    ],
  },
  {
    name: 'Features & Functionality',
    faqs: [
      {
        question: 'How does the interactive map work?',
        answer: 'Our dark-themed map displays all your listings with color-coded markers (red for expired, purple for terminated, green for back-to-active). You can filter by board (GV, Fraser Valley, Chilliwack), city, and neighborhood. Clusters help manage dense areas, and clicking any marker shows listing details.',
      },
      {
        question: 'Can I import listings in bulk?',
        answer: 'Yes! Professional and Team plans include bulk CSV import. Simply export your listings from your source and import them into EXPIRD. We\'ll automatically geocode addresses and organize them for you.',
      },
      {
        question: 'How do follow-up reminders work?',
        answer: 'You can schedule follow-up dates for any listing. These appear on your dashboard with visual indicators for overdue (red), due today (amber), and upcoming (blue). Mark them complete with one click when you\'ve followed up.',
      },
      {
        question: 'What boards/regions do you cover?',
        answer: 'Currently, EXPIRD supports Greater Vancouver (REBGV), Fraser Valley (FVREB), and Chilliwack (CADREB) real estate boards. We have comprehensive neighborhood data for all cities in these regions.',
      },
    ],
  },
  {
    name: 'Pricing & Billing',
    faqs: [
      {
        question: 'How much does EXPIRD cost?',
        answer: 'We offer three plans: Starter ($29.99/month), Professional ($49.99/month), and Team ($99.99/month). Annual billing saves you 20%. All plans include a 14-day free trial with no credit card required.',
      },
      {
        question: 'Can I try before I buy?',
        answer: 'Absolutely! Every plan comes with a 14-day free trial. No credit card required to start. You\'ll have full access to all features during your trial period.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, Mastercard, American Express) through our secure Stripe payment processor. All prices are in Canadian Dollars (CAD).',
      },
      {
        question: 'Can I cancel anytime?',
        answer: 'Yes, you can cancel your subscription at any time. Monthly plans cancel immediately at the end of your billing period. Annual plans can be cancelled with a prorated refund for unused months.',
      },
      {
        question: 'What happens to my data if I cancel?',
        answer: 'After cancellation, your account is paused and your data is retained for 30 days. You can reactivate anytime within this period. After 30 days, your data is permanently deleted.',
      },
    ],
  },
  {
    name: 'Security & Privacy',
    faqs: [
      {
        question: 'Is my data secure?',
        answer: 'Yes! We use industry-standard SSL encryption for all data transfer. Our servers are hosted in Canada with enterprise-grade security. We perform daily backups and maintain 99.9% uptime.',
      },
      {
        question: 'Do you share my data?',
        answer: 'No, we never sell or share your personal data or listing information with third parties. Your data belongs to you. See our Privacy Policy for complete details.',
      },
      {
        question: 'Are you GDPR/PIPEDA compliant?',
        answer: 'Yes, we comply with both GDPR (for any EU users) and Canada\'s PIPEDA privacy legislation. You have full control over your data and can request export or deletion at any time.',
      },
    ],
  },
  {
    name: 'Support',
    faqs: [
      {
        question: 'How can I get help?',
        answer: 'All plans include email support. Professional and Team plans include priority support with faster response times. Team plans also include phone support and custom onboarding.',
      },
      {
        question: 'Do you offer training?',
        answer: 'We offer a comprehensive guided tour for new users, help documentation, and video tutorials. Team plan subscribers also receive custom onboarding sessions.',
      },
      {
        question: 'How do I report a bug or request a feature?',
        answer: 'You can contact us at support@expird.ca with any bug reports or feature requests. We actively incorporate user feedback into our development roadmap.',
      },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Background effects */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
            <HelpCircle className="w-3.5 h-3.5 mr-1.5" />
            FAQ
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about EXPIRD. Can&apos;t find what you&apos;re looking for? Contact our support team.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {faqCategories.map((category) => (
            <div key={category.name} className="mb-12">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-gradient-to-b from-primary to-accent rounded-full" />
                {category.name}
              </h2>
              <div className="space-y-3">
                {category.faqs.map((faq, index) => {
                  const itemKey = `${category.name}-${index}`;
                  const isOpen = openItems[itemKey];
                  return (
                    <div
                      key={itemKey}
                      className="border border-border/50 rounded-xl overflow-hidden bg-card/30 backdrop-blur-sm"
                    >
                      <button
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
                        onClick={() => toggleItem(itemKey)}
                      >
                        <span className="font-medium pr-4">{faq.question}</span>
                        <ChevronDown
                          className={cn(
                            'w-5 h-5 text-muted-foreground shrink-0 transition-transform',
                            isOpen && 'rotate-180'
                          )}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 pt-0">
                          <p className="text-muted-foreground">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex p-4 rounded-full bg-primary/10 mb-6">
            <MessageCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Our support team is here to help. Reach out and we&apos;ll get back to you as soon as possible.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="mailto:support@expird.ca">
              <Button size="lg" className="h-12 px-8">
                Contact Support
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="h-12 px-8">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
