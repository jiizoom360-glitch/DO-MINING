# DO-MINING — PÉRIMÈTRE & CADRAGE DU MVP (MVP SCOPE)

**Statut :** FIGÉ (FROZEN)  
**Date :** 2026-09-15  
**Version :** 1.0.0-phase0  

---

## 1. OBJECTIF DU MVP

Valider l'excellence de l'expérience d'apprentissage, la robustesse du modèle Universal Content Tree et l'adhésion des professionnels de l'industrie minérale sur le premier vertical pilote :

> **Mines & Carrières → Exploitation des carrières → Production des granulats**

Le MVP doit démontrer :
1. Une interface utilisateur technique, sobre, mobile-first et valorisante pour les métiers de l'extraction.
2. Une structure de formation à granularité fine et récursive sans limite de profondeur.
3. Un suivi de progression rigoureux (statuts, durées, validation des acquis).
4. La présence d'un prototype de session synchrone avec un technicien expert carrier.
5. Une architecture antifragile prête pour l'intégration de nouvelles filières sans refonte logicielle.

---

## 2. PÉRIMÈTRE INCLUS DANS LE MVP (IN SCOPE)

### 2.1 Pédagogie & Contenu Métier
- **Parcours pilote complet :**
  - Étape 1 : Découverte et décapage des terrains de découverte.
  - Étape 2 : Abattage et extraction de la roche massive ou alluvionnaire.
  - Étape 3 : Roulage et transfert vers l'installation de traitement.
  - Étape 4 : Concassage primaire, secondaire et tertiaire (caractéristiques des concasseurs à mâchoires, giratoires, à percussion).
  - Étape 5 : Criblage et coupures granulométriques (courbes, toiles, refus).
  - Étape 6 : Lavage des matériaux et décantation des boues.
  - Étape 7 : Stockage des stocks de granulats, reprise et bascules de pesée.
  - Étape 8 : Évaluation sommative de maîtrise et conformité granulats.
- **Ressources téléchargeables :** Fiches techniques types (normes NF P 18-545, guides de maintenance concasseurs).
- **Session Expert :** Fiche de cadrage d'une masterclass live avec un ingénieur d'exploitation carrière (simulée via `ManualLiveSessionAdapter`).

### 2.2 Rôles & Espaces Dédiés
Le système prépare les 4 profils utilisateurs sous forme de dashboards configurables :
1. **Espace Apprenant :** Navigation dans l'arbre, reprise de lecture, suivi du temps passé, accès aux fiches de synthèse, passage des quiz.
2. **Espace Formateur :** Vue d'ensemble de la cohorte, suivi des validations par apprenant, consultation des résultats d'évaluation.
3. **Espace Administrateur :** Exploration de l'arborescence UCT, gestion de la visibilité des nœuds, configuration des offres de catalogue.
4. **Espace Auditeur :** Journal d'audit et vérification de la conformité des complétions pour accréditation entreprise.

### 2.3 Données Réalistes
- Données métier 100% crédibles (terminologie extractive officielle, unités normalisées en tonnes/heure, millimètres de coupure, pourcentages d'usure des pièces d'usure).
- Zéro Lorem Ipsum.

---

## 3. CE QUI EST FORMELLEMENT EXCLU DU MVP (OUT OF SCOPE)

Conformément à la directive supérieure d'antifragilité et de contrôle :
- ❌ **Paiement réel :** Pas de passerelle Stripe / LemonSqueezy connectée. Les accès sont validés par des jetons d'attribution simulés ou accordés manuellement.
- ❌ **Connexion API Cloudflare en production :** Pas d'appels réels vers l'API Cloudflare.
- ❌ **Connexion API Jitsi en production :** Pas d'intégration WebRTC directe ni de cluster Jitsi dédié durant cette phase.
- ❌ **Connexion GitHub / Hostinger API :** Aucune automatisation d'infrastructure via API.
- ❌ **Agents d'IA autonomes :** Aucun agent autonome d'exécution.
- ❌ **Génération automatique de cours par IA :** Tout le contenu pédagogique est validé et structuré de manière déterministe.
- ❌ **Marketplace de formateurs tiers :** Réservé pour les phases ultérieures.
- ❌ **Architecture Microservices / Kubernetes :** Strictement bannie (monolithe modulaire Next.js obligatoire).
- ❌ **Moteurs de RAG complexe & vector stores :** Hors périmètre MVP.
- ❌ **Protocoles SCORM / xAPI :** Inutiles et obsolètes face à l'Universal Content Tree natif.
- ❌ **Application mobile native (iOS/Android) :** Le web responsive PWA / Mobile-First remplit 100% du besoin terrain.
