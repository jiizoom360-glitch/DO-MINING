# DO-MINING — DÉFINITION GLOBALE DE FINI (MVP DEFINITION OF DONE)

**Statut :** FIGÉ (FROZEN)  
**Date :** 2026-09-15  
**Version :** 1.0.0-phase0  

---

## 1. DISTINCTION MAJEURE DU PHASAGE

> ⚠️ **AVERTISSEMENT DE CONTEXTE :**  
> La présente **Definition of Done (DoD)** décrit l'état d'achèvement cible du **MVP complet de production**.  
> **Les Phases 0 (Architecture Freeze) et Phase 1 (Prototype Visuel & Design System) n'ont PAS vocation à implémenter l'intégralité de ce cycle de vie applicatif.**  
> Elles préparent et garantissent la faisabilité de ce scénario de référence sans dette architecturale.

---

## 2. LE SCÉNARIO DE RÉFÉRENCE DE BOUT EN BOUT (END-TO-END SCENARIO)

Le MVP sera officiellement certifié comme "Terminé" (Done) lorsque le parcours utilisateur suivant sera exécuté et validé sans régression :

```
[ ÉTAPE 1 : ADMINISTRATION & PUBLICATION ]
  L'administrateur crée ou met à jour la formation 
  "Exploitation des carrières -> Production des granulats" dans l'Universal Content Tree, 
  associe les ressources médias (fiches concasseurs, vidéos de criblage) et publie la formation.
       |
       v
[ ÉTAPE 2 : ACCÈS APPRENANT ]
  L'apprenant se connecte à son espace dédié, visualise son catalogue 
  et accède à la branche autorisée grâce à son attribution active (Entitlement).
       |
       v
[ ÉTAPE 3 : ENREGISTREMENT DE PROGRESSION & SÉQUENÇAGE ]
  L'apprenant étudie les modules (décapage, extraction, concassage). 
  Le système enregistre de manière incrémentale le temps passé, les étapes franchies 
  et applique les règles de déblocage séquentiel (Unlock Engine).
       |
       v
[ ÉTAPE 4 : ÉVALUATION PAR QUIZ TECHNIQUE ]
  L'apprenant passe l'examen sommatif (classification granulométrique, normes NF). 
  Les réponses sont évaluées côté serveur sans manipulation possible du score.
       |
       v
[ ÉTAPE 5 : PARTICIPATION À LA CLASSE LIVE EXPERT ]
  L'apprenant rejoint le créneau de masterclass synchrone avec l'ingénieur de carrière 
  via la salle provisionnée par le LiveSessionPort (Jitsi).
       |
       v
[ ÉTAPE 6 : VALIDATION & STATUT FORMATION COMPLETED ]
  Le moteur d'évaluation constate la réussite du quiz et la participation au live. 
  La formation est marquée comme "COMPLETED" avec émission de l'attestation de réussite.
       |
       v
[ ÉTAPE 7 : AUDITABILITÉ DE CONFORMITÉ ]
  L'auditeur d'entreprise accède à son espace dédié et consulte le journal d'audit 
  immuable certifiant l'exactitude du parcours réalisé par l'opérateur.
```

---

## 3. CRITÈRES TECHNIQUES D'ACCEPTATION GLOBALE (GLOBAL ACCEPTANCE CRITERIA)

### 3.1 Architecture & Code
- [ ] Zéro utilisation de tables rigides fixes : la navigation repose intégralement sur l'arbre récursif `ContentNode`.
- [ ] Zéro importation de SDKs de fournisseurs externes dans la couche métier (respect strict des `Ports & Adapters`).
- [ ] TypeScript strict activé sur 100% de la base de code applicative (aucun `any`, aucun type implicite).
- [ ] Zéro calcul métier sensible ou évaluation de score dans les composants UI React.
- [ ] Zéro clé privée ou secret d'infrastructure exposé dans le bundle JavaScript côté client.

### 3.2 Données & Persistance
- [ ] Base PostgreSQL / Supabase normalisée avec clés primaires UUID immuables.
- [ ] Zéro fichier ou blob volumineux (>500 Ko) stocké directement dans PostgreSQL.
- [ ] Les médias sont référencés par des clés d'objets relatives et servis via Cloudflare R2 avec URLs sécurisées.
- [ ] Politiques Row Level Security (RLS) actives et testées contre les accès cross-utilisateurs.
- [ ] Table d'audit en écriture seule (Append-Only) avec horodatage UTC vérifié.

### 3.3 Expérience Utilisateur & Design System
- [ ] Interface conforme aux standards de design "Apple / Stripe / Linear" sobre, technique et lisible.
- [ ] Respect de la palette DO-Mining : Turquoise `#08AFC1`, Bleu profond `#075A70`, Accent `#F4C542`, Encre `#12242B`, Surfaces `#F5FAFB`.
- [ ] Conception Mobile-First pleinement réactive adaptée aux terminaux de chantier minier et aux tablettes de supervision.
- [ ] Navigation récursive fluide ne donnant jamais l'impression d'une limitation de profondeur.
- [ ] Données d'exemple 100% réalistes, techniques et sans aucun texte fictif (aucun Lorem Ipsum).

### 3.4 Résilience & Opérabilité
- [ ] Comportement conforme au `Failure Model` : dégradation élégante en cas de panne de R2, de Jitsi ou de coupure réseau.
- [ ] Fonctionnement autonome en mode isolé (Mock / Manual) sans nécessiter de connexion à des services cloud payants.
- [ ] Démonstration reproductible de l'ajout d'une nouvelle niche (*Forage*, *Topographie*) par simple injection de données sans modification du code source.
