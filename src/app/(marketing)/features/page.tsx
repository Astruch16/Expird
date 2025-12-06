'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  Map,
  List,
  Send,
  BarChart3,
  Kanban,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Upload,
  Bell,
  Filter,
  Layers,
  Target,
  TrendingUp,
} from 'lucide-react';

const mainFeatures = [
  {
    icon: List,
    title: 'Smart Listing Management',
    description: 'Import, organize, and manage your expired and terminated listings with ease. Powerful search and filtering capabilities help you find exactly what you need.',
    benefits: [
      'Bulk CSV import for quick data entry',
      'Advanced search and filtering',
      'Custom notes and tags',
      'Track owner contact information',
    ],
    gradient: 'from-blue-500 to-cyan-500',
    mockup: 'listings',
  },
  {
    icon: Map,
    title: 'Interactive Map View',
    description: 'Visualize all your listings on a stunning dark-themed map. See clusters, zoom into neighborhoods, and find opportunities at a glance.',
    benefits: [
      'Beautiful dark theme map',
      'Real-time clustering for dense areas',
      'Color-coded by listing type',
      'Filter by board, city, neighborhood',
    ],
    gradient: 'from-emerald-500 to-teal-500',
    mockup: 'map',
  },
  {
    icon: Kanban,
    title: 'Visual Pipeline Board',
    description: 'Track your prospects through every stage of the sales process with our intuitive drag-and-drop kanban board.',
    benefits: [
      'Drag-and-drop interface',
      'Custom pipeline stages',
      'Visual progress tracking',
      'Quick status updates',
    ],
    gradient: 'from-purple-500 to-pink-500',
    mockup: 'pipeline',
  },
  {
    icon: Send,
    title: 'Outreach Tracking',
    description: 'Never lose track of who you\'ve contacted. Log every touchpoint and build a complete history of your outreach efforts.',
    benefits: [
      'Log sent dates and methods',
      'Track response status',
      'Complete contact history',
      'Mark listings as sent',
    ],
    gradient: 'from-orange-500 to-amber-500',
    mockup: 'sent',
  },
  {
    icon: Clock,
    title: 'Follow-up Reminders',
    description: 'The key to converting leads is consistent follow-up. Set reminders and never miss an opportunity again.',
    benefits: [
      'Schedule follow-up dates',
      'Dashboard reminders',
      'Overdue notifications',
      'One-click completion',
    ],
    gradient: 'from-rose-500 to-red-500',
    mockup: 'followups',
  },
  {
    icon: BarChart3,
    title: 'Powerful Analytics',
    description: 'Track your performance with beautiful charts and reports. Identify trends and optimize your approach.',
    benefits: [
      'Conversion rate tracking',
      'Weekly/monthly trends',
      'Performance dashboards',
      'Export reports',
    ],
    gradient: 'from-indigo-500 to-violet-500',
    mockup: 'analytics',
  },
];

