/*
  # User Preferences Migration
  
  ## Description
  Création de la table user_preferences pour stocker les préférences utilisateur
  côté serveur (settings, notifications, etc.)
  
  ## Tables créées
  
  ### user_preferences
  - `id` (uuid, primary key) - Identifiant unique (lié à auth.users)
  - `dark_mode` (boolean) - Mode sombre activé
  - `dark_mode_auto` (boolean) - Thème automatique (système) activé
  - `notifications_enabled` (boolean) - Notifications activées
  - `notification_sound` (boolean) - Son de notification activé
  - `auto_download` (boolean) - Téléchargement automatique
  - `text_size` (numeric) - Taille du texte
  - `new_articles_notif` (boolean) - Notification nouveaux articles
  - `read_reminders_notif` (boolean) - Notification rappels de lecture
  - `weekly_summary_notif` (boolean) - Notification résumé hebdomadaire
  - `community_updates_notif` (boolean) - Notification mises à jour communautaires
  - `important_news_notif` (boolean) - Notification actualités importantes
  - `created_at` (timestamptz) - Date de création
  - `updated_at` (timestamptz) - Date de mise à jour
*/

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  dark_mode boolean DEFAULT false,
  dark_mode_auto boolean DEFAULT true,
  notifications_enabled boolean DEFAULT true,
  notification_sound boolean DEFAULT true,
  auto_download boolean DEFAULT false,
  text_size numeric DEFAULT 1.0,
  new_articles_notif boolean DEFAULT true,
  read_reminders_notif boolean DEFAULT false,
  weekly_summary_notif boolean DEFAULT true,
  community_updates_notif boolean DEFAULT false,
  important_news_notif boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_preferences_id ON user_preferences(id);

-- Enable Row Level Security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_preferences
DROP POLICY IF EXISTS "Users can view own preferences" ON user_preferences;
CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;
CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;
CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON user_preferences;
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
