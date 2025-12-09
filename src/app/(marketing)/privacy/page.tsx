'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sections = [
  {
    title: '1. Introduction',
    content: `EXPIRD ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our web-based platform for tracking expired and terminated MLS listings (the "Service").

By using the Service, you consent to the data practices described in this policy. If you do not agree with our policies and practices, please do not use the Service.

This policy complies with Canada's Personal Information Protection and Electronic Documents Act (PIPEDA) and the General Data Protection Regulation (GDPR) for users in the European Union.`,
  },
  {
    title: '2. Information We Collect',
    content: `We collect information in several ways:

Personal Information You Provide:
- Account information: name, email address, phone number
- Payment information: credit card details (processed securely by Stripe)
- Professional information: real estate license details, brokerage affiliation
- Communications: messages you send us through our contact form or support channels

Information Automatically Collected:
- Device information: browser type, operating system, device identifiers
- Usage data: pages visited, features used, time spent on the Service
- Log data: IP address, access times, referring URLs
- Cookies and similar technologies: session data, preferences

Listing Data You Input:
- Property addresses and details
- Owner contact information
- Notes and follow-up schedules
- Pipeline and status information`,
  },
  {
    title: '3. How We Use Your Information',
    content: `We use the information we collect to:

Provide and Improve the Service:
- Create and manage your account
- Process your subscription payments
- Deliver the features and functionality you request
- Analyze usage patterns to improve the Service
- Provide customer support

Communications:
- Send transactional emails (receipts, password resets, etc.)
- Send service updates and announcements
- Respond to your inquiries and requests

Legal and Security Purposes:
- Comply with legal obligations
- Enforce our Terms of Service
- Protect against fraud and unauthorized access
- Maintain the security of our systems

We do NOT use your information for:
- Selling to third parties
- Targeted advertising from external networks
- Purposes unrelated to the Service`,
  },
  {
    title: '4. Information Sharing and Disclosure',
    content: `We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:

Service Providers:
We work with trusted third-party service providers who help us operate the Service:
- Stripe: Payment processing
- Supabase: Database and authentication services
- Vercel: Hosting and infrastructure
- Analytics providers: Usage analysis (anonymized data only)

These providers are contractually obligated to protect your information and use it only for the purposes we specify.

Legal Requirements:
We may disclose your information if required by law or in response to:
- Valid legal processes (subpoenas, court orders)
- Government requests
- Protection of our rights, property, or safety
- Protection of users or the public

Business Transfers:
In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business assets. We will notify you of any such change.`,
  },
  {
    title: '5. Data Security',
    content: `We implement robust security measures to protect your information:

Technical Safeguards:
- SSL/TLS encryption for all data transmission
- Encrypted database storage
- Secure authentication protocols
- Regular security audits and updates

Operational Safeguards:
- Limited employee access to personal data
- Security training for staff
- Incident response procedures
- Regular backup and disaster recovery testing

Infrastructure:
- Data hosted on secure Canadian servers
- Enterprise-grade cloud security (Supabase, Vercel)
- 99.9% uptime guarantee

While we strive to protect your information, no method of transmission or storage is 100% secure. We cannot guarantee absolute security, and you use the Service at your own risk.`,
  },
  {
    title: '6. Data Retention',
    content: `We retain your information for as long as necessary to provide the Service and fulfill the purposes described in this policy:

Active Accounts:
- Your data is retained while your account is active
- Transaction records are kept for 7 years for legal/tax purposes

Account Cancellation:
- After cancellation, your data is retained for 30 days in case you reactivate
- After 30 days, personal data is permanently deleted
- Anonymized usage data may be retained for analytics

Data Deletion Requests:
- You may request deletion of your data at any time
- We will process deletion requests within 30 days
- Some data may be retained as required by law`,
  },
  {
    title: '7. Your Privacy Rights',
    content: `Depending on your location, you may have the following rights:

Access and Portability:
- Request a copy of your personal data
- Receive your data in a portable format

Correction:
- Request correction of inaccurate information
- Update your account information at any time

Deletion:
- Request deletion of your personal data
- Delete your account through settings

Restriction and Objection:
- Restrict processing of your data
- Object to certain types of processing

Withdrawal of Consent:
- Withdraw consent for data processing at any time
- This does not affect prior lawful processing

To exercise any of these rights, please contact us at privacy@expird.ca. We will respond to your request within 30 days.`,
  },
  {
    title: '8. Cookies and Tracking Technologies',
    content: `We use cookies and similar technologies to enhance your experience:

Essential Cookies:
- Required for the Service to function
- Session management and authentication
- Cannot be disabled

Functional Cookies:
- Remember your preferences
- Improve user experience
- Can be disabled in your browser

Analytics Cookies:
- Help us understand how users interact with the Service
- Anonymized data collection
- Can be disabled

Managing Cookies:
You can control cookies through your browser settings. Note that disabling certain cookies may affect the functionality of the Service.

We do not use cookies for third-party advertising or cross-site tracking.`,
  },
  {
    title: '9. Third-Party Links',
    content: `The Service may contain links to third-party websites or services that are not operated by us. This Privacy Policy does not apply to third-party sites.

We are not responsible for the privacy practices of third-party websites. We encourage you to review the privacy policies of any third-party sites you visit.

Third-party services we integrate with have their own privacy policies:
- Stripe: https://stripe.com/privacy
- Supabase: https://supabase.com/privacy
- Vercel: https://vercel.com/legal/privacy-policy`,
  },
  {
    title: '10. International Data Transfers',
    content: `Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws.

For users in the European Union:
- We ensure appropriate safeguards for data transfers
- Transfers are made under Standard Contractual Clauses or equivalent mechanisms

For users in Canada:
- Your data is primarily stored on Canadian servers
- Cross-border transfers comply with PIPEDA requirements

By using the Service, you consent to the transfer of your information as described in this policy.`,
  },
  {
    title: '11. Children\'s Privacy',
    content: `The Service is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children under 18.

If we become aware that we have collected personal information from a child under 18, we will take steps to delete that information as quickly as possible.

If you believe we have collected information from a child under 18, please contact us immediately at privacy@expird.ca.`,
  },
  {
    title: '12. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of any material changes by:

- Posting the new policy on this page
- Updating the "Last updated" date
- Sending you an email notification (for material changes)

We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.

Your continued use of the Service after any changes indicates your acceptance of the updated policy.`,
  },
  {
    title: '13. Contact Us',
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

Privacy Officer
Email: privacy@expird.ca
General Inquiries: support@expird.ca
Website: www.expird.ca/contact

EXPIRD
British Columbia, Canada

For data protection inquiries from the EU, you may also contact your local supervisory authority.

We will respond to all privacy-related inquiries within 30 days.`,
  },
];

export default function PrivacyPage() {
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
              <Shield className="w-3.5 h-3.5 text-white" />
            </span>
            <span className="text-sm font-medium bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
              Your Privacy Matters
            </span>
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Privacy{' '}
            <span className="bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
              Policy
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            We are committed to protecting your personal information and being transparent about how we use it.
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
          {/* Quick Summary */}
          <motion.div
            className="mb-12 p-6 rounded-2xl border border-border/50 bg-gradient-to-br from-cyber-blue/5 to-cyber-purple/5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-lg font-bold mb-4">Privacy at a Glance</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-cyber-blue mt-1">&#10003;</span>
                <span>We never sell your personal data to third parties</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-blue mt-1">&#10003;</span>
                <span>Your data is encrypted and stored securely on Canadian servers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-blue mt-1">&#10003;</span>
                <span>You can request deletion of your data at any time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-blue mt-1">&#10003;</span>
                <span>We comply with PIPEDA and GDPR regulations</span>
              </li>
            </ul>
          </motion.div>

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
            className="mt-16 pt-8 border-t border-border/50 flex flex-wrap gap-4"
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
            <Link href="/terms">
              <Button variant="ghost" className="gap-2">
                View Terms of Service
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
