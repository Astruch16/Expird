'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogoAnimated } from '@/components/ui/logo';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/faq', label: 'FAQ' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Spacer to prevent content from being hidden under fixed navbar */}
      <div className="h-16 lg:h-20" />

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'bg-background/60 backdrop-blur-xl'
            : 'bg-transparent'
        )}
      >
        {/* Animated gradient border at bottom when scrolled */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: isScrolled ? 1 : 0,
            opacity: isScrolled ? 1 : 0
          }}
          transition={{ duration: 0.4 }}
        >
          <div className="h-full bg-gradient-to-r from-transparent via-cyber-blue/50 to-transparent" />
        </motion.div>

        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group relative">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {/* Glow effect behind logo */}
                <motion.div
                  className="absolute inset-0 bg-cyber-blue/20 rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                <LogoAnimated size="md" />
              </motion.div>
              <span className="font-bold text-xl tracking-[0.2em] bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
                EXPIRD
              </span>
            </Link>

            {/* Desktop Navigation - Floating pill design */}
            <div className="hidden lg:flex items-center">
              <motion.div
                className="relative flex items-center gap-1 px-2 py-1.5 rounded-full bg-card/40 backdrop-blur-md border border-border/40 shadow-lg shadow-background/5"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {/* Subtle inner glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const isHovered = hoveredLink === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="relative px-4 py-2 text-sm font-medium transition-colors"
                      onMouseEnter={() => setHoveredLink(link.href)}
                      onMouseLeave={() => setHoveredLink(null)}
                    >
                      {/* Background pill for active/hover state */}
                      <AnimatePresence>
                        {(isActive || isHovered) && (
                          <motion.div
                            layoutId="navbar-pill"
                            className={cn(
                              'absolute inset-0 rounded-full',
                              isActive
                                ? 'bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 border border-cyber-blue/30'
                                : 'bg-muted/60'
                            )}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                          />
                        )}
                      </AnimatePresence>

                      {/* Active indicator dot */}
                      {isActive && (
                        <motion.div
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyber-blue"
                          layoutId="active-dot"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                        />
                      )}

                      <span
                        className={cn(
                          'relative z-10 transition-all duration-200',
                          isActive
                            ? 'text-cyber-blue font-semibold'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {link.label}
                      </span>
                    </Link>
                  );
                })}
              </motion.div>
            </div>

            {/* CTA Buttons */}
            <motion.div
              className="hidden lg:flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Link href="/login">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative group"
                >
                  <Button
                    variant="ghost"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-transparent relative overflow-hidden"
                  >
                    <span className="relative z-10">Sign in</span>
                    {/* Underline animation on hover */}
                    <motion.div
                      className="absolute bottom-2 left-3 right-3 h-[1px] bg-gradient-to-r from-transparent via-foreground to-transparent origin-left"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </motion.div>
              </Link>

              <Link href="/pricing">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative"
                >
                  {/* Animated gradient border */}
                  <motion.div
                    className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-blue opacity-70"
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
                  <Button className="relative bg-background hover:bg-background/90 text-foreground text-sm font-semibold group border-0">
                    <span className="flex items-center gap-2">
                      Get Started
                      <motion.span
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.span>
                    </span>
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden relative p-2.5 rounded-xl bg-card/40 backdrop-blur-md border border-border/40 hover:border-border transition-colors overflow-hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated background on open */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-cyber-blue/10 to-cyber-purple/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: isMobileMenuOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />

              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10"
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10"
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Mobile Menu - Full screen overlay style */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="lg:hidden overflow-hidden"
              >
                <motion.div
                  className="py-6 border-t border-border/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {/* Nav links with staggered animation */}
                  <div className="flex flex-col gap-2">
                    {navLinks.map((link, index) => {
                      const isActive = pathname === link.href;
                      return (
                        <motion.div
                          key={link.href}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 + 0.1 }}
                        >
                          <Link
                            href={link.href}
                            className={cn(
                              'group flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-300',
                              isActive
                                ? 'text-cyber-blue bg-gradient-to-r from-cyber-blue/15 to-cyber-purple/10 border border-cyber-blue/20'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                            )}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <div className="flex items-center gap-3">
                              {isActive && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-2 h-2 rounded-full bg-cyber-blue"
                                />
                              )}
                              <span>{link.label}</span>
                            </div>
                            <ChevronRight className={cn(
                              'w-4 h-4 transition-all duration-300',
                              isActive
                                ? 'text-cyber-blue opacity-100'
                                : 'opacity-0 group-hover:opacity-50 group-hover:translate-x-1'
                            )} />
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Divider with gradient */}
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.4 }}
                    className="my-6 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent"
                  />

                  {/* Auth section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="space-y-3"
                  >
                    <Link
                      href="/login"
                      className="flex items-center justify-center px-4 py-3 rounded-xl text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all duration-200 border border-border/30"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign in
                    </Link>

                    <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)}>
                      <motion.div className="relative">
                        {/* Animated gradient border */}
                        <motion.div
                          className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-blue"
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
                        <Button className="relative w-full bg-background hover:bg-background/90 text-foreground text-base font-semibold h-12 border-0">
                          <span className="flex items-center gap-2">
                            Get Started
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </Button>
                      </motion.div>
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </motion.header>
    </>
  );
}
