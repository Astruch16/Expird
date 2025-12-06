import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

export default function FeaturesPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Background effects */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            All Features
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Dominate Expired Listings
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            EXPIRD gives you all the tools you need to find, track, and convert expired and terminated MLS listings into closed deals.
          </p>
          <Link href="/signup">
            <Button size="lg" className="btn-glow h-12 px-8 text-base">
              <span className="relative z-10 flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
          </Link>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-24">
            {mainFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">{feature.title}</h2>
                  <p className="text-muted-foreground mb-6">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Feature mockup */}
                <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div className="aspect-[4/3] rounded-xl border border-border/50 bg-gradient-to-br from-card via-background to-card overflow-hidden">
                    <div className="absolute inset-0 p-6">
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5`} />
                      {/* Simple mockup visualization */}
                      <div className="relative h-full flex items-center justify-center">
                        <div className={`p-8 rounded-2xl bg-gradient-to-br ${feature.gradient} bg-opacity-10 border border-white/10`}>
                          <feature.icon className="w-16 h-16 text-white/80" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">And Much More...</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              EXPIRD is packed with features to help you work smarter, not harder.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-border transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
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
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Start your 14-day free trial today. No credit card required.
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
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
