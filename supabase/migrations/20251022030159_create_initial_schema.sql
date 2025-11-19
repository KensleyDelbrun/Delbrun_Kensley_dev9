/*
  # Citoyen Éclairé - Initial Database Schema
  
  ## Description
  Schema pour l'application mobile "Citoyen Éclairé" - Une plateforme éducative 
  pour les citoyens haïtiens avec support bilingue (FR/HT) et mode hors ligne.

  ## 1. Tables Créées
  
  ### categories
  - `id` (uuid, primary key) - Identifiant unique
  - `name_fr` (text) - Nom en français
  - `name_ht` (text) - Nom en créole haïtien
  - `description_fr` (text) - Description en français
  - `description_ht` (text) - Description en créole haïtien
  - `icon` (text) - Nom de l'icône
  - `color` (text) - Couleur de la catégorie
  - `order_index` (integer) - Ordre d'affichage
  - `created_at` (timestamptz) - Date de création

  ### articles
  - `id` (uuid, primary key) - Identifiant unique
  - `category_id` (uuid, foreign key) - Référence à la catégorie
  - `title_fr` (text) - Titre en français
  - `title_ht` (text) - Titre en créole haïtien
  - `content_fr` (text) - Contenu en français
  - `content_ht` (text) - Contenu en créole haïtien
  - `summary_fr` (text) - Résumé en français
  - `summary_ht` (text) - Résumé en créole haïtien
  - `image_url` (text) - URL de l'image
  - `media_type` (text) - Type de média (text, image, video, audio)
  - `media_url` (text) - URL du média additionnel
  - `is_featured` (boolean) - Article en vedette
  - `published_at` (timestamptz) - Date de publication
  - `created_at` (timestamptz) - Date de création
  - `updated_at` (timestamptz) - Date de mise à jour

  ### saved_articles
  - `id` (uuid, primary key) - Identifiant unique
  - `user_id` (uuid, foreign key) - Référence à l'utilisateur (auth.users)
  - `article_id` (uuid, foreign key) - Référence à l'article
  - `saved_at` (timestamptz) - Date de sauvegarde

  ### user_profiles
  - `id` (uuid, primary key) - Identifiant unique (lié à auth.users)
  - `email` (text) - Email de l'utilisateur
  - `full_name` (text) - Nom complet
  - `preferred_language` (text) - Langue préférée (fr/ht)
  - `created_at` (timestamptz) - Date de création
  - `updated_at` (timestamptz) - Date de mise à jour

  ## 2. Sécurité (RLS - Row Level Security)
  
  - RLS activé sur toutes les tables
  - Politiques pour lecture publique des catégories et articles
  - Politiques pour saved_articles: seul l'utilisateur peut voir/gérer ses sauvegardes
  - Politiques pour user_profiles: seul l'utilisateur peut voir/modifier son profil

  ## 3. Indexes
  
  - Index sur category_id dans articles pour recherches rapides
  - Index sur user_id et article_id dans saved_articles
  - Index sur published_at pour tri chronologique

  ## 4. Notes Importantes
  
  - Support bilingue complet (FR/HT) pour tous les contenus
  - Système de sauvegarde d'articles pour mode hors ligne
  - Articles featured pour la page d'accueil
  - Support multi-média (texte, image, vidéo, audio)
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_fr text NOT NULL,
  name_ht text NOT NULL,
  description_fr text NOT NULL,
  description_ht text NOT NULL,
  icon text NOT NULL,
  color text NOT NULL DEFAULT '#3B82F6',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  title_fr text NOT NULL,
  title_ht text NOT NULL,
  content_fr text NOT NULL,
  content_ht text NOT NULL,
  summary_fr text NOT NULL,
  summary_ht text NOT NULL,
  image_url text,
  media_type text DEFAULT 'text' CHECK (media_type IN ('text', 'image', 'video', 'audio')),
  media_url text,
  is_featured boolean DEFAULT false,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create saved_articles table
CREATE TABLE IF NOT EXISTS saved_articles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  saved_at timestamptz DEFAULT now(),
  UNIQUE(user_id, article_id)
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  preferred_language text DEFAULT 'fr' CHECK (preferred_language IN ('fr', 'ht')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_saved_articles_user ON saved_articles(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_articles_article ON saved_articles(article_id);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (public read)
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  TO public
  USING (true);

-- RLS Policies for articles (public read)
CREATE POLICY "Articles are viewable by everyone"
  ON articles FOR SELECT
  TO public
  USING (true);

-- RLS Policies for saved_articles
CREATE POLICY "Users can view own saved articles"
  ON saved_articles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved articles"
  ON saved_articles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved articles"
  ON saved_articles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Function to auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();