# DO-MINING — ARCHITECTURE FREEZE (PHASE 0)

**Statut :** FIGÉ (FROZEN)  
**Date :** 2026-09-15  
**Version :** 1.0.0-phase0  
**Auteurs :** Lead Architect & Core Engineering Team  

---

## 1. VISION & DOCTRINE FONDAMENTALE

DO-Mining est un LMS (Learning Management System) technique et professionnel haut de gamme dédié aux industries extractives (Mines & Carrières).

### La Doctrine Maîtresse

> **NEW NICHE != NEW APPLICATION**  
> **NEW NICHE = NEW BRANCH + NEW CONTENT + NEW RULES + NEW COMMERCIAL CONFIGURATION**

L'architecture est conçue pour accueillir indéfiniment de nouveaux verticaux métiers :
1. **Vertical Pilote (Phase 1) :** *Mines & Carrières* → *Exploitation des carrières* → *Production des granulats*
2. **Extensions Futures (sans retouche de code applicatif ni migration de schéma structurel) :**
   - Forage
   - Minage & Tirs
   - QHSE & Risques Miniers
   - Maintenance des engins et installations fixes
   - Topographie & Géomatique minière
   - Nouvelles niches et filières spécialisées

Le noyau (*Core Engine*) est hermétique aux spécificités d'un métier donné. Un domaine minier s'exprime uniquement par ses **données**, ses **règles d'évaluation/déblocage** et ses **paramètres de droits d'accès**.

---

## 2. PRINCIPES ARCHITECTURAUX MAJEURS

1. **Universal Content Tree (UCT) Récursif :**
   Aucune table rigide (`domains`, `courses`, `lessons`...) n'impose une profondeur fixe. Le contenu est modélisé par un arbre récursif de nœuds (`ContentNode`) avec auto-référence (`parent_id`). La profondeur est conceptuellement illimitée.
2. **Séparation Stricte des Préoccupations (SoC) :**
   L'arbre structurel ne porte ni le contenu brut (médias/textes), ni l'état d'apprentissage de l'utilisateur, ni les règles de progression, ni la configuration commerciale. Chaque dimension est découplée dans son propre domaine de données.
3. **Hexagonale & Provider-Agnostic (Ports & Adapters) :**
   Aucun SDK de fournisseur tiers (Supabase, Cloudflare, Vercel, Jitsi, Stripe, etc.) ne doit être invoqué dans la couche Domaine. Toute interaction d'infrastructure transite obligatoirement par un Port abstrait.
