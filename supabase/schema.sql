-- ============================================
-- MPP Pandeglang Service Finder Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE (Admin Authentication)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. AGENCIES TABLE (Instansi)
-- ============================================
CREATE TABLE IF NOT EXISTS agencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. SERVICES TABLE (Layanan)
-- ============================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  nama_layanan TEXT NOT NULL,
  dasar_hukum TEXT[], -- Array of strings
  persyaratan TEXT[] NOT NULL,
  sistem_mekanisme_prosedur TEXT[] NOT NULL,
  jangka_waktu TEXT NOT NULL,
  lokasi_gerai TEXT NOT NULL,
  biaya TEXT,
  catatan_tambahan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. MPP PROFILE TABLE (Profil MPP)
-- ============================================
CREATE TABLE IF NOT EXISTS mpp_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  operating_hours_workdays TEXT,
  operating_hours_weekends TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  social_media_instagram TEXT,
  social_media_facebook TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. CHAT LOGS TABLE (Analytics)
-- ============================================
CREATE TABLE IF NOT EXISTS chat_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  query TEXT NOT NULL,
  service_inquired TEXT,
  response_time INTEGER, -- in milliseconds
  was_successful BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_services_agency_id ON services(agency_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_created_at ON chat_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_logs_service_inquired ON chat_logs(service_inquired);

-- ============================================
-- ROW LEVEL SECURITY (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE mpp_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;

-- Public read access for agencies and services
CREATE POLICY "Allow public read access on agencies" ON agencies
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on services" ON services
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on mpp_profile" ON mpp_profile
  FOR SELECT USING (true);

-- Authenticated users can insert chat logs
CREATE POLICY "Allow public insert on chat_logs" ON chat_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on chat_logs" ON chat_logs
  FOR SELECT USING (true);

-- Admin operations (you'll need to implement proper auth)
-- For now, allowing all operations for authenticated users
CREATE POLICY "Allow authenticated users to manage agencies" ON agencies
  FOR ALL USING (true);

CREATE POLICY "Allow authenticated users to manage services" ON services
  FOR ALL USING (true);

CREATE POLICY "Allow authenticated users to manage mpp_profile" ON mpp_profile
  FOR ALL USING (true);

CREATE POLICY "Allow authenticated users to manage users" ON users
  FOR ALL USING (true);

-- ============================================
-- TRIGGERS for updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agencies_updated_at BEFORE UPDATE ON agencies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mpp_profile_updated_at BEFORE UPDATE ON mpp_profile
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
