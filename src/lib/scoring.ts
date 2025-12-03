import { Listing, PropertyType } from '@/types';

interface ScoreFactors {
  daysSinceExpiry: number;
  priceRange: number;
  propertyType: number;
  hasOwnerInfo: number;
  location: number;
}

/**
 * Calculate a lead score for a listing based on multiple factors
 * Score ranges from 0-100, higher = better lead
 */
export function calculateLeadScore(listing: Partial<Listing>): number {
  const factors: ScoreFactors = {
    daysSinceExpiry: calculateDaysScore(listing.expiry_date),
    priceRange: calculatePriceScore(listing.price),
    propertyType: calculatePropertyTypeScore(listing.property_type),
    hasOwnerInfo: calculateOwnerInfoScore(listing),
    location: calculateLocationScore(listing.city),
  };

  // Weights for each factor (total = 100)
  const weights = {
    daysSinceExpiry: 30,  // Freshness is key
    priceRange: 25,       // Higher price = higher commission potential
    propertyType: 15,     // Houses typically more valuable
    hasOwnerInfo: 20,     // Owner info makes outreach easier
    location: 10,         // Some areas more desirable
  };

  const totalScore =
    (factors.daysSinceExpiry * weights.daysSinceExpiry / 100) +
    (factors.priceRange * weights.priceRange / 100) +
    (factors.propertyType * weights.propertyType / 100) +
    (factors.hasOwnerInfo * weights.hasOwnerInfo / 100) +
    (factors.location * weights.location / 100);

  return Math.round(Math.min(100, Math.max(0, totalScore)));
}

/**
 * Days since expiry - fresher listings score higher
 * 0-3 days: 100, 4-7 days: 80, 8-14 days: 60, 15-30 days: 40, 30+ days: 20
 */
function calculateDaysScore(expiryDate?: string): number {
  if (!expiryDate) return 0;

  const expiry = new Date(expiryDate);
  const today = new Date();
  const daysSince = Math.floor((today.getTime() - expiry.getTime()) / (1000 * 60 * 60 * 24));

  if (daysSince <= 3) return 100;
  if (daysSince <= 7) return 80;
  if (daysSince <= 14) return 60;
  if (daysSince <= 30) return 40;
  return 20;
}

/**
 * Price score - higher priced properties generally mean higher commission
 * $1M+: 100, $750k-1M: 85, $500k-750k: 70, $300k-500k: 55, <$300k: 40
 */
function calculatePriceScore(price?: number | null): number {
  if (!price) return 30; // Unknown price gets base score

  if (price >= 1000000) return 100;
  if (price >= 750000) return 85;
  if (price >= 500000) return 70;
  if (price >= 300000) return 55;
  return 40;
}

/**
 * Property type score
 * Houses and row homes typically have higher values
 */
function calculatePropertyTypeScore(propertyType?: PropertyType | null): number {
  if (!propertyType) return 50;

  const scores: Record<PropertyType, number> = {
    house: 100,
    row_home: 85,
    townhouse: 75,
    condo: 60,
    mobile: 40,
  };

  return scores[propertyType] ?? 50;
}

/**
 * Owner info score - having contact info makes outreach much easier
 */
function calculateOwnerInfoScore(listing: Partial<Listing>): number {
  let score = 0;

  if (listing.owner_name) score += 40;
  if (listing.owner_phone) score += 35;
  if (listing.owner_email) score += 25;

  return score;
}

/**
 * Location score - can be customized based on desirable areas
 * For now, uses a simple heuristic based on common high-value areas
 */
function calculateLocationScore(city?: string): number {
  if (!city) return 50;

  const premiumCities = [
    'vancouver', 'west vancouver', 'north vancouver',
    'burnaby', 'richmond', 'coquitlam', 'white rock'
  ];

  const midTierCities = [
    'surrey', 'langley', 'delta', 'new westminster',
    'port moody', 'port coquitlam', 'maple ridge'
  ];

  const cityLower = city.toLowerCase();

  if (premiumCities.some(c => cityLower.includes(c))) return 100;
  if (midTierCities.some(c => cityLower.includes(c))) return 70;
  return 50;
}

/**
 * Get a human-readable score label
 */
export function getScoreLabel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Hot', color: 'text-red-500' };
  if (score >= 60) return { label: 'Warm', color: 'text-orange-500' };
  if (score >= 40) return { label: 'Cool', color: 'text-blue-500' };
  return { label: 'Cold', color: 'text-slate-500' };
}

/**
 * Get score breakdown for display
 */
export function getScoreBreakdown(listing: Partial<Listing>): {
  factor: string;
  score: number;
  weight: number;
  contribution: number;
}[] {
  const factors = [
    {
      factor: 'Days Since Expiry',
      score: calculateDaysScore(listing.expiry_date),
      weight: 30,
    },
    {
      factor: 'Price Range',
      score: calculatePriceScore(listing.price),
      weight: 25,
    },
    {
      factor: 'Property Type',
      score: calculatePropertyTypeScore(listing.property_type),
      weight: 15,
    },
    {
      factor: 'Owner Information',
      score: calculateOwnerInfoScore(listing),
      weight: 20,
    },
    {
      factor: 'Location',
      score: calculateLocationScore(listing.city),
      weight: 10,
    },
  ];

  return factors.map(f => ({
    ...f,
    contribution: Math.round((f.score * f.weight) / 100),
  }));
}
