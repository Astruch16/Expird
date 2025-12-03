-- Migration: Add lead scoring and pipeline stages
-- Run this in your Supabase SQL Editor

-- Create pipeline stage enum
CREATE TYPE pipeline_stage AS ENUM (
  'new',
  'contacted',
  'responded',
  'meeting',
  'listed',
  'closed',
  'lost'
);

-- Add score and stage columns to listings table
ALTER TABLE listings
ADD COLUMN score INTEGER DEFAULT 0,
ADD COLUMN stage pipeline_stage DEFAULT 'new';

-- Create index for stage (useful for pipeline queries)
CREATE INDEX idx_listings_stage ON listings(stage);
CREATE INDEX idx_listings_score ON listings(score);

-- Add stage_changed activity type
ALTER TYPE activity_type ADD VALUE 'stage_changed';
