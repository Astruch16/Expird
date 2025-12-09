'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using EXPIRD ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service.

These Terms apply to all users, including visitors, registered users, and subscribers. We may update these Terms from time to time, and your continued use of the Service after such changes constitutes acceptance of the new Terms.`,
  },
  {
    title: '2. Description of Service',
    content: `EXPIRD is a web-based platform designed to help licensed real estate agents in Canada track, manage, and convert expired and terminated MLS listings. The Service includes features such as:

- Listing management and tracking
- Interactive map visualization
- Pipeline and workflow management
- Follow-up reminders and scheduling
- Analytics and reporting
- Data import and export capabilities

The Service is intended for use by licensed real estate professionals only.`,
  },
  {
    title: '3. Account Registration',
    content: `To use certain features of the Service, you must create an account. When registering, you agree to:

- Provide accurate, current, and complete information
- Maintain and update your information to keep it accurate
- Keep your password secure and confidential
- Accept responsibility for all activities under your account
- Notify us immediately of any unauthorized use

You must be at least 18 years old and a licensed real estate agent in Canada to create an account. We reserve the right to suspend or terminate accounts that violate these Terms.`,
  },
  {
    title: '4. Subscription and Payments',
    content: `EXPIRD offers subscription-based access to the Service. By subscribing, you agree to:

- Pay all fees associated with your chosen plan
- Provide valid payment information
- Authorize recurring charges for subscription renewals

All prices are in Canadian Dollars (CAD) and are subject to applicable taxes. Subscription fees are billed in advance on a monthly or annual basis, depending on your chosen plan.

You may cancel your subscription at any time. Monthly subscriptions will remain active until the end of the current billing period. Annual subscriptions may be eligible for a prorated refund for unused months.`,
  },
  {
    title: '5. Acceptable Use',
    content: `You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to:

- Use the Service for any illegal or unauthorized purpose
- Violate any applicable laws, regulations, or third-party rights
- Attempt to gain unauthorized access to the Service or its systems
- Interfere with or disrupt the Service or servers
- Use automated systems to access the Service without permission
- Share your account credentials with others
- Reverse engineer, decompile, or disassemble the Service
- Use the Service to send spam or unsolicited communications
- Upload malicious code or content

We reserve the right to investigate and take appropriate action against anyone who violates these Terms.`,
  },
  {
    title: '6. Data and Privacy',
    content: `Your use of the Service is also governed by our Privacy Policy, which describes how we collect, use, and protect your information. By using the Service, you consent to our data practices as described in the Privacy Policy.

You retain ownership of any data you input into the Service. You grant us a limited license to use, store, and process your data solely to provide the Service to you.

We implement industry-standard security measures to protect your data, but we cannot guarantee absolute security. You are responsible for maintaining the confidentiality of your account credentials.`,
  },
  {
    title: '7. Intellectual Property',
    content: `The Service and its original content, features, and functionality are owned by EXPIRD and are protected by Canadian and international copyright, trademark, and other intellectual property laws.

You may not copy, modify, distribute, sell, or lease any part of the Service without our prior written consent. The EXPIRD name, logo, and all related names, logos, and slogans are trademarks of EXPIRD.

Any feedback, suggestions, or ideas you provide about the Service may be used by us without any obligation to you.`,
  },
  {
    title: '8. Third-Party Services',
    content: `The Service may integrate with or contain links to third-party services, including but not limited to:

- Payment processors (Stripe)
- Analytics services
- Authentication providers

These third-party services are governed by their own terms and privacy policies. We are not responsible for the content, practices, or availability of third-party services.`,
  },
  {
    title: '9. Disclaimer of Warranties',
    content: `THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:

- MERCHANTABILITY
- FITNESS FOR A PARTICULAR PURPOSE
- NON-INFRINGEMENT
- ACCURACY OR COMPLETENESS OF CONTENT

We do not warrant that the Service will be uninterrupted, secure, or error-free. We do not guarantee the accuracy of any listing data or information provided through the Service.`,
  },
  {
    title: '10. Limitation of Liability',
    content: `TO THE FULLEST EXTENT PERMITTED BY LAW, EXPIRD SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:

- Loss of profits, revenue, or data
- Business interruption
- Loss of goodwill
- Any other intangible losses

Our total liability for any claims arising from these Terms or your use of the Service shall not exceed the amount you paid to us in the twelve (12) months preceding the claim.`,
  },
  {
    title: '11. Indemnification',
    content: `You agree to indemnify, defend, and hold harmless EXPIRD, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:

- Your use of the Service
- Your violation of these Terms
- Your violation of any third-party rights
- Any content you submit to the Service`,
  },
  {
    title: '12. Termination',
    content: `We may terminate or suspend your account and access to the Service at our sole discretion, without notice, for conduct that we believe:

- Violates these Terms
- Is harmful to other users or the Service
- Is otherwise objectionable

Upon termination, your right to use the Service will immediately cease. All provisions of these Terms that should survive termination will survive, including ownership provisions, warranty disclaimers, and limitations of liability.`,
  },
  {
    title: '13. Governing Law',
    content: `These Terms shall be governed by and construed in accordance with the laws of the Province of British Columbia and the federal laws of Canada applicable therein, without regard to conflict of law principles.

Any disputes arising from these Terms or your use of the Service shall be resolved in the courts of British Columbia, Canada. You consent to the exclusive jurisdiction of such courts.`,
  },
  {
    title: '14. Changes to Terms',
    content: `We reserve the right to modify these Terms at any time. We will notify you of material changes by posting a notice on our website or sending you an email.

Your continued use of the Service after any changes indicates your acceptance of the new Terms. If you do not agree to the modified Terms, you should discontinue use of the Service.`,
  },
  {
    title: '15. Contact Information',
    content: `If you have any questions about these Terms of Service, please contact us at:

Email: legal@expird.ca
Website: www.expird.ca/contact

EXPIRD
British Columbia, Canada`,
  },
];

export default function TermsPage() {
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
              <FileText className="w-3.5 h-3.5 text-white" />
            </span>
            <span className="text-sm font-medium bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
              Legal
            </span>
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Terms of{' '}
            <span className="bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
              Service
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Please read these terms carefully before using EXPIRD.
          </p>
          <p className="text-sm text-muted-foreground">
            Last updated: December 8, 2025
          </p>

          {/* Divider */}
          <motion.div
            className="flex items-center justify-center gap-4 mt-8"
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

      {/* Content Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              className="mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <div className="w-1.5 h-6 bg-gradient-to-b from-cyber-blue to-cyber-purple rounded-full" />
                <span>{section.title}</span>
              </h2>
              <div className="pl-5 border-l border-border/50">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Back Link */}
          <motion.div
            className="mt-16 pt-8 border-t border-border/50"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