4. **Politique d'Intégration Graduelle (MVP Isolé) :**
   Pour la phase MVP, aucune API tierce n'est connectée directement. Chaque port dispose d'au moins :
   - Un `MockAdapter` (pour les tests unitaires et le prototypage local hors-ligne).
   - Un `ManualAdapter` (pour l'exploitation contrôlée du MVP sans automatisation risquée).
   - Un emplacement réservé pour le `RealAdapter` futur.
5. **Stockage Hybride Asymétrique (Relational vs Object Store) :**
   - **PostgreSQL (Supabase) :** Source de vérité relationnelle pour la structure, les métadonnées, les états d'apprentissage, les audits et les configurations d'accès. Strictement aucun blob lourd binaire.
   - **Cloudflare R2 (S3-compatible) :** Stockage immuable des médias volumineux (vidéos 4K, flux audio, manuels PDF, workbooks interactifs). Les tables PostgreSQL ne stockent que des clés d'objets (`storage_key`), des hachages d'intégrité (`sha256`) et des métadonnées de format.
6. **Antifragilité & Auditabilité :**
   - Identifiants universels immuables (`UUIDv7` ou `UUIDv4`).
   - Aucune suppression physique destructive (`soft archive` obligatoire sur les nœuds publiés).
   - Traçabilité complète des événements de formation à des fins de certification et d'audit légal (QHSE).

---

## 3. IDENTITÉ DE MARQUE & TOKENS DE DESIGN

L'univers visuel de DO-Mining reflète la rigueur technique, la sécurité industrielle et le standing des grands opérateurs miniers mondiaux (style Apple / Stripe / Linear).

```
--color-primary:       #08AFC1;  /* Turquoise technique / Précision */
--color-primary-deep:  #075A70;  /* Bleu pétrole profond / Autorité */
--color-primary-soft:  #DDF8FA;  /* Fond d'accentuation léger / Surbrillance */
--color-accent:        #F4C542;  /* Jaune or industriel / Engins / Avertissement */
--color-white:         #FFFFFF;  /* Blanc absolu */
--color-ink:           #12242B;  /* Encre minérale foncée / Typographie principale */
--color-muted:         #667A82;  /* Gris ardoise / Typographie secondaire & métadonnées */
--color-surface:       #F5FAFB;  /* Gris-bleu très pâle / Surface d'arrière-plan */
--color-border:        #DCE7EA;  /* Séparateurs fins / Découpage net */
```

Règles de style :
- Pas de gradients criards, ni d'effets visuels saturés.
- Typographie technique à fort contraste, lisibilité terrain maximale (tablettes et mobiles de chantier).
- Micro-animations subtiles servant exclusivement la compréhension de la progression.

---

## 4. RÉPONSE AUX QUESTIONS DE VALIDATION (STOP CONDITIONS)

### "Comment ajouter Forage sans changer le noyau ?"
1. **Création de la branche de contenu :** Une transaction de données insère un `ContentNode` de type `DOMAIN` ou `PROGRAM` intitulé "Forage & Sondages" rattaché à la racine de l'Universal Content Tree.
2. **Déploiement des sous-niveaux :** Les modules (ex. "Forage rotary", "Fluides de forage", "Sécurité des plateformes") sont insérés comme enfants du nœud parent via leur `parent_id`.
3. **Définition des règles métier (Data-driven) :** Des enregistrements dans `content_unlock_rules` définissent les prérequis spécifiques au forage (ex. validation préalable d'un module de sécurité).
4. **Configuration commerciale :** Un enregistrement dans `catalog_offerings` associe le nouveau nœud de forage à une offre et génère les droits d'accès (`entitlements`) correspondants.
5. **Résultat :** Zéro ligne de code modifiée. Aucun redéploiement d'application. Aucun changement de schéma de base de données.

### "Comment remplacer Jitsi ou R2 sans réécrire le domaine ?"
1. **Isolation par Ports :** Le domaine métier ne connaît que les interfaces TypeScript `LiveSessionPort` et `StoragePort`.
2. **Remplacement de Jitsi :** Si l'infrastructure bascule vers Zoom, Daily.co ou un système propriétaire :
   - On crée un nouvel adaptateur `DailyCoLiveAdapter` implémentant `LiveSessionPort`.
   - On injecte ce nouvel adaptateur au niveau de la configuration d'inversion de contrôle (IoC / Factory).
   - Le noyau métier appelle toujours `createLiveRoom()` ou `getParticipantSessionToken()` sans se soucier du fournisseur sous-jacent.
3. **Remplacement de Cloudflare R2 :** Si le stockage migre vers AWS S3, Google Cloud Storage ou MinIO :
   - On crée un `AwsS3StorageAdapter` respectant l'interface immuable `StoragePort`.
   - Les clés de stockage (`storage_key`) stockées dans PostgreSQL restent inchangées, car elles sont relatives et indépendantes des URL absolues du fournisseur.
4. **Résultat :** Les contrôleurs, la logique d'accès et les modèles métier restent rigoureusement intacts.

---

## 5. MATRICE DE RESPONSABILITÉ D'INFRASTRUCTURE (RACI & ÉTANCHÉITÉ)

Pour éviter toute confusion de rôle ou dispersion architecturale, la responsabilité des 4 briques d'infrastructure est strictement délimitée :

| Fournisseur / Brique | Rôle Exclusif Attribué | Rôles Strictement Interdits |
| :--- | :--- | :--- |
| **Vercel** | **Hébergement & Logique Applicative :** Exécution du monolithe modulaire Next.js, rendu SSR/RSC, API Route Handlers internes, exécution des contrôleurs et des orchestrations de domaine. | Pas de stockage persistant d'état ou de fichiers médias. |
| **Supabase (PostgreSQL)** | **Source de Vérité Relationnelle :** Persistance de l'Universal Content Tree, métadonnées, états de progression, banques de quiz, comptes utilisateurs, rôles (RBAC), entitlements et journaux d'audit immuables. | Strictement aucun blob binaire média > 500 Ko. |
| **Cloudflare (DNS/Edge/R2)** | **Frontal Réseau & Stockage Objets Lourds :** Routage DNS externe, terminaison TLS, CDN edge de distribution statique, bucket privé R2 pour actifs volumineux (vidéos, audios, manuels PDF). | Aucune logique métier de cours, de validation ou de certification dans des Workers. |
| **Hostinger** | **Registrar de Domaine & Service Périphérique :** Réservation et détention administrative du nom de domaine (délégué par serveurs NS vers Cloudflare), boîte SMTP transactionnelle de secours si requis. | **Strictement aucun hébergement applicatif**, aucun déploiement de code ni de base de données. |

