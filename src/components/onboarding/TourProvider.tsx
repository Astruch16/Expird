'use client';

import { Suspense } from 'react';
import { GuidedTour } from './GuidedTour';

export function TourProvider() {
  return (
    <Suspense fallback={null}>
      <GuidedTour />
    </Suspense>
  );
}
