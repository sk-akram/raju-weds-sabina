-- RSVPs table
CREATE TABLE IF NOT EXISTS rsvps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  attendance TEXT NOT NULL, -- 'NIKAH', 'WALIMA', 'BOTH', 'DECLINE'
  guests_count INTEGER DEFAULT 1,
  dietary_pref TEXT DEFAULT 'halal',
  prayer TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Guestbook entries table
CREATE TABLE IF NOT EXISTS guestbook (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Images table for caching and metadata
CREATE TABLE IF NOT EXISTS images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  r2_key TEXT NOT NULL UNIQUE,
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  category TEXT, -- 'pre-wedding', 'ceremony', 'reception', 'other'
  caption TEXT,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rsvps_email ON rsvps(email);
CREATE INDEX IF NOT EXISTS idx_rsvps_attendance ON rsvps(attendance);
CREATE INDEX IF NOT EXISTS idx_guestbook_created ON guestbook(created_at);
CREATE INDEX IF NOT EXISTS idx_images_r2_key ON images(r2_key);
CREATE INDEX IF NOT EXISTS idx_images_category ON images(category);
CREATE INDEX IF NOT EXISTS idx_images_last_accessed ON images(last_accessed);
