export type ListingStatus = 'expired' | 'terminated' | 'active';
export type ListingType = 'expired' | 'terminated';
export type Board = 'greater_vancouver' | 'fraser_valley' | 'chilliwack';

export interface Listing {
  id: string;
  address: string;
  city: string;
  neighborhood: string | null;
  board: Board;
  listing_type: ListingType;
  status: ListingStatus;
  expiry_date: string;
  price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  square_feet: number | null;
  latitude: number;
  longitude: number;
  notes: string | null;
  mls_number: string | null;
  owner_name: string | null;
  owner_phone: string | null;
  owner_email: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface FollowUp {
  id: string;
  listing_id: string;
  scheduled_date: string;
  sent: boolean;
  sent_at: string | null;
  created_at: string;
  user_id: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  status: ListingStatus;
  listing_type: ListingType;
  address: string;
  city: string;
}

export interface HotspotData {
  latitude: number;
  longitude: number;
  count: number;
  listings: Listing[];
}

export interface DashboardStats {
  totalExpired: number;
  totalTerminated: number;
  totalSent: number;
  totalActive: number;
  pendingFollowUps: number;
}
