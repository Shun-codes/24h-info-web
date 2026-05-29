-- ============================================================
-- L'Uni Vert — Schéma de base de données
-- PostgreSQL 14+
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  name        VARCHAR(100) NOT NULL,
  phone       VARCHAR(20),
  city        VARCHAR(100),
  avatar_url  TEXT,
  role        VARCHAR(20) DEFAULT 'user'
                CHECK (role IN ('user', 'moderator', 'admin')),
  is_banned   BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(100) NOT NULL,
  slug  VARCHAR(100) UNIQUE NOT NULL,
  icon  VARCHAR(10)
);

INSERT INTO categories (name, slug, icon) VALUES
  ('Plantes d''intérieur', 'plantes-interieur', NULL),
  ('Plantes fleuries',     'plantes-fleuries',  NULL),
  ('Graines / Bulbes',     'graines-bulbes',    NULL),
  ('Arbres / Arbustes',    'arbres-arbustes',   NULL),
  ('Outils / Matériel',    'outils-materiel',   NULL),
  ('Services / Conseils',  'services-conseils', NULL),
  ('Cours / Ateliers',     'cours-ateliers',    NULL),
  ('Mobilier de jardin',   'mobilier-jardin',   NULL),
  ('Autres',               'autres',            NULL)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon;

CREATE TABLE IF NOT EXISTS listings (
  id             SERIAL PRIMARY KEY,
  user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id    INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  title          VARCHAR(255) NOT NULL,
  description    TEXT,
  price          DECIMAL(10,2) CHECK (price >= 0),
  city           VARCHAR(100),
  contact_method VARCHAR(20) DEFAULT 'message'
                   CHECK (contact_method IN ('message', 'phone', 'both')),
  is_hidden      BOOLEAN DEFAULT false,
  expires_at     TIMESTAMPTZ DEFAULT NOW() + INTERVAL '90 days',
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS listing_images (
  id         SERIAL PRIMARY KEY,
  listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  position   SMALLINT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS favorites (
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, listing_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id          SERIAL PRIMARY KEY,
  listing_id  INTEGER REFERENCES listings(id) ON DELETE CASCADE,
  sender_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  is_read     BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reports (
  id          SERIAL PRIMARY KEY,
  listing_id  INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  reporter_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  reason      VARCHAR(100) NOT NULL,
  description TEXT,
  status      VARCHAR(20) DEFAULT 'pending'
                CHECK (status IN ('pending', 'resolved', 'dismissed')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_listings_user_id     ON listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_category_id ON listings(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_city        ON listings(city);
CREATE INDEX IF NOT EXISTS idx_listings_expires_at  ON listings(expires_at);
CREATE INDEX IF NOT EXISTS idx_listings_created_at  ON listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_listing_id  ON messages(listing_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_reports_status       ON reports(status);
