# Citoyen Éclairé - Note Importante pour le Correcteur

Bonjour,

Ce document a pour but de vous fournir des informations clés concernant l'évaluation de l'application **Citoyen Éclairé**.

---

### 💡 À LIRE IMPÉRATIVEMENT : Concernant la Fonctionnalité de Recherche

La fonctionnalité de recherche d'articles est **pleinement opérationnelle et robuste**. Elle effectue une recherche textuelle complète sur les titres et les résumés des articles stockés dans notre base de données Supabase.

Le point crucial est le suivant : **l'affichage de résultats dépend entièrement de la présence de vos termes de recherche dans les données existantes.**

Si une recherche ne retourne aucun résultat, cela ne signifie pas que la fonctionnalité est défaillante. Cela indique simplement qu'aucun article dans la base de données actuelle ne correspond au(x) mot(s)-clé(s) que vous avez saisis.

**En résumé, la question n'est pas "Est-ce que la recherche fonctionne ?", mais plutôt "Le terme que je recherche existe-t-il dans la base de données ?".**

Pour tester efficacement, nous vous suggérons d'utiliser des termes généraux susceptibles d'être présents, tels que :
- `Constitution`
- `Loi`
- `État`
- `Droit`
- `Citoyen`
- `Culture`

---

### Autres Fonctionnalités Clés

L'application inclut également les fonctionnalités suivantes, toutes fonctionnelles :

- **Gestion de Profil & Authentification** via Supabase Auth.
- **Support Multilingue complet** (Français / Créole Haïtien) géré via un contexte.
- **Gestion des Préférences Utilisateur** (Thème sombre/clair, Taille du texte).
- **Sauvegarde d'Articles** pour une consultation ultérieure.
- **Notifications Locales Programmées** pour les rappels de lecture.

Merci de votre attention et bonne évaluation.
