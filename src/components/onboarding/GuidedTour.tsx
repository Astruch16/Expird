'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  X,
  ArrowRight,
  ArrowLeft,
  List,
  Kanban,
  Map,
  Send,
  Clock,
  BarChart3,
  Plus,
  Sparkles,
} from 'lucide-react';

interface TourStep {
  id: string;
  target: string;
  title: string;
  description: string;
  icon: React.ElementType;
  position: 'top' | 'bottom' | 'left' | 'right';
  highlight?: string;
}

const tourSteps: TourStep[] = [
  {
    id: 'dashboard',
    target: '[href="/app/dashboard"]',
    title: 'Dashboard Overview',
    description: 'Your command center! See all your key metrics, recent activity, and a map preview of your listings at a glance.',
    icon: Sparkles,
    position: 'right',
    highlight: '/app/dashboard',
  },
  {
    id: 'add-listing',
    target: '#add-listing-btn',
    title: 'Add New Listings',
    description: 'Manually add expired or terminated listings here. You can also bulk import them later. This is your starting point!',
    icon: Plus,
    position: 'right',
    highlight: '/app/listings/new',
  },
  {
    id: 'listings',
    target: '[href="/app/listings"]',
    title: 'Manage Listings',
    description: 'View, search, and filter all your expired and terminated listings. Track status and manage your pipeline.',
    icon: List,
    position: 'right',
    highlight: '/app/listings',
  },
  {
    id: 'pipeline',
    target: '[href="/app/pipeline"]',
    title: 'Pipeline Board',
    description: 'Drag and drop listings through your sales pipeline - from New Lead to Closed Deal. Track your conversion journey!',
    icon: Kanban,
    position: 'right',
    highlight: '/app/pipeline',
  },
  {
    id: 'map',
    target: '[href="/app/map"]',
    title: 'Interactive Map',
    description: 'Visualize all your listings on a beautiful dark map. Click markers to see details and find hotspots!',
    icon: Map,
    position: 'right',
    highlight: '/app/map',
  },
  {
    id: 'analytics',
    target: '[href="/app/stats"]',
    title: 'Analytics & Stats',
    description: 'Track your performance with beautiful charts. See trends, conversion rates, and identify your best opportunities.',
    icon: BarChart3,
    position: 'right',
    highlight: '/app/stats',
  },
  {
    id: 'sent',
    target: '[href="/app/sent"]',
    title: 'Sent Listings',
    description: 'Keep track of all the homeowners you\'ve reached out to. Never lose track of your outreach efforts!',
    icon: Send,
    position: 'right',
    highlight: '/app/sent',
  },
  {
    id: 'followups',
    target: '[href="/app/follow-ups"]',
    title: 'Follow-ups',
    description: 'Schedule and manage follow-up reminders. The key to converting leads is consistent follow-up!',
    icon: Clock,
    position: 'right',
    highlight: '/app/follow-ups',
  },
];

interface GuidedTourProps {
  onComplete?: () => void;
}

export function GuidedTour({ onComplete }: GuidedTourProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (searchParams.get('tour') === 'true') {
      setIsActive(true);
      // Remove the query param without refresh
      window.history.replaceState({}, '', '/app/dashboard');
    }
  }, [searchParams]);

  const updateTargetPosition = useCallback(() => {
    if (!isActive) return;

    const step = tourSteps[currentStep];
    const element = document.querySelector(step.target);

    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);
    }
  }, [currentStep, isActive]);

  useEffect(() => {
    updateTargetPosition();

    window.addEventListener('resize', updateTargetPosition);
    window.addEventListener('scroll', updateTargetPosition);

    return () => {
      window.removeEventListener('resize', updateTargetPosition);
      window.removeEventListener('scroll', updateTargetPosition);
    };
  }, [updateTargetPosition]);

  useEffect(() => {
    if (isActive) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isActive]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsActive(false);
    onComplete?.();
  };

  const handleSkip = () => {
    setIsActive(false);
    onComplete?.();
  };

  if (!isActive || !targetRect) return null;

  const step = tourSteps[currentStep];
  const StepIcon = step.icon;

  // Calculate tooltip position
  const getTooltipStyle = () => {
    const padding = 16;
    const tooltipWidth = 320;
    const tooltipHeight = 200;

    let top = targetRect.top;
    let left = targetRect.right + padding;

    // Adjust if tooltip would go off screen
    if (left + tooltipWidth > window.innerWidth) {
      left = targetRect.left - tooltipWidth - padding;
    }

    // Center vertically with the target
    top = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2);

    // Keep within viewport
    top = Math.max(padding, Math.min(top, window.innerHeight - tooltipHeight - padding));

    return { top, left };
  };

  const tooltipStyle = getTooltipStyle();

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[9998] pointer-events-none">
        {/* Semi-transparent backdrop with cutout */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <mask id="tour-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <rect
                x={targetRect.left - 4}
                y={targetRect.top - 4}
                width={targetRect.width + 8}
                height={targetRect.height + 8}
                rx="8"
                fill="black"
              />
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.75)"
            mask="url(#tour-mask)"
          />
        </svg>

        {/* Highlight ring around target */}
        <div
          className="absolute border-2 border-primary rounded-lg transition-all duration-300 pointer-events-none"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
            boxShadow: '0 0 0 4px rgba(96, 165, 250, 0.2), 0 0 20px rgba(96, 165, 250, 0.4)',
          }}
        />

        {/* Pulsing dot indicator */}
        <div
          className="absolute"
          style={{
            top: targetRect.top + targetRect.height / 2 - 6,
            left: targetRect.right + 8,
          }}
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
          </span>
        </div>
      </div>

      {/* Tooltip */}
      <div
        className={`fixed z-[9999] w-80 pointer-events-auto transition-all duration-300 ${
          isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
        style={{
          top: tooltipStyle.top,
          left: tooltipStyle.left,
        }}
      >
        <div className="relative bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
          {/* Gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyber-blue to-cyber-purple" />

          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute top-3 right-3 p-1 rounded-md hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* Content */}
          <div className="p-5 pt-6">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                <StepIcon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                Step {currentStep + 1} of {tourSteps.length}
              </span>
            </div>

            {/* Title and description */}
            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              {step.description}
            </p>

            {/* Progress bar */}
            <div className="flex gap-1 mb-5">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    index <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-muted-foreground"
                >
                  Skip tour
                </Button>
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="gap-1 bg-primary hover:bg-primary/90"
                >
                  {currentStep === tourSteps.length - 1 ? (
                    <>
                      Finish
                      <Sparkles className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Arrow pointing to target */}
        <div
          className="absolute w-3 h-3 bg-card border-l border-t border-border rotate-45 -left-1.5"
          style={{
            top: '50%',
            marginTop: -6,
          }}
        />
      </div>
    </>
  );
}
