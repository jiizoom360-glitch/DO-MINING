# DO-MINING — LIMITES ET FRONTIÈRES DU SYSTÈME (SYSTEM BOUNDARIES)

**Statut :** FIGÉ (FROZEN)  
**Date :** 2026-09-15  
**Version :** 1.0.0-phase0  

---

## 1. DÉLIMITATION DES PÉRIMÈTRES (BOUNDED CONTEXTS)

Le système DO-Mining est découpé en contextes délimités étanches pour interdire tout couplage spaghetti :

```
+-------------------------------------------------------------------------------+
|                                  DO-MINING                                    |
|                                                                               |
|  [ CONTENT STRUCTURE ]          [ CONTENT BODY ]        [ LEARNING ENGINE ]   |
|  Universal Content Tree         Versioned Revisions     Progressions          |
|  Arbre récursif de nœuds        Médias & Textes         Complétions & Temps   |
|                                                                               |
|  [ ASSESSMENT & QUIZ ]          [ LIVE SESSIONS ]       [ ACCESS & OFFERINGS] |
|  Tentatives, Grilles, Barèmes   Salles temps-réel       Droits, Packages      |
|  Évaluations techniques         Technicien expert       Périmètre d'accès     |
|                                                                               |
|  [ AUDIT & COMPLIANCE ]                                 [ IDENTITY & PROFILE] |
|  Journaux immuables             --------------------->  Rôles, Attributions   |
|  Empreintes cryptographiques                            Apprenant / Formateur |
+-------------------------------------------------------------------------------+
                                        | (Ports abstraits)
                                        v
+-------------------------------------------------------------------------------+
|                             INFRASTRUCTURE PORTS                              |
|   StoragePort  |  LiveSessionPort  |  NotificationPort  |  DeploymentPort     |
+-------------------------------------------------------------------------------+
```

---

## 2. DÉTAIL DES CONTEXTES

### 2.1 Contexte Structure de Contenu (`Content Structure`)
- **Responsabilité :** Maintenir la taxonomie, la hiérarchie arborescente récursive (`ContentNode`), les relations parent-enfant, le positionnement ordinal (`sort_order`) et la visibilité (brouillon, publié, archivé).
- **Interdiction formelle :** Ne doit jamais stocker les vidéos, les longs textes de cours ou les réponses aux quiz.

### 2.2 Contexte Contenu Réel & Médias (`Content Body & Media`)
- **Responsabilité :** Associer à un nœud de contenu son corps pédagogique réel (texte Markdown/HTML structuré, références de flux vidéo R2, documents téléchargeables, durées théoriques).
- **Interdiction formelle :** Ne contient aucune logique d'accès utilisateur ni de statut d'avancement.

### 2.3 Contexte Progression & État d'Apprentissage (`Learning State`)
- **Responsabilité :** Enregistrer la progression des apprenants (pourcentage, étape actuelle, statut `NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`), le temps passé et les horodatages de complétion.
- **Interdiction formelle :** Ne modifie jamais l'arbre des contenus.

### 2.4 Contexte Évaluation & Certification (`Assessment`)
- **Responsabilité :** Gérer les banques de questions minières, les critères de validation, les scores, les tentatives multiples et les preuves de compétence indispensables aux exigences réglementaires de l'industrie extractive.

### 2.5 Contexte Sessions Live & Téléprésence (`Live Sessions`)
- **Responsabilité :** Coordonner les créneaux synchrones avec les formateurs et techniciens experts.
- **Frontière :** Déléguée à 100% via `LiveSessionPort`. Aucune dépendance d'implémentation Jitsi n'est tolérée dans le modèle de domaine.

### 2.6 Contexte Droits d'Accès & Offres (`Access & Commercial Configuration`)
- **Responsabilité :** Matérialiser l'ouverture des nœuds d'apprentissage en fonction d'un abonnement, d'une licence entreprise ou d'un achat à l'acte, via des jetons d'accès (`Entitlements`).

### 2.7 Contexte Audit & Traçabilité Réglementaire (`Audit & Compliance`)
- **Responsabilité :** Émettre et persister des événements d'audit immuables pour chaque action critique (délivrance d'attestation, validation de module de sécurité, modification d'un barème de quiz).

### 2.8 Contexte Profils de Dashboard & Vues de Rôles (`Dashboard Profiles`)
- **Responsabilité :** Projeter pour chaque rôle (Apprenant, Formateur, Administrateur, Auditeur) une grille de widgets dynamiques et adaptables (`DashboardProfile`), alimentée par des flux de lecture spécifiques plutôt que par des interfaces codées en dur.

---

## 3. CE QUI EST STRICTEMENT INTERDIT DANS LE NOYAU (INVARIANTS)

1. **Aucun secret côté client :** Les clés privées de stockage, signatures de jetons et mots de passe ne transitent jamais vers le navigateur.
2. **Aucune logique métier dans les composants UI :** Les composants d'affichage (React/Next) reçoivent des structures de données nettoyées et projetées. Aucun calcul d'éligibilité ou de progression complexe n'est exécuté dans les vues.
3. **Zéro supposition de profondeur fixe :** Le code ne doit jamais comporter de requêtes hardcodées comme `SELECT * FROM modules WHERE course_id = ... JOIN lessons WHERE ...`. Tout parcours est récursif ou exploite des requêtes hiérarchiques (CTEs PostgreSQL).
4. **Indépendance des Fournisseurs :** Remplacer Supabase par une instance PostgreSQL auto-hébergée ou Cloudflare R2 par un bucket MinIO sur site minier isolé ne doit nécessiter aucune retouche du code de domaine.
