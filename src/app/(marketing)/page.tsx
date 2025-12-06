import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogoAnimated } from '@/components/ui/logo';
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
  MapPin,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Star,
} from 'lucide-react';

const features = [
  {
    icon: List,
    title: 'Smart Listing Management',
    description: 'Import and organize expired & terminated MLS listings with powerful filtering and search.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Map,
    title: 'Interactive Dark Map',
    description: 'Visualize all your listings on a stunning dark-themed map with real-time clustering.',
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

const stats = [
  { value: '500+', label: 'Active Realtors' },
  { value: '50K+', label: 'Listings Tracked' },
  { value: '15%', label: 'Avg Conversion Rate' },
  { value: '3x', label: 'Faster Outreach' },
];

const testimonials = [
  {
    quote: "EXPIRD has completely transformed how I handle expired listings. The map feature alone has helped me close 3 extra deals this quarter.",
    author: "Sarah M.",
    role: "RE/MAX Agent, Vancouver",
    avatar: "SM",
  },
  {
    quote: "The pipeline view makes it so easy to see where every prospect is in my sales process. No more spreadsheets!",
    author: "Michael T.",
    role: "Century 21 Realtor, Surrey",
    avatar: "MT",
  },
  {
    quote: "Best investment I've made for my real estate business. The follow-up reminders have increased my response rate by 40%.",
    author: "Jennifer L.",
    role: "Royal LePage, Chilliwack",
    avatar: "JL",
  },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background effects */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/15 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Built exclusively for Canadian Realtors
            </Badge>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Turn{' '}
              <span className="bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
                Expired Listings
              </span>{' '}
              Into{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Closed Deals
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The all-in-one platform to track, manage, and convert expired & terminated MLS listings.
              Built for realtors across Greater Vancouver, Fraser Valley, and Chilliwack.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
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
                  See All Features
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Hero Screenshot - Dashboard */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="relative rounded-xl overflow-hidden border border-border/50 shadow-2xl shadow-primary/10">
              <div className="bg-card/80 backdrop-blur-sm p-1">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1 rounded-md bg-muted/50 text-xs text-muted-foreground">
                      <Shield className="w-3 h-3 text-green-500" />
                      app.expird.ca/dashboard
                    </div>
                  </div>
                </div>
                {/* Screenshot placeholder - we'll use a gradient mockup */}
                <div className="aspect-[16/9] bg-gradient-to-br from-background via-card to-background relative overflow-hidden">
                  {/* Simulated dashboard layout */}
                  <div className="absolute inset-0 p-4 flex gap-4">
                    {/* Sidebar mockup */}
                    <div className="w-16 bg-sidebar/50 rounded-lg border border-border/30 flex flex-col items-center py-4 gap-4">
                      <div className="w-8 h-8 rounded-lg bg-primary/20" />
                      <div className="w-8 h-8 rounded-lg bg-muted/30" />
                      <div className="w-8 h-8 rounded-lg bg-muted/30" />
                      <div className="w-8 h-8 rounded-lg bg-muted/30" />
                      <div className="w-8 h-8 rounded-lg bg-muted/30" />
                    </div>
                    {/* Main content mockup */}
                    <div className="flex-1 space-y-4">
                      {/* Stats row */}
                      <div className="grid grid-cols-5 gap-3">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-20 rounded-lg bg-card/50 border border-border/30 p-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 mb-2" />
                            <div className="h-3 bg-muted/30 rounded w-1/2" />
                          </div>
                        ))}
                      </div>
                      {/* Map mockup */}
                      <div className="h-48 rounded-lg bg-[#1a1a2e] border border-border/30 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-30">
                          <div className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                          <div className="absolute top-1/3 left-1/2 w-3 h-3 rounded-full bg-violet-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
                          <div className="absolute top-1/2 left-1/3 w-3 h-3 rounded-full bg-rose-500 animate-pulse" style={{ animationDelay: '1s' }} />
                          <div className="absolute top-2/3 left-2/3 w-3 h-3 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: '1.5s' }} />
                          <div className="absolute top-3/4 left-1/4 w-3 h-3 rounded-full bg-violet-500 animate-pulse" style={{ animationDelay: '2s' }} />
                        </div>
                        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs">
                          <div className="flex items-center gap-1.5 bg-card/80 rounded px-2 py-1">
                            <div className="w-2 h-2 rounded-full bg-rose-500" />
                            <span className="text-muted-foreground">Expired</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-card/80 rounded px-2 py-1">
                            <div className="w-2 h-2 rounded-full bg-violet-500" />
                            <span className="text-muted-foreground">Terminated</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-border/50 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Close More Deals
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed specifically for realtors who want to dominate the expired listings market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative p-6 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card/50 hover:-translate-y-1"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Feature Highlight */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                <MapPin className="w-3.5 h-3.5 mr-1.5" />
                Interactive Map
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                See All Your Listings on a{' '}
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  Beautiful Dark Map
                </span>
              </h2>
              <p className="text-muted-foreground mb-6">
                Instantly visualize expired and terminated listings across Greater Vancouver, Fraser Valley,
                and Chilliwack. Filter by board, city, and neighborhood to find your next opportunity.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Real-time clustering for dense areas',
                  'Color-coded markers by listing type',
                  'Click to see listing details instantly',
                  'Filter by region, city, or neighborhood',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/features">
                <Button variant="outline" className="gap-2">
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            {/* Map Screenshot Mockup */}
            <div className="relative rounded-xl overflow-hidden border border-border/50 shadow-xl">
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
                  <div className="absolute top-[20%] left-[30%] w-12 h-12 rounded-full bg-primary/30 flex items-center justify-center text-sm font-bold animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-primary/60 flex items-center justify-center">12</div>
                  </div>
                  <div className="absolute top-[40%] left-[60%] w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center text-sm font-bold animate-pulse" style={{ animationDelay: '0.5s' }}>
                    <div className="w-6 h-6 rounded-full bg-primary/60 flex items-center justify-center text-xs">8</div>
                  </div>
                  {/* Individual markers */}
                  <div className="absolute top-[60%] left-[25%] w-4 h-4 rounded-full bg-rose-500 shadow-lg shadow-rose-500/50" />
                  <div className="absolute top-[35%] left-[45%] w-4 h-4 rounded-full bg-violet-500 shadow-lg shadow-violet-500/50" />
                  <div className="absolute top-[70%] left-[55%] w-4 h-4 rounded-full bg-rose-500 shadow-lg shadow-rose-500/50" />
                  <div className="absolute top-[50%] left-[75%] w-4 h-4 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
                  <div className="absolute top-[25%] left-[70%] w-4 h-4 rounded-full bg-violet-500 shadow-lg shadow-violet-500/50" />
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
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Star className="w-3.5 h-3.5 mr-1.5" />
              Testimonials
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Loved by{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Realtors Across BC
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-8 sm:p-12 rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 via-card to-accent/5 overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

            <div className="relative">
              <div className="flex justify-center mb-6">
                <LogoAnimated size="xl" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Close More Deals?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join hundreds of Canadian realtors who are already using EXPIRD to convert expired listings into closed deals.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg" className="btn-glow h-12 px-8 text-base">
                    <span className="relative z-10 flex items-center gap-2">
                      Start Your Free Trial
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                    View Pricing
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                14-day free trial &bull; No credit card required &bull; Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
