# DO-MINING — MODÈLE DE GESTION DES DÉFAILLANCES (FAILURE MODEL)

**Statut :** FIGÉ (FROZEN)  
**Date :** 2026-09-15  
**Version :** 1.0.0-phase0  

---

## 1. PRINCIPE DE RÉSILIENCE ET DÉGRADATION ÉLÉGANTE

DO-Mining doit adopter une posture antifragile : la défaillance d'un composant périphérique ou d'un fournisseur d'infrastructure ne doit jamais faire s'écrouler l'intégralité du système. L'application doit informer l'utilisateur avec lucidité, basculer sur un mode dégradé clair et garantir l'intégrité des états déjà validés.

---

## 2. SCÉNARIOS DE DÉFAILLANCE & COMPORTEMENTS ATTENDUS

### 2.1 Indisponibilité de Cloudflare R2 (Stockage Médias)
- **Symptôme :** Les requêtes vers R2 renvoient des erreurs 500/503 ou expirent (timeout).
- **Comportement attendu :**
  - La navigation dans l'arbre des contenus, la lecture des synthèses textuelles Markdown et les quiz restent 100% fonctionnels.
  - Le lecteur vidéo ou le bloc de téléchargement affiche un composant de remplacement clair : *"Support multimédia temporairement inaccessible. Les serveurs de diffusion média sont en maintenance. Vos textes de cours et votre progression restent actifs."*
  - Le système ne bloque jamais la progression textuelle de l'apprenant en cas de panne réseau média externe.

### 2.2 Indisponibilité de Jitsi (Classes Live & Visioconférence)
- **Symptôme :** Le serveur Jitsi est injoignable, refuse la connexion ou les certificats TLS échouent.
- **Comportement attendu :**
  - La session live affiche un statut clair d'incident technique côté formateur et apprenant : *"La salle de visioconférence est momentanément indisponible. Session reportée ou lien de secours en cours d'activation."*
  - Un champ de secours permet à l'administrateur d'injecter une URL alternative manuelle (lien Meet / Teams) via le `ManualLiveSessionAdapter` sans modifier le code.
  - Le reste de l'espace de formation (cours asynchrones) reste totalement opérationnel.

### 2.3 Indisponibilité de PostgreSQL / Supabase (Base Métier Principale)
- **Symptôme :** La connexion TCP à la base de données échoue ou le pool de connexions est saturé.
- **Comportement attendu :**
  - Bascule immédiate sur une page d'erreur système sobre et technique (HTTP 503) : *"DO-Mining : Plateforme en maintenance de base de données. Aucune donnée n'a été altérée. Reprise en cours."*
  - Côté client, aucune donnée corrompue n'est écrite en cache local sans confirmation transactionnelle du serveur.
  - Tentatives de reconnexion avec backoff exponentiel (1s, 2s, 4s, max 10s) avant renvoi de l'erreur finale.

### 2.4 Configuration d'Intégration Manquante (Missing Integration Config)
- **Symptôme :** Une variable d'environnement ou une clé de configuration d'adaptateur n'est pas définie au démarrage de l'environnement (ex: variables R2 ou Jitsi absentes).
- **Comportement attendu :**
  - Le système ne doit **JAMAIS** crasher silencieusement ou bloquer le boot complet de l'application.
  - La factory de ports bascule automatiquement sur l'implémentation par défaut : `MockAdapter` ou `ManualAdapter`.
  - Un avertissement explicite et structuré est émis dans les logs de démarrage serveur : `[WARN] StoragePort: R2 credentials missing. Falling back to MockStorageAdapter (In-Memory).`

### 2.5 Référence Invalide dans une Branche (Invalid Node Reference)
- **Symptôme :** Un module pointe vers un prérequis inexistant, ou une règle de déblocage référence un UUID supprimé.
- **Comportement attendu :**
  - Le moteur de déblocage (`UnlockEngine`) traite la référence orpheline de manière défensive : il consigne une alerte dans les journaux système (`CORRUPT_PREREQUISITE_LOG`) et débloque le nœud par défaut pour éviter qu'un apprenant soit bloqué indéfiniment par une erreur administrative.
  - L'interface d'administration signale un badge d'avertissement sur le nœud concerné : *"Dépendance rompue détectée"*.

### 2.6 Incohérence de `parent_id` (Boucle Cyclique ou Orphelin)
- **Symptôme :** Une mauvaise mise à jour de données tente de faire d'un nœud son propre parent (`A -> B -> A`) ou pointe vers un `parent_id` non présent.
- **Comportement attendu :**
  - **Au niveau base de données :** Triggers PostgreSQL empêchant la création de cycles dans l'arbre hiérarchique.
  - **Au niveau runtime :** L'algorithme de reconstruction de l'arborescence limite la profondeur maximale de récursion (sécurité anti-dépassement de pile, cap à 50 niveaux). Tout nœud en boucle ou orphelin est isolé dans une branche spéciale `"Contenus orphelins / Non rattachés"` visible uniquement par l'administrateur.

### 2.7 Média ou Ressource Manquante (404 Media Key)
- **Symptôme :** La `storage_key` enregistrée dans PostgreSQL n'existe pas ou plus dans le bucket R2.
- **Comportement attendu :**
  - Pas d'écran blanc ni de crash de l'interface.
  - Affichage d'un conteneur média d'attente avec icône descriptive : *"Ressource en cours de numérisation ou temporairement indisponible (Réf: granulats/m03/...). Contactez le support pédagogique."*

### 2.8 Module Archivé en Cours d'Étude
- **Symptôme :** L'administrateur passe un module en statut `ARCHIVED` alors que des apprenants sont actuellement inscrits ou en cours de lecture.
- **Comportement attendu :**
  - Les nouveaux inscrits ne voient plus le module dans le catalogue.
  - Les apprenants ayant déjà démarré le module conservent un accès en lecture seule (`Read-Only Archive Access`) pour terminer leur cursus sans rupture de formation.
  - L'intégrité de leur historique de complétion et de leurs attestations antérieures reste scellée et valide.

### 2.9 Fournisseur Externe en Mode MOCK
- **Symptôme :** L'application s'exécute avec les adaptateurs de simulation (`MockStorageAdapter`, `MockLiveSessionAdapter`).
- **Comportement attendu :**
  - L'interface utilisateur fonctionne sans encombre avec des flux et données de test représentatifs.
  - Un bandeau discret de statut d'environnement informe les développeurs, testeurs ou auditeurs : `[MODE ISOLÉ — ADAPTATEURS MOCK ACTIFS]`.
  - Aucune tentative de requête réseau réelle n'est émise vers l'extérieur.
