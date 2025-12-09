'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  HelpCircle,
  ChevronDown,
  MessageCircle,
  Sparkles,
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
        answer: 'Simply choose a plan and sign up. Once you\'re in, you can start adding listings manually or import them via CSV. Our guided tour will walk you through all the features.',
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
        answer: 'Our interactive heat map displays all your listings with color-coded markers (red for expired, purple for terminated, green for back-to-active). You can filter by board (GV, Fraser Valley, Chilliwack), city, and neighborhood. Clusters help manage dense areas, and clicking any marker shows listing details.',
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
        answer: 'We offer three plans: Starter ($29.99/month), Professional ($49.99/month), and Team ($99.99/month). Annual billing saves you 20%. Cancel anytime.',
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
        <motion.div
          className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyber-blue/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyber-purple/10 rounded-full blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <motion.div
          className="relative max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyber-blue/10 via-cyber-purple/10 to-cyber-blue/10 border border-white/10 shadow-lg shadow-cyber-blue/5 mb-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-cyber-blue to-cyber-purple">
              <HelpCircle className="w-3.5 h-3.5 text-white" />
            </span>
            <span className="text-sm font-medium bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Got{' '}
            <span className="bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
              Questions?
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Find answers to common questions about EXPIRD. Can&apos;t find what you&apos;re looking for? Contact our support team.
          </p>

          {/* Divider */}
          <motion.div
            className="flex items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-cyber-blue/50 to-cyber-blue" />
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-cyber-blue/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-cyber-blue to-cyber-purple" />
              <div className="w-1.5 h-1.5 rounded-full bg-cyber-purple/60" />
            </div>
            <div className="h-px w-24 bg-gradient-to-l from-transparent via-cyber-purple/50 to-cyber-purple" />
          </motion.div>
        </motion.div>
      </section>

      {/* FAQ Sections */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {faqCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.name}
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <div className="w-1.5 h-6 bg-gradient-to-b from-cyber-blue to-cyber-purple rounded-full" />
                <span>{category.name}</span>
                <div className="flex-1 h-px bg-gradient-to-r from-border/50 to-transparent ml-2" />
              </h2>
              <div className="space-y-3">
                {category.faqs.map((faq, index) => {
                  const itemKey = `${category.name}-${index}`;
                  const isOpen = openItems[itemKey];
                  return (
                    <motion.div
                      key={itemKey}
                      className={cn(
                        'border rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300',
                        isOpen
                          ? 'border-cyber-blue/30 bg-gradient-to-br from-cyber-blue/5 to-cyber-purple/5 shadow-lg shadow-cyber-blue/5'
                          : 'border-border/50 bg-card/30 hover:border-border hover:bg-card/50'
                      )}
                      initial={false}
                      layout
                    >
                      <motion.button
                        className="w-full flex items-center justify-between p-5 text-left transition-colors"
                        onClick={() => toggleItem(itemKey)}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className={cn(
                          'font-medium pr-4 transition-colors',
                          isOpen && 'text-cyber-blue'
                        )}>
                          {faq.question}
                        </span>
                        <motion.div
                          className={cn(
                            'flex items-center justify-center w-8 h-8 rounded-full shrink-0 transition-colors',
                            isOpen
                              ? 'bg-gradient-to-br from-cyber-blue to-cyber-purple'
                              : 'bg-muted/50'
                          )}
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <ChevronDown
                            className={cn(
                              'w-4 h-4 transition-colors',
                              isOpen ? 'text-white' : 'text-muted-foreground'
                            )}
                          />
                        </motion.div>
                      </motion.button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <motion.div
                              className="px-5 pb-5 pt-0"
                              initial={{ y: -10 }}
                              animate={{ y: 0 }}
                              exit={{ y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="h-px w-full bg-gradient-to-r from-cyber-blue/20 via-cyber-purple/20 to-transparent mb-4" />
                              <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative p-8 sm:p-10 rounded-2xl border border-border/50 bg-gradient-to-br from-cyber-blue/5 to-cyber-purple/5 backdrop-blur-sm overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyber-blue/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyber-purple/10 rounded-full blur-3xl" />

            <div className="relative text-center">
              <motion.div
                className="inline-flex p-4 rounded-xl bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 mb-6 ring-1 ring-white/10"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="w-8 h-8 text-cyber-blue" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Our support team is here to help. Reach out and we&apos;ll get back to you as soon as possible.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/contact">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" className="btn-glow h-12 px-8">
                      <span className="relative z-10 flex items-center gap-2">
                        Contact Support
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/pricing">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" size="lg" className="h-12 px-8">
                      View Pricing
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
