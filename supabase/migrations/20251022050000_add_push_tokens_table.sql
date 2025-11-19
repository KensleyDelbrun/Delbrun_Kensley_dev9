/*
  # Citoyen Éclairé - Table des Push Tokens

  ## Description
  Cette migration ajoute une table pour stocker les tokens de notification push
  des appareils des utilisateurs. Ces tokens sont essentiels pour pouvoir envoyer
  des notifications ciblées via les services d'Apple (APNs) et Google (FCM),
  orchestrées par Expo.

  ## 1. Nouvelle Table: `push_tokens`
  - `id` (uuid, primary key): Identifiant unique de l'enregistrement.
  - `user_id` (uuid, foreign key): Lie le token à un utilisateur spécifique.
  - `token` (text, unique): Le token de notification push fourni par Expo. Il est unique pour éviter les doublons.
  - `created_at` (timestamptz): Date de création du token.

  ## 2. Sécurité (RLS)
  - RLS est activée sur la table.
  - Les politiques garantissent qu'un utilisateur ne peut insérer, voir ou supprimer que ses propres tokens. Personne ne peut accéder aux tokens d'un autre utilisateur.

  ## 3. Index
  - Un index est créé sur `user_id` pour accélérer les recherches de tokens pour un utilisateur donné.
*/

-- Create push_tokens table
CREATE TABLE IF NOT EXISTS push_tokens (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  token text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, token) -- Un utilisateur ne peut pas avoir deux fois le même token
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_push_tokens_user_id ON push_tokens(user_id);

-- Enable Row Level Security
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies for push_tokens
CREATE POLICY "Users can view their own push tokens"
  ON push_tokens FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own push tokens"
  ON push_tokens FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own push tokens"
  ON push_tokens FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
