-- =====================================================
-- GHOSTDASH - MIGRATIONS SQL
-- Exécute ces commandes dans Supabase SQL Editor
-- =====================================================

-- 1. Ajouter colonnes manquantes dans subscriptions
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS telegram_username TEXT,
ADD COLUMN IF NOT EXISTS crypto_address TEXT,
ADD COLUMN IF NOT EXISTS crypto_currency TEXT;

-- 2. Créer table admin_settings pour stocker les adresses crypto et Telegram
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_username TEXT NOT NULL,
  btc_address TEXT,
  eth_address TEXT,
  usdt_address TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


-- 3. Insérer les settings par défaut (MODIFIE AVEC TES VRAIES ADRESSES)
INSERT INTO admin_settings (telegram_username, btc_address, eth_address, usdt_address)
VALUES (
  '@your_telegram_handle',
  'bc1q...your_btc_address',
  '0x...your_eth_address',
  'TR...your_usdt_trc20_address'
)
ON CONFLICT DO NOTHING;

-- 4. Activer RLS (Row Level Security) sur admin_settings
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- 5. Policy pour permettre à tout le monde de lire les settings (pour afficher les adresses sur la page subscribe)
CREATE POLICY "Anyone can read admin settings"
ON admin_settings FOR SELECT
TO public
USING (true);

-- 6. Policy pour permettre seulement aux super_admin de modifier
CREATE POLICY "Only super_admin can update admin settings"
ON admin_settings FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'super_admin'
  )
);

-- 7. Créer table pour stocker les sessions temporaires (pour login sans mot de passe)
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 8. Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_dashboards_user_id ON dashboards(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);

-- 9. Fonction pour nettoyer les sessions expirées (à exécuter périodiquement)
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM user_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- 10. Créer table pour stocker les données du dashboard par utilisateur
CREATE TABLE IF NOT EXISTS dashboard_user_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  page_name TEXT NOT NULL, -- 'home', 'statistics', 'profile', etc.
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, page_name)
);

-- 11. Index pour dashboard_user_data
CREATE INDEX IF NOT EXISTS idx_dashboard_user_data_user_id ON dashboard_user_data(user_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_user_data_page ON dashboard_user_data(page_name);

-- 12. RLS pour dashboard_user_data
ALTER TABLE dashboard_user_data ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read/write their own data
CREATE POLICY "Users can manage their own dashboard data"
ON dashboard_user_data
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policy: Super admin can read all dashboard data
CREATE POLICY "Super admin can read all dashboard data"
ON dashboard_user_data
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'super_admin'
  )
);

-- =====================================================
-- VÉRIFICATION
-- =====================================================
-- Exécute ces requêtes pour vérifier que tout est OK :

-- SELECT * FROM admin_settings;
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'subscriptions';
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'user_sessions';
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'dashboard_user_data';
