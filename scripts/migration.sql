-- GroomAI Complete Database Schema
-- Run this in Supabase SQL Editor

-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Salons table
CREATE TABLE IF NOT EXISTS salons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  price_range TEXT,
  image_url TEXT,
  description TEXT,
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  geom GEOMETRY(POINT, 4326),
  open_time TIME DEFAULT '09:00',
  close_time TIME DEFAULT '21:00',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Stylists table (NEW)
CREATE TABLE IF NOT EXISTS stylists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  avatar_url TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  specialties TEXT[],
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  stylist_id UUID REFERENCES stylists(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Users (syncs with Firebase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT UNIQUE,
  email TEXT,
  name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'salon_owner', 'admin')),
  salon_id UUID REFERENCES salons(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  stylist_id UUID REFERENCES stylists(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  service_name TEXT,
  price INTEGER,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR',
  method TEXT,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Grooming Records (NEW)
CREATE TABLE IF NOT EXISTS grooming_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  service_name TEXT,
  stylist_name TEXT,
  salon_name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Customer Preferences (NEW)
CREATE TABLE IF NOT EXISTS customer_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  preferred_stylist_id UUID REFERENCES stylists(id) ON DELETE SET NULL,
  preferred_salon_id UUID REFERENCES salons(id) ON DELETE SET NULL,
  preferred_services TEXT[],
  price_max INTEGER,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_salons_geom ON salons USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_salons_city ON salons(city);
CREATE INDEX IF NOT EXISTS idx_stylists_salon ON stylists(salon_id);
CREATE INDEX IF NOT EXISTS idx_services_salon ON services(salon_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_salon ON appointments(salon_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_payments_appointment ON payments(appointment_id);
CREATE INDEX IF NOT EXISTS idx_reviews_salon ON reviews(salon_id);
CREATE INDEX IF NOT EXISTS idx_grooming_records_user ON grooming_records(user_id);
