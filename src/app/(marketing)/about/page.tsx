'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogoAnimated } from '@/components/ui/logo';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Heart,
  Target,
  Users,
  Lightbulb,
  MapPin,
  Sparkles,
  Handshake,
  TrendingUp,
  Map,
  Database,
  Shield,
  Zap,
  Clock,
  CheckCircle2,
  Building2,
} from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Built by Agents',
    description: 'We\'re realtors ourselves. We built EXPIRD because we needed it, and we know you do too.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Lightbulb,
    title: 'Simplicity First',
    description: 'Powerful doesn\'t have to mean complicated. We believe in intuitive design that just works.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Users,
    title: 'Your Success Matters',
    description: 'Your success is our success. We\'re here to help you close more deals, not just sell software.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Heart,
    title: 'Crafted with Care',
    description: 'We obsess over the details. From smooth animations to thoughtful UX, we care about your experience.',
    gradient: 'from-rose-500 to-pink-500',
  },
];

const milestones = [
  { year: '2024', event: 'EXPIRD founded by local agents in the Fraser Valley', icon: Sparkles },
  { year: '2024', event: 'Built core platform: listings, map view & pipeline tracking', icon: Building2 },
  { year: '2024', event: 'Added support for GV, Fraser Valley & Chilliwack MLS boards', icon: Map },
  { year: '2025', event: 'Continuous improvements driven by agent feedback', icon: TrendingUp },
];

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

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background effects */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <motion.div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/15 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.2, 0.15] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/15 rounded-full blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.15, 0.2, 0.15] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <motion.div
          className="relative max-w-4xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div
            className="flex justify-center mb-8"
            variants={fadeInUp}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <LogoAnimated size="xl" />
            </motion.div>
          </motion.div>

          {/* Elegant tagline */}
          <motion.div
            className="mb-6 flex items-center justify-center gap-3"
            variants={fadeInUp}
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/50" />
            <span className="text-sm font-medium tracking-widest uppercase text-primary/80">
              Our Story
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/50" />
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl font-bold tracking-tight mb-6"
            variants={fadeInUp}
          >
            Built by{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Agents
            </span>
            , For{' '}
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Agents
            </span>
          </motion.h1>

          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
            variants={fadeInUp}
          >
            We understand the challenges of prospecting expired listings because we&apos;ve lived them.
            EXPIRD was born from a simple idea: realtors deserve better tools to convert these golden opportunities.
          </motion.p>

          {/* Location badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 border border-border/50"
            variants={fadeInUp}
          >
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Proudly built in the Fraser Valley, BC</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-4 flex items-center gap-3">
                <Handshake className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-medium tracking-widest uppercase text-emerald-500/80">
                  Our Mission
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Empowering Canadian Realtors to{' '}
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  Thrive
                </span>
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Every year, thousands of listings expire or get terminated in the Greater Vancouver, Fraser Valley,
                and Chilliwack markets. These represent homeowners who still need to sell—and realtors who can help them.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                As active agents ourselves, we built EXPIRD to solve our own frustrations with tracking expired listings.
                We believe that with the right platform, any realtor can build a successful business around these untapped opportunities.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: '3', label: 'MLS Boards' },
                  { value: '1000s', label: 'Listings Tracked' },
                  { value: '24/7', label: 'Data Updates' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center p-4 rounded-xl bg-card/30 border border-border/50"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Fraser Valley Features Grid */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <MapPin className="w-5 h-5 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold">Fraser Valley Born & Built</h3>
                </div>

                {[
                  { icon: Map, text: 'Deep knowledge of GV, Fraser Valley & Chilliwack markets', gradient: 'from-emerald-500 to-teal-500', delay: 0 },
                  { icon: Database, text: 'Local MLS data from boards we work with daily', gradient: 'from-blue-500 to-cyan-500', delay: 0.1 },
                  { icon: Shield, text: 'Built with Canadian privacy standards in mind', gradient: 'from-violet-500 to-purple-500', delay: 0.2 },
                  { icon: Zap, text: 'Fast, responsive design for agents on the go', gradient: 'from-amber-500 to-orange-500', delay: 0.3 },
                  { icon: Clock, text: 'Real-time updates when listings expire', gradient: 'from-rose-500 to-pink-500', delay: 0.4 },
                  { icon: CheckCircle2, text: 'Built to scale with your business', gradient: 'from-green-500 to-emerald-500', delay: 0.5 },
                ].map((item, index) => (
                  <motion.div
                    key={item.text}
                    className="group flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-border hover:bg-card/50 transition-all duration-300"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: item.delay, duration: 0.4 }}
                    whileHover={{ x: 8, transition: { duration: 0.2 } }}
                  >
                    <motion.div
                      className={`p-2.5 rounded-xl bg-gradient-to-br ${item.gradient} shrink-0 shadow-lg`}
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <item.icon className="w-5 h-5 text-white" />
                    </motion.div>
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {item.text}
                    </span>
                    <motion.div
                      className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/50" />
              <Heart className="w-5 h-5 text-rose-500" />
              <span className="text-sm font-medium tracking-widest uppercase text-rose-500/80">
                Our Values
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/50" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">What We Believe In</h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                variants={fadeInUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group relative p-6 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card/50"
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className={`p-3 rounded-xl bg-gradient-to-br ${value.gradient} shrink-0`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <value.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                </div>
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />

        <div className="relative max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-500/50" />
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium tracking-widest uppercase text-amber-500/80">
                Our Journey
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-500/50" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">Key Milestones</h2>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-primary/20" />

            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  className="relative flex items-start gap-6 pl-20"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Timeline dot */}
                  <motion.div
                    className="absolute left-5 top-4 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center border-2 border-background shadow-lg shadow-primary/25"
                    whileHover={{ scale: 1.2 }}
                  >
                    <milestone.icon className="w-3 h-3 text-white" />
                  </motion.div>

                  <motion.div
                    className="flex-1 p-5 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-border hover:bg-card/50 transition-all duration-300"
                    whileHover={{ x: 5 }}
                  >
                    <div className="text-sm text-primary font-semibold mb-1">{milestone.year}</div>
                    <div className="text-foreground">{milestone.event}</div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Join the Community
            </span>
            ?
          </h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
            Join hundreds of Canadian realtors who are already using EXPIRD to close more deals from expired listings.
          </p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/signup">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" className="btn-glow h-12 px-8 text-base group">
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </motion.div>
            </Link>
            <Link href="/features">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                  Explore Features
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
