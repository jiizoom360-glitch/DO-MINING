# DO-MINING — MODÈLE DE MENACES (THREAT MODEL MVP)

**Statut :** FIGÉ (FROZEN)  
**Date :** 2026-09-15  
**Version :** 1.0.0-phase0  

---

## 1. OBJECTIF & CADRAGE DE SÉCURITÉ

DO-Mining est une plateforme d'enseignement technique et de certification pour l'industrie extractive (Mines & Carrières).  
Les menaces pèsent sur l'intégrité des compétences attestées, la confidentialité des données industrielles sensibles et la protection des droits de propriété intellectuelle des formations métiers.

Le modèle de menaces analyse systématiquement 11 vecteurs critiques et définit les contre-mesures obligatoires.

---

## 2. ANALYSE DES MENACES & CONTRE-MESURES

### 2.1 Accès Cross-User (Isolation des Données Utilisateurs)
- **Menace :** Un apprenant A accède ou modifie les notes, temps passés, profils ou réponses de quiz d'un apprenant B via falsification d'identifiants (IDOR).
- **Vecteur :** Manipulation des paramètres d'URL, de requêtes REST ou d'appels RPC avec un UUID cible différent.
- **Contre-mesure obligatoire :**
  - Validation stricte de l'identité de session côté serveur (`auth.uid()`).
  - Utilisation systématique de politiques Row Level Security (RLS) dans PostgreSQL garantissant qu'un utilisateur ne peut requêter ou muter que les lignes où `user_id = auth.uid()`.
  - Contrôle d'autorisation explicite dans la couche application pour les formateurs et auditeurs (vérification du périmètre d'attribution de cohorte ou de branche, sans nécessiter de partitionnement multi-tenant complexe).

### 2.2 Accès au Contenu Non Publié (Fuite de Brouillons)
- **Menace :** Un apprenant découvre des modules en cours de rédaction (`DRAFT`, `REVIEW`) ou des corrigés d'examens via l'API ou l'arbre des contenus.
- **Vecteur :** Requêtage direct de nœuds par ID sans filtrage sur le statut.
- **Contre-mesure obligatoire :**
  - La couche de requêtage du domaine applique par défaut un filtre `status = 'PUBLISHED' AND visibility IN ('PUBLIC', 'AUTHENTICATED')` pour tout rôle ne disposant pas du privilège `content:author` ou `content:admin`.
  - Les corrigés de questions ne sont jamais exposés dans les payloads des requêtes de consultation du quiz ; seule l'évaluation côté serveur compare la réponse soumise avec le barème réel.

### 2.3 Exposition d'URLs Médias Privées
- **Menace :** Des vidéos techniques 4K, plans d'usines de traitement ou manuels de concasseurs sont indexés publiquement ou partagés hors plateforme sans licence.
- **Vecteur :** Liens directs statiques vers le bucket Cloudflare R2 ou URLs de CDN permanentes sans signature.
- **Contre-mesure obligatoire :**
  - Bucket Cloudflare R2 privé par défaut (aucun accès public anonyme).
  - Génération d'URLs de lecture signées temporaires (`presigned URLs`) à durée de vie courte (TTL 15 à 60 minutes) délivrées uniquement après vérification de l'accréditation (`UserEntitlement`) de l'utilisateur sur le nœud parent.

### 2.4 Fuite de Secrets Côté Navigateur
- **Menace :** Clés secrètes Supabase (`service_role_key`), clés privées Cloudflare R2 (`AWS_SECRET_ACCESS_KEY`) ou tokens de visioconférence exposés dans le bundle JavaScript client.
- **Vecteur :** Mauvais préfixage d'environnement (`NEXT_PUBLIC_` ou `VITE_`) ou import direct d'un module d'infrastructure dans un composant React.
- **Contre-mesure obligatoire :**
  - Règle stricte d'isolation : les clés secrètes résident exclusivement dans l'environnement serveur d'exécution.
  - L'interface client n'embarque que les clés publiques anonymes strictement nécessaires.
  - Règle d'audit statique (linter) interdisant tout import d'adaptateur d'infrastructure dans `/src/components` ou les pages clientes.

