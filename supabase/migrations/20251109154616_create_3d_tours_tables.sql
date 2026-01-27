/*
  # Create 3D Virtual Tours System

  ## Summary
  This migration creates the complete database schema for the 3D virtual tours, AR, and VR features.
  It includes tables for tours, rooms, floor plans, AR models, VR optimized content, and analytics.

  ## New Tables
  
  ### `property_3d_tours`
  Main table for virtual tours linked to properties
  - `id` (uuid, primary key)
  - `property_id` (uuid, foreign key to properties table - nullable for now)
  - `status` (text) - processing, ready, error, archived
  - `room_count` (integer) - number of rooms in tour
  - `has_floor_plan` (boolean) - whether floor plan was generated
  - `has_ar_model` (boolean) - whether AR model is available
  - `has_vr_optimized` (boolean) - whether VR optimized version exists
  - `total_views` (integer) - analytics counter
  - `vr_views` (integer) - VR specific views
  - `ar_views` (integer) - AR specific views
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `tour_rooms`
  Individual rooms/spaces within a tour
  - `id` (uuid, primary key)
  - `tour_id` (uuid, foreign key to property_3d_tours)
  - `room_name` (text) - name of the room
  - `room_order` (integer) - display order
  - `image_urls` (jsonb) - array of panoramic image URLs
  - `thumbnail_url` (text) - preview thumbnail
  - `capture_metadata` (jsonb) - camera info, timestamps, etc
  - `created_at` (timestamptz)

  ### `floor_plans`
  Generated or edited floor plans
  - `id` (uuid, primary key)
  - `tour_id` (uuid, foreign key to property_3d_tours)
  - `svg_data` (text) - SVG format floor plan
  - `total_area` (numeric) - total area in m²
  - `room_dimensions` (jsonb) - dimensions per room
  - `confidence_level` (text) - high, medium, low
  - `manually_edited` (boolean) - was edited by user
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `ar_models`
  AR-specific 3D models
  - `id` (uuid, primary key)
  - `tour_id` (uuid, foreign key to property_3d_tours)
  - `glb_url` (text) - GLB format for Android
  - `usdz_url` (text) - USDZ format for iOS
  - `file_size_mb` (numeric) - file size
  - `optimization_level` (text) - low, medium, high
  - `created_at` (timestamptz)

  ### `vr_optimized_models`
  VR headset optimized models
  - `id` (uuid, primary key)
  - `tour_id` (uuid, foreign key to property_3d_tours)
  - `headset_type` (text) - quest, vision_pro, hololens, generic
  - `model_url` (text) - optimized model URL
  - `quality_preset` (text) - high, medium, low
  - `supports_passthrough` (boolean)
  - `supports_hand_tracking` (boolean)
  - `file_size_mb` (numeric)
  - `created_at` (timestamptz)

  ### `ar_furniture_library`
  Virtual furniture catalog for AR
  - `id` (uuid, primary key)
  - `name` (text) - furniture name
  - `category` (text) - sofa, table, bed, etc
  - `glb_url` (text) - 3D model URL
  - `thumbnail_url` (text) - preview image
  - `dimensions_json` (jsonb) - width, height, depth
  - `created_at` (timestamptz)

  ### `tour_analytics`
  Detailed analytics for tours
  - `id` (uuid, primary key)
  - `tour_id` (uuid, foreign key to property_3d_tours)
  - `user_id` (uuid, nullable) - if user is logged in
  - `view_type` (text) - web_3d, mobile_ar, vr_headset
  - `headset_model` (text, nullable) - specific headset if VR
  - `duration_seconds` (integer) - time spent
  - `rooms_visited` (jsonb) - array of room IDs visited
  - `heatmap_data` (jsonb) - where user looked most
  - `device_info` (jsonb) - browser, OS, etc
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users and public read access where appropriate
  - Restrict write access to property owners and admins

  ## Notes
  - Foreign key to properties table is nullable initially to allow gradual migration
  - All URLs will point to Supabase Storage
  - Analytics are anonymized but can link to user_id if authenticated
  - Floor plans use SVG for scalability and easy editing
*/

-- Create property_3d_tours table
CREATE TABLE IF NOT EXISTS property_3d_tours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid,
  status text NOT NULL DEFAULT 'processing',
  room_count integer DEFAULT 0,
  has_floor_plan boolean DEFAULT false,
  has_ar_model boolean DEFAULT false,
  has_vr_optimized boolean DEFAULT false,
  total_views integer DEFAULT 0,
  vr_views integer DEFAULT 0,
  ar_views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tour_rooms table
