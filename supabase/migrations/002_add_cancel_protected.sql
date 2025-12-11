-- Migration: Add cancel protected listing support
-- Run this in your Supabase SQL Editor

-- Add cancel_protected_date column to track when the listing was cancel protected
-- The 60-day countdown starts from this date
ALTER TABLE listings
ADD COLUMN cancel_protected_date DATE DEFAULT NULL;

-- Create index for efficient queries on cancel protected listings
CREATE INDEX idx_listings_cancel_protected_date ON listings(cancel_protected_date)
WHERE cancel_protected_date IS NOT NULL;

-- Note: listing_type and status columns already exist as text/varchar
-- We just need to ensure 'cancel_protected' is a valid value when inserting
-- No enum changes needed since these are likely text columns
