'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { LogoAnimated } from '@/components/ui/logo';
import {
  List,
  Map,
  Send,
  BarChart3,
  Kanban,
  Clock,
  ArrowRight,
  Sparkles,
  Check,
} from 'lucide-react';

const features = [
  {
    icon: List,
    title: 'Track Listings',
    description: 'Import and manage expired & terminated MLS listings',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Kanban,
    title: 'Pipeline View',
    description: 'Visual kanban board to track your prospect journey',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Map,
    title: 'Interactive Map',
    description: 'See all your listings on a beautiful dark map',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Send,
    title: 'Outreach Tracking',
    description: 'Log when you contact homeowners',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    icon: Clock,
    title: 'Follow-ups',
    description: 'Never miss a follow-up with scheduled reminders',
    gradient: 'from-rose-500 to-red-500',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Track your conversion rates and performance',
    gradient: 'from-indigo-500 to-violet-500',
  },
];

export default function WelcomePage() {
  const router = useRouter();
  const supabase = createClient();
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [animationStep, setAnimationStep] = useState(0);
  const [startTour, setStartTour] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, has_completed_onboarding')
        .eq('id', user.id)
        .single();

      if (profile?.has_completed_onboarding) {
        router.push('/dashboard');
        return;
      }

      // Extract first name from full_name, or use email prefix as fallback
      const fullName = profile?.full_name;
      const firstName = fullName
        ? fullName.split(' ')[0]
        : user.email?.split('@')[0] || 'there';
      setUserName(firstName);
      setLoading(false);
    };

    fetchUser();
  }, [supabase, router]);

  useEffect(() => {
    if (!loading) {
      const timer = setInterval(() => {
        setAnimationStep((prev) => Math.min(prev + 1, features.length + 2));
      }, 150);
      return () => clearInterval(timer);
    }
  }, [loading]);

  const handleSkip = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ has_completed_onboarding: true })
        .eq('id', user.id);
    }
    router.push('/dashboard');
  };

  const handleStartTour = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ has_completed_onboarding: true })
        .eq('id', user.id);
    }
    setStartTour(true);
    setTimeout(() => {
      router.push('/dashboard?tour=true');
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LogoAnimated size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Logo and Welcome */}
        <div
          className={`flex flex-col items-center mb-12 transition-all duration-700 ${
            animationStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-150 animate-pulse" />
            <LogoAnimated size="xl" />
          </div>

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              <span className="bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent">
                Welcome, {userName}!
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              You&apos;re all set to start converting expired listings into new opportunities
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div
          className={`w-full max-w-4xl mb-12 transition-all duration-500 ${
            animationStep >= 2 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-center">Here&apos;s what you can do</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`group relative p-5 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm transition-all duration-500 hover:border-border hover:bg-card/50 ${
                  animationStep >= index + 3
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className={`inline-flex p-2.5 rounded-lg bg-gradient-to-br ${feature.gradient} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>

                {/* Hover glow effect */}
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center gap-4 transition-all duration-700 ${
            animationStep >= features.length + 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Button
            size="lg"
            className={`btn-glow min-w-[200px] h-12 text-base font-medium transition-all duration-300 ${
              startTour ? 'scale-95 opacity-75' : ''
            }`}
            onClick={handleStartTour}
            disabled={startTour}
          >
            <span className="relative z-10 flex items-center gap-2">
              {startTour ? (
                <>
                  <Check className="w-5 h-5" />
                  Let&apos;s Go!
                </>
              ) : (
                <>
                  Take a Quick Tour
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className="text-muted-foreground hover:text-foreground min-w-[200px] h-12 cursor-pointer"
            onClick={handleSkip}
            disabled={startTour}
          >
            Skip for now
          </Button>
        </div>

        {/* Bottom hint */}
        <p className={`mt-8 text-sm text-muted-foreground/60 text-center transition-all duration-700 ${
          animationStep >= features.length + 2 ? 'opacity-100' : 'opacity-0'
        }`}>
          You can always access the tour later from Settings
        </p>
      </div>
    </div>
  );
}
