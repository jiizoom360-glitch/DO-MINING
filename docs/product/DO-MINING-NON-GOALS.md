# DO-MINING — PÉRIMÈTRE EXCLU (NON-GOALS PHASE 0 & PHASE 1)

**Statut :** FIGÉ (FROZEN)  
**Date :** 2026-09-15  
**Version :** 1.0.0-phase0  

---

## 1. PRINCIPE DIRECTEUR : LA DISCIPLINE DU CADRAGE

Pour préserver l'intégrité de la construction de DO-Mining, prévenir l'effet "usine à gaz" (feature creep) et empêcher que des outils d'IA ou des développeurs n'introduisent des architectures prématurées, la liste suivante d'objectifs non poursuivis (**Non-Goals**) est formellement arrêtée pour les Phases 0 et 1.

Tout travail ou commit introduisant l'un de ces éléments constitue une violation des frontières du projet.

---

## 2. LISTE FORMELLE DES NON-GOALS (INTERDICTIONS STRICTES)

1. ❌ **Génération Automatique de Cours par IA (AI Course Generation) :**  
   DO-Mining est un LMS technique pour des industries à haute responsabilité industrielle et réglementaire. Le contenu pédagogique est rédigé, vérifié et validé par des ingénieurs et techniciens experts. Aucune génération automatique de contenu par LLM n'est autorisée.

2. ❌ **Intégration de Passerelle de Paiement Réel (Payment Integration) :**  
   Aucune intégration de Stripe, LemonSqueezy ou PayPal. Les accès et attributions de formations sont manipulés via le modèle conceptuel d'`Entitlements` ou accordés manuellement dans le cadre du pilote.

3. ❌ **Place de Marché de Formateurs Tiers (Marketplace) :**  
   Pas de système d'inscription libre de créateurs de contenu, pas de partage de revenus (revenue sharing), pas de profils publics de vente. DO-Mining diffuse une offre de formation maîtrisée et certifiée.

4. ❌ **Protocoles SCORM & xAPI :**  
   Interdiction formelle d'importer ou de supporter les conteneurs SCORM (1.2 / 2004) ou les Tin Can xAPI. L'Universal Content Tree natif de DO-Mining offre une granularité et une finesse de suivi de données immensément supérieures aux contraintes archaïques des packages SCORM.

5. ❌ **RAG Complexe & Bases Vectorielles (Complex RAG & Vector Stores) :**  
   Aucun embedding vectoriel, aucun index Pinecone/Qdrant, aucun pipeline RAG sophistiqué. La recherche dans le catalogue s'appuie sur la recherche textuelle PostgreSQL (`tsvector`/`tsquery`) et les métadonnées de l'UCT.

6. ❌ **Réseau Social & Fonctionnalités Communautaires Débridées (Social Network) :**  
   Pas de flux d'actualités type réseau social, pas de likes, pas de messagerie directe non cadrée entre apprenants, pas de salons de discussion ouverts sans rapport avec l'apprentissage.

7. ❌ **Architecture Microservices :**  
   Interdiction de découper l'application en microservices indépendants avec bus d'événements Kafka ou RabbitMQ. DO-Mining est un **Monolithe Modulaire** clair, cohérent et déployable en une seule unité d'exécution.

8. ❌ **Orchestration Kubernetes & Conteneurs Multiples :**  
   Pas de manifests Kubernetes, pas de Helm charts, pas de service mesh (Istio/Linkerd). Le déploiement s'appuie sur des conteneurs légers gérés (Vercel / Cloud Run).

9. ❌ **Application Mobile Native (iOS / Android) :**  
   Aucun développement Swift, Kotlin ou React Native. Une architecture web réactive, mobile-first, performante et progressive (PWA) couvre 100% des cas d'usage sur les chantiers et terminaux d'exploitation.

10. ❌ **Connexion aux APIs Réelles des Fournisseurs Externes :**  
    Aucun appel direct en production vers les APIs de Cloudflare, Jitsi, GitHub ou Hostinger durant les phases initiales. Utilisation exclusive des contrats `Port` avec adaptateurs `Mock` et `Manual`.

11. ❌ **Cloudflare Workers Métier Complexes :**  
    Les Workers Cloudflare restent cantonnés à la terminaison réseau, au CDN ou aux règles DNS. Aucune logique métier de formation ou de certification ne doit être éparpillée dans des Workers edge serverless isolés.

12. ❌ **Moteur d'Analytics Avancé & Télémétrie Lourde :**  
    Pas de trackers tiers intrusifs, pas de dashboards BI complexes (Mixpanel, Datadog ou PostHog lourd). Seules les métriques métier directes (temps passé, complétion, scores) sont stockées dans PostgreSQL.

13. ❌ **Moteur de Recommandation Algorithmique par IA :**  
    L'ordre d'apprentissage est dicté par l'ingénierie pédagogique, les règles de déblocage séquentiel et les référentiels de compétences minières, et non par un algorithme d'engagement probabiliste.

14. ❌ **Multi-Tenancy Complexe Inutile (Organizations / Schemas par Entreprise) :**  
    Pas de partitionnement multi-tenant complexe, ni de `tenant_id` transversal sur toutes les tables, ni de schémas PostgreSQL multiples par entreprise pour le MVP. Le modèle d'accès repose uniquement sur l'identité utilisateur universelle (`user_id`), le RBAC standard (`Learner`, `Trainer`, `Admin`, `Auditor`) et les attributions d'accès (`UserEntitlement`) aux branches de l'UCT.

