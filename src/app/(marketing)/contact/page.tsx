'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import {
  Mail,
  Send,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Zap,
  MessageCircle,
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Background effects */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <motion.div
          className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-cyber-blue/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyber-purple/10 rounded-full blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <motion.div
          className="relative max-w-4xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} className="mb-6">
            <motion.div
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyber-blue/10 via-cyber-purple/10 to-cyber-blue/10 border border-white/10 shadow-lg shadow-cyber-blue/5"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-cyber-blue to-cyber-purple">
                <MessageCircle className="w-3.5 h-3.5 text-white" />
              </span>
              <span className="text-sm font-medium bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
                We&apos;re Here to Help
              </span>
            </motion.div>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            variants={fadeInUp}
          >
            Get in{' '}
            <span className="bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
              Touch
            </span>
          </motion.h1>

          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            Have questions about EXPIRD? We&apos;re real estate agents too, and we&apos;re
            happy to help you get the most out of our platform.
          </motion.p>

          {/* Divider */}
          <motion.div
            className="flex items-center justify-center gap-4 mt-8"
            variants={fadeInUp}
          >
            <motion.div
              className="h-px w-24 bg-gradient-to-r from-transparent via-cyber-blue/50 to-cyber-blue"
              initial={{ scaleX: 0, originX: 1 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            <motion.div
              className="flex items-center gap-1.5"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5, type: 'spring' }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-cyber-blue/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-cyber-blue to-cyber-purple shadow-lg shadow-cyber-blue/30" />
              <div className="w-1.5 h-1.5 rounded-full bg-cyber-purple/60" />
            </motion.div>
            <motion.div
              className="h-px w-24 bg-gradient-to-l from-transparent via-cyber-purple/50 to-cyber-purple"
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Email */}
            <motion.a
              href="mailto:support@expird.ca"
              variants={fadeInUp}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group p-5 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm transition-all duration-300 hover:border-cyber-blue/50 hover:bg-card/50"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Email Us</p>
                  <p className="font-medium text-sm group-hover:text-cyber-blue transition-colors">support@expird.ca</p>
                </div>
              </div>
            </motion.a>

            {/* Response Time */}
            <motion.div
              variants={fadeInUp}
              className="p-5 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 shrink-0">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Response Time</p>
                  <p className="font-medium text-sm">Within 4 hours</p>
                </div>
              </div>
            </motion.div>

            {/* Location */}
            <motion.div
              variants={fadeInUp}
              className="p-5 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Location</p>
                  <p className="font-medium text-sm">Fraser Valley, BC</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-2xl border border-border/50 bg-gradient-to-b from-card/50 to-card/30 backdrop-blur-sm overflow-hidden shadow-xl shadow-black/10">
              {/* Background glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyber-blue/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyber-purple/5 rounded-full blur-3xl" />

              <div className="relative p-8 sm:p-10">
                {isSubmitted ? (
                  <motion.div
                    className="text-center py-8"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.div
                      className="inline-flex p-5 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 mb-6 ring-4 ring-green-500/10"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                    >
                      <CheckCircle2 className="w-12 h-12 text-green-500" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-3">Message Sent!</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                      Thank you for reaching out. We typically respond within 4 hours during business hours.
                    </p>
                    <Button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({ name: '', email: '', subject: '', message: '' });
                      }}
                      variant="outline"
                      className="gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <>
                    {/* Header with icon */}
                    <div className="text-center mb-8">
                      <motion.div
                        className="inline-flex p-3 rounded-xl bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 mb-4 ring-1 ring-white/10"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Send className="w-6 h-6 text-cyber-blue" />
                      </motion.div>
                      <h2 className="text-2xl font-bold mb-2">Send Us a Message</h2>
                      <p className="text-muted-foreground text-sm">
                        Fill out the form below and we&apos;ll get back to you shortly.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <motion.div
                          className="space-y-2"
                          whileFocus={{ scale: 1.01 }}
                        >
                          <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                            Name
                          </Label>
                          <div className="relative group">
                            <Input
                              id="name"
                              name="name"
                              placeholder="Your name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              className="h-11 bg-background/50 border-border/50 focus:border-cyber-blue focus:ring-2 focus:ring-cyber-blue/20 transition-all duration-200 placeholder:text-muted-foreground/50"
                            />
                            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 opacity-0 group-focus-within:opacity-100 -z-10 blur-sm transition-opacity" />
                          </div>
                        </motion.div>
                        <motion.div
                          className="space-y-2"
                          whileFocus={{ scale: 1.01 }}
                        >
                          <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                            Email
                          </Label>
                          <div className="relative group">
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="you@example.com"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="h-11 bg-background/50 border-border/50 focus:border-cyber-blue focus:ring-2 focus:ring-cyber-blue/20 transition-all duration-200 placeholder:text-muted-foreground/50"
                            />
                            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 opacity-0 group-focus-within:opacity-100 -z-10 blur-sm transition-opacity" />
                          </div>
                        </motion.div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
                        <div className="relative group">
                          <Input
                            id="subject"
                            name="subject"
                            placeholder="How can we help?"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="h-11 bg-background/50 border-border/50 focus:border-cyber-blue focus:ring-2 focus:ring-cyber-blue/20 transition-all duration-200 placeholder:text-muted-foreground/50"
                          />
                          <div className="absolute inset-0 rounded-md bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 opacity-0 group-focus-within:opacity-100 -z-10 blur-sm transition-opacity" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-sm font-medium">Message</Label>
                        <div className="relative group">
                          <Textarea
                            id="message"
                            name="message"
                            placeholder="Tell us more about your inquiry..."
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={5}
                            className="bg-background/50 border-border/50 focus:border-cyber-blue focus:ring-2 focus:ring-cyber-blue/20 transition-all duration-200 resize-none placeholder:text-muted-foreground/50"
                          />
                          <div className="absolute inset-0 rounded-md bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 opacity-0 group-focus-within:opacity-100 -z-10 blur-sm transition-opacity" />
                        </div>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Button
                          type="submit"
                          size="lg"
                          className="w-full btn-glow h-12 mt-2"
                          disabled={isSubmitting}
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4" />
                                Send Message
                              </>
                            )}
                          </span>
                        </Button>
                      </motion.div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Business Hours Note */}
          <motion.div
            className="mt-6 flex items-center justify-center gap-3 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Clock className="w-4 h-4" />
            <span>Business hours: Monday - Friday, 9am - 5pm PST</span>
          </motion.div>
        </div>
      </section>

      {/* FAQ CTA Section */}
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

            <div className="relative flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">
                  Need a Quick Answer?
                </h2>
                <p className="text-muted-foreground text-sm">
                  Check out our FAQ for instant answers to common questions about EXPIRD.
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <Link href="/faq">
                  <Button className="btn-glow h-11 px-6">
                    <span className="relative z-10 flex items-center gap-2">
                      View FAQ
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