const additionalFeatures = [
  {
    icon: Upload,
    title: 'Bulk Import',
    description: 'Import hundreds of listings at once from CSV files.',
  },
  {
    icon: Filter,
    title: 'Advanced Filters',
    description: 'Filter by price, bedrooms, date, status, and more.',
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Get notified about upcoming follow-ups and tasks.',
  },
  {
    icon: Layers,
    title: 'Multi-Board Support',
    description: 'Track listings across GV, Fraser Valley & Chilliwack.',
  },
  {
    icon: Target,
    title: 'Quick Actions',
    description: 'Fast access to common tasks from any screen.',
  },
  {
    icon: TrendingUp,
    title: 'Market Movement',
    description: 'Track when expired listings return to active.',
  },
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

// Feature mockup components
function ListingsMockup() {
  return (
    <div className="absolute inset-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-blue-500/20" />
          <div className="h-4 w-24 bg-muted/50 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-muted/30 rounded" />
          <div className="h-8 w-8 bg-blue-500/30 rounded" />
        </div>
      </div>
      {/* Table */}
      <div className="flex-1 space-y-2">
        <div className="grid grid-cols-5 gap-2 px-2 py-1">
          {['Address', 'City', 'Price', 'Status', 'Actions'].map((h) => (
            <div key={h} className="h-3 bg-muted/40 rounded w-full" />
          ))}
        </div>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="grid grid-cols-5 gap-2 px-2 py-3 bg-card/50 rounded-lg border border-border/30"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <div className="h-3 bg-muted/50 rounded w-3/4" />
            <div className="h-3 bg-muted/40 rounded w-1/2" />
            <div className="h-3 bg-emerald-500/30 rounded w-2/3" />
            <div className={`h-5 rounded-full w-16 ${i % 2 === 0 ? 'bg-rose-500/20' : 'bg-violet-500/20'}`} />
            <div className="flex gap-1">
              <div className="h-6 w-6 bg-primary/20 rounded" />
              <div className="h-6 w-6 bg-muted/30 rounded" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function MapMockup() {
  return (
    <div className="absolute inset-0 bg-[#1a1a2e]">
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(8)].map((_, i) => (
          <div key={`h${i}`} className="absolute border-t border-white/20" style={{ top: `${i * 12.5}%`, left: 0, right: 0 }} />
        ))}
        {[...Array(8)].map((_, i) => (
          <div key={`v${i}`} className="absolute border-l border-white/20" style={{ left: `${i * 12.5}%`, top: 0, bottom: 0 }} />
        ))}
      </div>
      {/* Clusters and markers */}
      <motion.div
        className="absolute top-[25%] left-[35%] w-10 h-10 rounded-full bg-primary/40 flex items-center justify-center"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-6 rounded-full bg-primary/70 flex items-center justify-center text-xs font-bold">9</div>
      </motion.div>
      <motion.div
        className="absolute top-[50%] left-[65%] w-8 h-8 rounded-full bg-primary/40 flex items-center justify-center"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      >
        <div className="w-5 h-5 rounded-full bg-primary/70 flex items-center justify-center text-xs font-bold">5</div>
      </motion.div>
      <motion.div className="absolute top-[40%] left-[25%] w-3 h-3 rounded-full bg-rose-500 shadow-lg shadow-rose-500/50" animate={{ y: [0, -3, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
      <motion.div className="absolute top-[65%] left-[50%] w-3 h-3 rounded-full bg-violet-500 shadow-lg shadow-violet-500/50" animate={{ y: [0, -3, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} />
      <motion.div className="absolute top-[30%] left-[75%] w-3 h-3 rounded-full bg-rose-500 shadow-lg shadow-rose-500/50" animate={{ y: [0, -3, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }} />
      <motion.div className="absolute top-[70%] left-[30%] w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50" animate={{ y: [0, -3, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.9 }} />
      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-card/90 backdrop-blur-sm rounded-lg border border-border px-2 py-1.5 text-xs">
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500" /><span className="text-muted-foreground">12</span></div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-violet-500" /><span className="text-muted-foreground">8</span></div>
      </div>
    </div>
  );
}

function PipelineMockup() {
  const columns = ['New Lead', 'Contacted', 'Meeting', 'Closed'];
  return (
    <div className="absolute inset-4 flex gap-3">
      {columns.map((col, colIndex) => (
        <div key={col} className="flex-1 flex flex-col">
          <div className="text-xs font-medium text-muted-foreground mb-2 truncate">{col}</div>
          <div className="flex-1 bg-muted/20 rounded-lg p-2 space-y-2">
            {[...Array(colIndex === 0 ? 3 : colIndex === 3 ? 1 : 2)].map((_, i) => (
              <motion.div
                key={i}
                className="p-2 bg-card/80 rounded-lg border border-border/40"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + colIndex * 0.1 + i * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="h-2.5 bg-muted/50 rounded w-3/4 mb-1.5" />
                <div className="h-2 bg-muted/30 rounded w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SentMockup() {
  return (
    <div className="absolute inset-4 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Send className="w-5 h-5 text-orange-500/70" />
        <div className="h-4 w-28 bg-muted/50 rounded" />
      </div>
      <div className="flex-1 space-y-3">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-3 p-3 bg-card/50 rounded-lg border border-border/30"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
              <Send className="w-4 h-4 text-orange-500/60" />
            </div>
            <div className="flex-1">
              <div className="h-3 bg-muted/50 rounded w-1/2 mb-1" />
              <div className="h-2 bg-muted/30 rounded w-1/3" />
            </div>
            <div className="h-5 px-2 bg-green-500/20 rounded-full flex items-center">
              <div className="h-2 w-10 bg-green-500/40 rounded" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function FollowupsMockup() {
  return (
    <div className="absolute inset-4 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-rose-500/70" />
        <div className="h-4 w-28 bg-muted/50 rounded" />
      </div>
      <div className="flex-1 space-y-3">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className={`flex items-center gap-3 p-3 rounded-lg border ${i === 0 ? 'bg-rose-500/10 border-rose-500/30' : 'bg-card/50 border-border/30'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i === 0 ? 'bg-rose-500/20' : 'bg-muted/30'}`}>
              <Clock className={`w-4 h-4 ${i === 0 ? 'text-rose-500' : 'text-muted-foreground'}`} />
            </div>
            <div className="flex-1">
              <div className="h-3 bg-muted/50 rounded w-2/3 mb-1" />
              <div className={`h-2 rounded w-1/4 ${i === 0 ? 'bg-rose-500/40' : 'bg-muted/30'}`} />
            </div>
            <div className="h-6 w-6 bg-primary/20 rounded flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-primary/60" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsMockup() {
  return (
    <div className="absolute inset-4 flex flex-col">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'Total', color: 'bg-primary/20' },
          { label: 'Sent', color: 'bg-orange-500/20' },
          { label: 'Closed', color: 'bg-green-500/20' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="p-2 rounded-lg bg-card/50 border border-border/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <div className={`h-6 w-10 ${stat.color} rounded mb-1`} />
            <div className="h-2 bg-muted/30 rounded w-1/2" />
          </motion.div>
        ))}
      </div>
      {/* Chart */}
      <div className="flex-1 bg-card/30 rounded-lg border border-border/30 p-3 flex items-end gap-2">
        {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 bg-gradient-to-t from-indigo-500/60 to-violet-500/40 rounded-t"
            style={{ height: `${h}%` }}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
          />
        ))}
      </div>
    </div>
  );
}

const mockupComponents: Record<string, React.FC> = {
  listings: ListingsMockup,
  map: MapMockup,
  pipeline: PipelineMockup,
  sent: SentMockup,
  followups: FollowupsMockup,
  analytics: AnalyticsMockup,
};

export default function FeaturesPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Background effects */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <motion.div
          className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <motion.div
          className="relative max-w-7xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div
            className="mb-6 flex items-center justify-center gap-3"
            variants={fadeInUp}
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/50" />
            <span className="text-sm font-medium tracking-widest uppercase text-primary/80 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              All Features
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/50" />
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl font-bold tracking-tight mb-6"
            variants={fadeInUp}
          >
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Dominate Expired Listings
            </span>
          </motion.h1>

          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
            variants={fadeInUp}
          >
            EXPIRD gives you all the tools you need to find, track, and convert expired and terminated MLS listings into closed deals.
          </motion.p>

          <motion.div variants={fadeInUp}>
            <Link href="/signup">
              <Button size="lg" className="btn-glow h-12 px-8 text-base group">
                <span className="relative z-10 flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Main Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-32">
            {mainFeatures.map((feature, index) => {
              const MockupComponent = mockupComponents[feature.mockup];
              return (
                <motion.div
                  key={feature.title}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                  }`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.6 }}
                >
                  <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                    <motion.div
                      className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-bold mb-4">{feature.title}</h2>
                    <p className="text-muted-foreground mb-6">{feature.description}</p>
                    <motion.ul
                      className="space-y-3"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={staggerContainer}
                    >
                      {feature.benefits.map((benefit) => (
                        <motion.li
                          key={benefit}
                          className="flex items-center gap-3"
                          variants={fadeInUp}
                        >
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                          <span>{benefit}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </div>
                  {/* Feature mockup */}
                  <motion.div
                    className={`relative ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="aspect-[4/3] rounded-xl border border-border/50 bg-gradient-to-br from-card via-background to-card overflow-hidden shadow-xl">
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5`} />
                      {MockupComponent && <MockupComponent />}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">And Much More...</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              EXPIRD is packed with features to help you work smarter, not harder.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {additionalFeatures.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="p-6 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-border transition-colors"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    className="p-2 rounded-lg bg-primary/10"
                    whileHover={{ scale: 1.1 }}
                  >
                    <feature.icon className="w-5 h-5 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Start your 14-day free trial today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="btn-glow h-12 px-8 text-base group">
                <span className="relative z-10 flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                View Pricing
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
