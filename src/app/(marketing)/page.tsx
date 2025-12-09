'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { LogoAnimated } from '@/components/ui/logo';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import {
  Map,
  List,
  Send,
  BarChart3,
  Kanban,
  Clock,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Shield,
  TrendingUp,
  Target,
  Lightbulb,
  XCircle,
  Phone,
  Handshake,
  DollarSign,
} from 'lucide-react';

// Hero slideshow images
const heroSlides = [
  { src: '/images/homepagenew.PNG', alt: 'EXPIRD Dashboard - Track and manage expired listings', url: 'app.expird.ca/dashboard' },
  { src: '/images/analytics.PNG', alt: 'EXPIRD Analytics - Track your performance', url: 'app.expird.ca/stats' },
];

const features = [
  {
    icon: List,
    title: 'Smart Listing Management',
    description: 'Import and organize expired & terminated MLS listings with powerful filtering and search.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Map,
    title: 'Interactive Heat Map',
    description: 'Visualize expired & terminated listings on an interactive heat map with real-time clustering.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Kanban,
    title: 'Visual Pipeline',
    description: 'Drag-and-drop kanban board to track prospects from new lead to closed deal.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Send,
    title: 'Outreach Tracking',
    description: 'Log when you contact homeowners and never lose track of your outreach efforts.',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    icon: Clock,
    title: 'Follow-up Reminders',
    description: 'Never miss a follow-up with scheduled reminders and automated notifications.',
    gradient: 'from-rose-500 to-red-500',
  },
  {
    icon: BarChart3,
    title: 'Powerful Analytics',
    description: 'Track your conversion rates, performance trends, and identify top opportunities.',
    gradient: 'from-indigo-500 to-violet-500',
  },
];

// Animation variants
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

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

// Slideshow transition variants - entire browser window slides
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95,
    rotateY: direction > 0 ? 8 : -8,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95,
    rotateY: direction < 0 ? 8 : -8,
  }),
};