### 2.5 Élévation de Privilèges
- **Menace :** Un apprenant s'octroie les droits de formateur (`Trainer`), d'administrateur (`Admin`) ou d'auditeur (`Auditor`).
- **Vecteur :** Injection d'un champ `role: "ADMIN"` dans un payload de mise à jour de profil utilisateur.
- **Contre-mesure obligatoire :**
  - Rôles et habilitations stockés dans une table dédiée protégée (`user_roles`) non modifiable par l'utilisateur final.
  - Politiques RLS empêchant tout `UPDATE` sur la table des rôles en dehors du rôle de service (`service_role`) ou d'un super-administrateur audité.

### 2.6 Injections SQL, NoSQL & XSS
- **Menace :** Exécution de code arbitraire via les champs de saisie (commentaires, réponses ouvertes, titres de nœuds UCT).
- **Vecteur :** Concaténation de requêtes SQL brutes ou rendu direct de Markdown/HTML non aseptisé dans l'interface.
- **Contre-mesure obligatoire :**
  - Requêtes PostgreSQL 100% paramétrées (ORM/Query Builder typé ou déclarations préparées), interdiction formelle de la concaténation de chaînes SQL.
  - Sanitarisation stricte de tout corps de texte Markdown avec désactivation par défaut du HTML brut et des balises `<script>` / `<iframe>` non autorisées.

### 2.7 Falsification de Progression
- **Menace :** Un apprenant valide instantanément une formation de 40 heures en forçant artificiellement un statut `COMPLETED` et un temps de formation frauduleux.
- **Vecteur :** Envoi d'un payload forgé vers l'endpoint de complétion.
- **Contre-mesure obligatoire :**
  - Le serveur valide la cohérence temporelle : impossible de marquer un module complété sans un intervalle minimal crédible entre `first_accessed_at` et `completed_at`.
  - Vérification par le moteur de déblocage (`UnlockEngine`) que tous les prérequis enfants ou séquentiels ont été effectivement validés avant d'accorder la complétion du nœud parent.

### 2.8 Manipulation de Score aux Évaluations
- **Menace :** Un apprenant s'attribue une note de 100% à l'examen de certification sur la conformité des granulats.
- **Vecteur :** Envoi direct du score calculé côté client lors de la soumission.
- **Contre-mesure obligatoire :**
  - Le client transmet uniquement les identifiants des options choisies par question (`submitted_answers`).
  - Le calcul du score est exécuté de manière hermétique côté serveur par l'`AssessmentEngine`.
  - La tentative est horodatée et verrouillée en lecture seule dès soumission (`is_submitted = true`).

### 2.9 Accès à un Vertical Non Autorisé
- **Menace :** Un utilisateur abonné à la seule niche *Production des granulats* accède aux cours réservés aux filières *Forage pétrolier / minier* ou *Minage explosif*.
- **Vecteur :** Contournement du menu de navigation pour interroger les identifiants d'une autre branche de l'arbre.
- **Contre-mesure obligatoire :**
  - Avant de délivrer le contenu d'un nœud, le système évalue l'arbre des droits (`UserEntitlement`) : l'utilisateur doit posséder une attribution active couvrant le nœud cible ou l'un de ses ancêtres hiérarchiques.
  - Si l'accès n'est pas couvert, réponse standard `403 Forbidden` ou redirection vers la proposition commerciale du catalogue (`CatalogOffering`).

### 2.10 Fuite de Données d'Audit et de Traçabilité
- **Menace :** Altération ou suppression des journaux de certification pour masquer une fraude ou un échec d'examen d'un opérateur de carrière.
- **Vecteur :** Modification directe de la table des logs d'audit.
- **Contre-mesure obligatoire :**
  - Table d'audit `audit_logs` en mode "Append-Only" : les droits SQL `UPDATE` et `DELETE` sont révoqués au niveau du moteur de base de données.
  - Horodatage certifié UTC immuable et empreinte SHA-256 de chaque événement de certification.

### 2.11 Téléversement Malveillant Futur (Uploads Formateurs/Apprenants)
- **Menace :** Injection de scripts malveillants, fichiers exécutables déguisés en PDF ou dépassement de quota de stockage.
- **Vecteur :** Téléversement direct de fichiers corrompus via le formulaire de ressources.
- **Contre-mesure obligatoire (prévue dans le contrat de `StoragePort`) :**
  - Liste blanche stricte de types MIME autorisés (`application/pdf`, `video/mp4`, `image/jpeg`, `image/png`).
  - Validation de la taille maximale déclarée lors de la demande d'URL de téléversement (`size_bytes` plafonnée).
  - Génération de clés de stockage avec hachage déterministe pour éviter tout écrasement de fichier existant.