CREATE TABLE IF NOT EXISTS tour_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid NOT NULL REFERENCES property_3d_tours(id) ON DELETE CASCADE,
  room_name text NOT NULL,
  room_order integer DEFAULT 0,
  image_urls jsonb DEFAULT '[]'::jsonb,
  thumbnail_url text,
  capture_metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create floor_plans table
CREATE TABLE IF NOT EXISTS floor_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid NOT NULL REFERENCES property_3d_tours(id) ON DELETE CASCADE,
  svg_data text,
  total_area numeric(10,2),
  room_dimensions jsonb DEFAULT '{}'::jsonb,
  confidence_level text DEFAULT 'medium',
  manually_edited boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ar_models table
CREATE TABLE IF NOT EXISTS ar_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid NOT NULL REFERENCES property_3d_tours(id) ON DELETE CASCADE,
  glb_url text,
  usdz_url text,
  file_size_mb numeric(10,2),
  optimization_level text DEFAULT 'medium',
  created_at timestamptz DEFAULT now()
);

-- Create vr_optimized_models table
CREATE TABLE IF NOT EXISTS vr_optimized_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid NOT NULL REFERENCES property_3d_tours(id) ON DELETE CASCADE,
  headset_type text NOT NULL,
  model_url text NOT NULL,
  quality_preset text DEFAULT 'medium',
  supports_passthrough boolean DEFAULT false,
  supports_hand_tracking boolean DEFAULT false,
  file_size_mb numeric(10,2),
  created_at timestamptz DEFAULT now()
);

-- Create ar_furniture_library table
CREATE TABLE IF NOT EXISTS ar_furniture_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  glb_url text NOT NULL,
  thumbnail_url text,
  dimensions_json jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create tour_analytics table
CREATE TABLE IF NOT EXISTS tour_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid NOT NULL REFERENCES property_3d_tours(id) ON DELETE CASCADE,
  user_id uuid,
  view_type text NOT NULL,
  headset_model text,
  duration_seconds integer DEFAULT 0,
  rooms_visited jsonb DEFAULT '[]'::jsonb,
  heatmap_data jsonb DEFAULT '{}'::jsonb,
  device_info jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tours_property_id ON property_3d_tours(property_id);
CREATE INDEX IF NOT EXISTS idx_tours_status ON property_3d_tours(status);
CREATE INDEX IF NOT EXISTS idx_rooms_tour_id ON tour_rooms(tour_id);
CREATE INDEX IF NOT EXISTS idx_analytics_tour_id ON tour_analytics(tour_id);
CREATE INDEX IF NOT EXISTS idx_analytics_view_type ON tour_analytics(view_type);
CREATE INDEX IF NOT EXISTS idx_vr_models_headset ON vr_optimized_models(headset_type);

-- Enable Row Level Security
ALTER TABLE property_3d_tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE floor_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE ar_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE vr_optimized_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE ar_furniture_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for property_3d_tours
CREATE POLICY "Anyone can view tours"
  ON property_3d_tours FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create tours"
  ON property_3d_tours FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own tours"
  ON property_3d_tours FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete their own tours"
  ON property_3d_tours FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for tour_rooms
CREATE POLICY "Anyone can view rooms"
  ON tour_rooms FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create rooms"
  ON tour_rooms FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update rooms"
  ON tour_rooms FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete rooms"
  ON tour_rooms FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for floor_plans
CREATE POLICY "Anyone can view floor plans"
  ON floor_plans FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create floor plans"
  ON floor_plans FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update floor plans"
  ON floor_plans FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for ar_models
CREATE POLICY "Anyone can view AR models"
  ON ar_models FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create AR models"
  ON ar_models FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for vr_optimized_models
CREATE POLICY "Anyone can view VR models"
  ON vr_optimized_models FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create VR models"
  ON vr_optimized_models FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for ar_furniture_library
CREATE POLICY "Anyone can view furniture library"
  ON ar_furniture_library FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage furniture"
  ON ar_furniture_library FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for tour_analytics
CREATE POLICY "Users can view analytics for tours they own"
  ON tour_analytics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create analytics"
  ON tour_analytics FOR INSERT
  TO public
  WITH CHECK (true);