// Hero Slideshow Component
function HeroSlideshow() {
  const [[currentSlide, direction], setCurrentSlide] = useState([0, 0]);
  const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(false);

  // Auto-advance slides every 13 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHoveredRef.current) {
        setCurrentSlide(([current]) => [(current + 1) % heroSlides.length, 1]);
      }
    }, 13000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    const newDirection = index > currentSlide ? 1 : -1;
    setCurrentSlide([index, newDirection]);
  };

  return (
    <motion.div
      className="mt-16 relative"
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: 0.5,
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      onMouseEnter={() => { isHoveredRef.current = true; setIsHovered(true); }}
      onMouseLeave={() => { isHoveredRef.current = false; setIsHovered(false); }}
    >
      {/* Glow effect behind the screenshot */}
      <motion.div
        className="absolute -inset-4 bg-gradient-to-r from-cyber-blue/20 via-cyber-purple/20 to-cyber-blue/20 rounded-3xl blur-2xl"
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Gradient fade overlay at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20 pointer-events-none rounded-2xl" />

      {/* Slideshow container */}
      <div className="relative overflow-hidden" style={{ perspective: '1500px' }}>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 200, damping: 25 },
              opacity: { duration: 0.5 },
              scale: { duration: 0.5 },
              rotateY: { duration: 0.6 },
            }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Browser chrome frame */}
            <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl shadow-cyber-blue/20 bg-card/80 backdrop-blur-sm">
              {/* Browser toolbar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-card/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                    <Shield className="w-3 h-3 text-green-500" />
                    <span>{heroSlides[currentSlide].url}</span>
                  </div>
                </div>
              </div>

              {/* Screenshot */}
              <div className="relative">
                <Image
                  src={heroSlides[currentSlide].src}
                  alt={heroSlides[currentSlide].alt}
                  width={1920}
                  height={1080}
                  className="w-full h-auto"
                  priority={currentSlide === 0}
                />

                {/* Shine effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
                  initial={{ x: '-100%' }}
                  animate={isHovered ? { x: '100%' } : { x: '-100%' }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide indicators */}
        <div className="flex items-center justify-center gap-3 mt-6">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="group relative"
            >
              <motion.div
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'w-8 bg-gradient-to-r from-cyber-blue to-cyber-purple'
                    : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
              {index === currentSlide && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-cyber-blue/30 blur-sm"
                  layoutId="slideIndicatorGlow"
                />
              )}
            </button>
          ))}
        </div>

        {/* Reflection effect */}
        <div className="absolute -bottom-8 left-4 right-4 h-16 bg-gradient-to-b from-cyber-blue/5 to-transparent blur-xl rounded-full" />
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background effects */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <motion.div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyber-blue/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.2, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyber-purple/15 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.15, 0.2, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Elegant tagline - replacing the pill */}
            <motion.div
              className="mb-8 flex items-center justify-center gap-3"
              variants={fadeInUp}
            >
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyber-blue/50" />
              <span className="text-sm font-medium tracking-widest uppercase text-cyber-blue/80">
                Built exclusively for Canadian Realtors
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyber-blue/50" />
            </motion.div>

            {/* Headline - "Close Deals" on second line */}
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
              variants={fadeInUp}
            >
              Turn{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
                  Expired Listings
                </span>
                {/* Flame sparkles */}
                <motion.span
                  className="absolute -top-1 left-[10%] w-1.5 h-1.5 bg-orange-400 rounded-full"
                  animate={{
                    y: [0, -12, -20],
                    x: [0, -3, -5],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.3],
                  }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                />
                <motion.span
                  className="absolute -top-1 left-[30%] w-1 h-1 bg-yellow-400 rounded-full"
                  animate={{
                    y: [0, -15, -25],
                    x: [0, 2, 4],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.3],
                  }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: 0.3 }}
                />
                <motion.span
                  className="absolute -top-2 left-[50%] w-1.5 h-1.5 bg-rose-400 rounded-full"
                  animate={{
                    y: [0, -18, -28],
                    x: [0, -1, -2],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.2, 0.3],
                  }}
                  transition={{ duration: 1.3, repeat: Infinity, delay: 0.6 }}
                />
                <motion.span
                  className="absolute -top-1 left-[70%] w-1 h-1 bg-orange-300 rounded-full"
                  animate={{
                    y: [0, -14, -22],
                    x: [0, 3, 6],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.3],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                />
                <motion.span
                  className="absolute -top-2 left-[85%] w-1.5 h-1.5 bg-yellow-300 rounded-full"
                  animate={{
                    y: [0, -16, -26],
                    x: [0, -2, -3],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.1, 0.3],
                  }}
                  transition={{ duration: 1.1, repeat: Infinity, delay: 0.5 }}
                />
                <motion.span
                  className="absolute -top-1 left-[20%] w-0.5 h-0.5 bg-white rounded-full"
                  animate={{
                    y: [0, -10, -18],
                    x: [0, 1, 2],
                    opacity: [0, 0.8, 0],
                    scale: [0.5, 1, 0.3],
                  }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.8 }}
                />
                <motion.span
                  className="absolute -top-1 left-[60%] w-0.5 h-0.5 bg-white rounded-full"
                  animate={{
                    y: [0, -12, -20],
                    x: [0, -1, -1],
                    opacity: [0, 0.8, 0],
                    scale: [0.5, 1, 0.3],
                  }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                />
              </span>{' '}
              Into
              <br />
              <span className="bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
                Closed Deals
              </span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              The all-in-one platform to track, manage, and convert expired & terminated MLS listings.
              Built for realtors across Greater Vancouver, Fraser Valley, and Chilliwack.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
              variants={fadeInUp}
            >
              <Link href="/signup">
                <Button size="lg" className="btn-glow h-12 px-8 text-base group">
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                  See All Features
                </Button>
              </Link>
            </motion.div>

            {/* Decorative divider */}
            <motion.div
              className="flex items-center justify-center gap-4"
              variants={fadeInUp}
            >
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyber-blue/30 to-cyber-blue/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-cyber-blue/50" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent via-cyber-blue/30 to-cyber-blue/50" />
            </motion.div>
          </motion.div>

          {/* Hero Screenshot Slideshow */}
          <HeroSlideshow />
        </div>
      </section>

      {/* Why Expired Listings Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
        <motion.div
          className="absolute top-1/2 left-0 w-[800px] h-[800px] -translate-y-1/2 -translate-x-1/2 bg-cyber-blue/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 right-0 w-[800px] h-[800px] -translate-y-1/2 translate-x-1/2 bg-cyber-purple/5 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="relative max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-500/50" />
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium tracking-widest uppercase text-amber-500/80">
                The Opportunity
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-500/50" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why{' '}
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                Expired Listings
              </span>{' '}
              Are Your Greatest Opportunity
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Most realtors overlook this goldmine. Here&apos;s why the smartest agents are building their business
              on expired listings.
            </p>
          </motion.div>

          {/* The Problem - Animated Flow */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Problem visualization */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative bg-card/30 backdrop-blur-sm rounded-2xl border border-border/50 p-8 overflow-hidden">
                {/* Animated warning glow */}
                <motion.div
                  className="absolute -top-20 -right-20 w-40 h-40 bg-rose-500/20 rounded-full blur-3xl"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-500/10">
                    <XCircle className="w-5 h-5 text-rose-500" />
                  </div>
                  The Problem Most Agents Face
                </h3>

                {/* Animated stats */}
                <div className="space-y-6">
                  <motion.div
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="relative">
                      <motion.div
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500/20 to-orange-500/20 flex items-center justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <span className="text-2xl font-bold text-rose-500">87%</span>
                      </motion.div>
                    </div>
                    <div>
                      <p className="font-medium">of expired listings go untouched</p>
                      <p className="text-sm text-muted-foreground">No one follows up with these homeowners</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="relative">
                      <motion.div
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      >
                        <Clock className="w-7 h-7 text-amber-500" />
                      </motion.div>
                    </div>
                    <div>
                      <p className="font-medium">Timing is everything</p>
                      <p className="text-sm text-muted-foreground">The first 48 hours are critical for contact</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="relative">
                      <motion.div
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      >
                        <Target className="w-7 h-7 text-violet-500" />
                      </motion.div>
                    </div>
                    <div>
                      <p className="font-medium">Motivated sellers</p>
                      <p className="text-sm text-muted-foreground">They already want to sell - they just need the right agent</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* The Solution */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative bg-card/30 backdrop-blur-sm rounded-2xl border border-border/50 p-8 overflow-hidden">
                {/* Success glow */}
                <motion.div
                  className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                  </div>
                  How EXPIRD Changes the Game
                </h3>

                <div className="space-y-6">
                  <motion.div
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.div
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <List className="w-5 h-5 text-white" />
                    </motion.div>
                    <div>
                      <p className="font-medium">Track Every Listing</p>
                      <p className="text-sm text-muted-foreground">Never miss an expired listing in your area again</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Phone className="w-5 h-5 text-white" />
                    </motion.div>
                    <div>
                      <p className="font-medium">Be First to Contact</p>
                      <p className="text-sm text-muted-foreground">Get notified instantly and reach out before competitors</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 }}
                  >
                    <motion.div
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Handshake className="w-5 h-5 text-white" />
                    </motion.div>
                    <div>
                      <p className="font-medium">Convert to Clients</p>
                      <p className="text-sm text-muted-foreground">Turn frustrated sellers into your next closed deal</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Animated Journey */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold mb-2">The Journey From Expired to Sold</h3>
              <p className="text-muted-foreground">See how EXPIRD helps you convert every step of the way</p>
            </div>

            <div className="relative">
              {/* Connection line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-500 via-amber-500 via-blue-500 to-emerald-500 transform -translate-y-1/2 hidden lg:block" />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    step: '01',
                    icon: XCircle,
                    title: 'Listing Expires',
                    description: 'A homeowner\'s listing expires or terminates - they\'re frustrated and need help.',
                    gradient: 'from-rose-500 to-orange-500',
                    bgGradient: 'from-rose-500/10 to-orange-500/10',
                  },
                  {
                    step: '02',
                    icon: List,
                    title: 'EXPIRD Tracks It',
                    description: 'Our system captures the listing instantly and adds it to your dashboard.',
                    gradient: 'from-amber-500 to-yellow-500',
                    bgGradient: 'from-amber-500/10 to-yellow-500/10',
                  },
                  {
                    step: '03',
                    icon: Phone,
                    title: 'You Make Contact',
                    description: 'Reach out with confidence - you have all the info you need at your fingertips.',
                    gradient: 'from-blue-500 to-cyan-500',
                    bgGradient: 'from-blue-500/10 to-cyan-500/10',
                  },
                  {
                    step: '04',
                    icon: DollarSign,
                    title: 'Close the Deal',
                    description: 'Convert the motivated seller into a new listing and earn your commission.',
                    gradient: 'from-emerald-500 to-teal-500',
                    bgGradient: 'from-emerald-500/10 to-teal-500/10',
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.step}
                    className="relative"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                  >
                    <motion.div
                      className={`relative p-6 rounded-xl border border-border/50 bg-gradient-to-br ${item.bgGradient} backdrop-blur-sm h-full`}
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    >
                      {/* Step number */}
                      <motion.div
                        className={`absolute -top-4 left-6 w-8 h-8 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white text-sm font-bold shadow-lg`}
                        whileHover={{ scale: 1.2 }}
                      >
                        {item.step}
                      </motion.div>

                      {/* Icon */}
                      <motion.div
                        className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${item.gradient} mb-4 mt-2`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <item.icon className="w-6 h-6 text-white" />
                      </motion.div>

                      <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-cyber-blue/50" />
              <span className="text-sm font-medium tracking-widest uppercase text-cyber-blue/80">
                Features
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-cyber-blue/50" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
                Close More Deals
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed specifically for realtors who want to dominate the expired listings market.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group relative p-6 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card/50"
              >
                <motion.div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Map Feature Highlight */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-4 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-medium tracking-widest uppercase text-emerald-500/80">
                  Interactive Map
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                See All Your Listings on a{' '}
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  Interactive Heat Map
                </span>
              </h2>
              <p className="text-muted-foreground mb-6">
                Instantly visualize expired and terminated listings across Greater Vancouver, Fraser Valley,
                and Chilliwack. Filter by board, city, and neighborhood to find your next opportunity.
              </p>
              <motion.ul
                className="space-y-3 mb-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                {[
                  'Real-time clustering for dense areas',
                  'Color-coded markers by listing type',
                  'Click to see listing details instantly',
                  'Filter by region, city, or neighborhood',
                ].map((item, index) => (
                  <motion.li
                    key={item}
                    className="flex items-center gap-3 text-sm"
                    variants={fadeInUp}
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
              <Link href="/features">
                <Button variant="outline" className="gap-2 group">
                  Learn More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            {/* Map Screenshot Mockup */}
            <motion.div
              className="relative rounded-xl overflow-hidden border border-border/50 shadow-xl"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="aspect-[4/3] bg-[#1a1a2e] relative">
                {/* Simulated map with markers */}
                <div className="absolute inset-0">
                  {/* Grid lines */}
                  <div className="absolute inset-0 opacity-10">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="absolute border-t border-white/20" style={{ top: `${i * 10}%`, left: 0, right: 0 }} />
                    ))}
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="absolute border-l border-white/20" style={{ left: `${i * 10}%`, top: 0, bottom: 0 }} />
                    ))}
                  </div>
                  {/* Clusters */}
                  <motion.div
                    className="absolute top-[20%] left-[30%] w-12 h-12 rounded-full bg-cyber-blue/30 flex items-center justify-center text-sm font-bold"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-8 h-8 rounded-full bg-cyber-blue/60 flex items-center justify-center">12</div>
                  </motion.div>
                  <motion.div
                    className="absolute top-[40%] left-[60%] w-10 h-10 rounded-full bg-cyber-blue/30 flex items-center justify-center text-sm font-bold"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-cyber-blue/60 flex items-center justify-center text-xs">8</div>
                  </motion.div>
                  {/* Individual markers */}
                  <motion.div
                    className="absolute top-[60%] left-[25%] w-4 h-4 rounded-full bg-rose-500 shadow-lg shadow-rose-500/50"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute top-[35%] left-[45%] w-4 h-4 rounded-full bg-violet-500 shadow-lg shadow-violet-500/50"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                  />
                  <motion.div
                    className="absolute top-[70%] left-[55%] w-4 h-4 rounded-full bg-rose-500 shadow-lg shadow-rose-500/50"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                  />
                  <motion.div
                    className="absolute top-[50%] left-[75%] w-4 h-4 rounded-full bg-green-500 shadow-lg shadow-green-500/50"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
                  />
                  <motion.div
                    className="absolute top-[25%] left-[70%] w-4 h-4 rounded-full bg-violet-500 shadow-lg shadow-violet-500/50"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
                  />
                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-3 bg-card/90 backdrop-blur-sm rounded-lg border border-border px-3 py-2">
                    <div className="flex items-center gap-1.5 text-xs">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span className="text-muted-foreground">24</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                      <span className="text-muted-foreground">18</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                      <span className="text-muted-foreground">5</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg border border-border px-3 py-1.5">
                    <p className="text-sm font-medium">47 listings</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 grid-pattern opacity-10" />

        <div className="max-w-6xl mx-auto relative">
          <motion.div
            className="relative rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Animated gradient border */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-blue bg-[length:200%_100%] animate-gradient-x p-[1px] rounded-3xl">
              <div className="absolute inset-[1px] bg-background rounded-3xl" />
            </div>

            {/* Main content container */}
            <div className="relative p-8 sm:p-12 lg:p-16">
              {/* Multiple animated background glows */}
              <motion.div
                className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyber-blue/15 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.15, 0.25, 0.15],
                  x: [0, 30, 0],
                }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyber-purple/15 rounded-full blur-3xl"
                animate={{
                  scale: [1.3, 1, 1.3],
                  opacity: [0.15, 0.25, 0.15],
                  x: [0, -30, 0],
                }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{ duration: 6, repeat: Infinity, delay: 2 }}
              />

              {/* Content */}
              <div className="relative text-center">
                {/* Logo with glow effect */}
                <motion.div
                  className="flex justify-center mb-8"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="absolute inset-0 bg-cyber-blue/30 rounded-full blur-xl scale-150" />
                    <LogoAnimated size="xl" />
                  </motion.div>
                </motion.div>

                {/* Headline with gradient */}
                <motion.h2
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  Ready to{' '}
                  <span className="bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-blue bg-[length:200%_100%] animate-gradient-x bg-clip-text text-transparent">
                    Close More Deals
                  </span>
                  ?
                </motion.h2>

                <motion.p
                  className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  Join Canadian realtors who are transforming expired listings into their most profitable deals.
                  Get started today and close more deals.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <Link href="/signup">
                    <Button size="lg" className="btn-glow h-14 px-10 text-base group relative overflow-hidden">
                      <span className="relative z-10 flex items-center gap-2 font-semibold">
                        Get Started Now
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.span>
                      </span>
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button variant="outline" size="lg" className="h-14 px-10 text-base font-semibold border-2 hover:bg-muted/50">
                      View Pricing
                    </Button>
                  </Link>
                </motion.div>

                {/* Trust badges */}
                <motion.div
                  className="flex flex-wrap items-center justify-center gap-6 text-sm"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  {[
                    { icon: CheckCircle2, text: 'Start converting today', color: 'text-emerald-500' },
                    { icon: Shield, text: 'Secure payment', color: 'text-blue-500' },
                    { icon: Clock, text: 'Cancel anytime', color: 'text-amber-500' },
                  ].map((item, index) => (
                    <motion.div
                      key={item.text}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 border border-border/50"
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(var(--muted), 0.5)' }}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                      <span className="text-muted-foreground">{item.text}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
