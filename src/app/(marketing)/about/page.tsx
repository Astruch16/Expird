import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogoAnimated } from '@/components/ui/logo';
import {
  ArrowRight,
  Heart,
  Target,
  Users,
  Lightbulb,
  MapPin,
  Award,
} from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Focus on Realtors',
    description: 'We build exclusively for Canadian real estate agents. Every feature is designed with your workflow in mind.',
  },
  {
    icon: Lightbulb,
    title: 'Simplicity First',
    description: 'Powerful doesn\'t have to mean complicated. We believe in intuitive design that just works.',
  },
  {
    icon: Users,
    title: 'Customer Success',
    description: 'Your success is our success. We\'re here to help you close more deals, not just sell software.',
  },
  {
    icon: Heart,
    title: 'Built with Care',
    description: 'We obsess over the details. From smooth animations to thoughtful UX, we care about the experience.',
  },
];

const milestones = [
  { year: '2024', event: 'EXPIRD Founded in Vancouver, BC' },
  { year: '2024', event: 'Launched support for GV, Fraser Valley & Chilliwack' },
  { year: '2024', event: 'First 100 active realtors on the platform' },
  { year: '2025', event: 'Expanding features based on user feedback' },
];

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background effects */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/15 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <LogoAnimated size="xl" />
          </div>
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
            About EXPIRD
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Built by Realtors,{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              For Realtors
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We understand the challenges of prospecting expired listings because we&apos;ve lived them.
            EXPIRD was born from a simple idea: realtors deserve better tools to convert these opportunities.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                Our Mission
              </Badge>
              <h2 className="text-3xl font-bold mb-4">
                Empowering Canadian Realtors to{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Thrive
                </span>
              </h2>
              <p className="text-muted-foreground mb-6">
                Every year, thousands of listings expire or get terminated in the Greater Vancouver, Fraser Valley,
                and Chilliwack markets. These represent homeowners who still need to sell and realtors who can help them.
              </p>
              <p className="text-muted-foreground mb-6">
                Our mission is to provide Canadian realtors with the tools they need to efficiently identify,
                track, and convert these opportunities. We believe that with the right platform, any realtor
                can build a successful business around expired listings.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Proudly based in British Columbia, Canada</span>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl border border-border/50 bg-gradient-to-br from-card via-background to-card p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6">
                    <Award className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Canadian Made</h3>
                  <p className="text-muted-foreground">
                    Designed and built in Vancouver for the Canadian real estate market
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Our Values
            </Badge>
            <h2 className="text-3xl font-bold">What We Believe In</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="p-6 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Our Journey
            </Badge>
            <h2 className="text-3xl font-bold">Key Milestones</h2>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-primary/20" />

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative flex items-start gap-6 pl-20">
                  {/* Timeline dot */}
                  <div className="absolute left-6 top-1 w-4 h-4 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background" />
                  <div className="flex-1 p-4 rounded-xl border border-border/50 bg-card/30">
                    <div className="text-sm text-primary font-medium mb-1">{milestone.year}</div>
                    <div>{milestone.event}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Join the Community?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join hundreds of Canadian realtors who are already using EXPIRD to close more deals from expired listings.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="btn-glow h-12 px-8 text-base">
                <span className="relative z-10 flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            </Link>
            <Link href="/features">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                Explore Features
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
