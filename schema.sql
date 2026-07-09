-- D1 Database Schema for Wedding Invitation Website

-- Guestbook entries table
CREATE TABLE IF NOT EXISTS guestbook (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  message TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);

-- RSVP entries table
CREATE TABLE IF NOT EXISTS rsvp (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  attendance TEXT NOT NULL,
  guests_count INTEGER DEFAULT 1,
  dietary_pref TEXT DEFAULT 'halal',
  prayer TEXT,
  created_at TEXT NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_guestbook_created_at ON guestbook(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rsvp_created_at ON rsvp(created_at DESC);
