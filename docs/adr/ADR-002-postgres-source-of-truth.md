# ADR-002 : POSTGRESQL (SUPABASE) COMME SOURCE DE VÉRITÉ RELATIONNELLE UNIQUE

**Statut :** ACCEPTÉ  
**Date :** 2026-09-15  

---

### CONTEXT
DO-Mining gère des données hautement structurées, des relations hiérarchiques, des règles d'habilitation par rôles (RBAC) et des exigences d'audit réglementaire strictes pour la certification de techniciens de carrières. Les bases NoSQL documentaires conduisent fréquemment à des incohérences lors des mises à jour en cascade des arborescences de cours.

---

### DECISION
Désigner **PostgreSQL** (hébergé sur l'infrastructure Supabase) comme l'unique source de vérité transactionnelle pour :
- La topologie de l'Universal Content Tree.
- Les états d'apprentissage et de complétion des apprenants.
- Les résultats des évaluations et banques de questions.
- Les droits d'accès commerciaux (`Entitlements`).
- Les journaux d'audit et signatures d'intégrité.

---

### WHY
1. **Intégrité référentielle native :** Contraintes de clés étrangères indispensables pour garantir qu'un état d'avancement ne pointe pas vers un nœud de cours supprimé.
2. **Support des requêtes récursives :** Les `WITH RECURSIVE` de PostgreSQL permettent d'extraire des sous-arbres entiers en une seule requête optimisée.
3. **Sécurité au niveau des lignes (Row Level Security - RLS) :** Permet d'isoler hermétiquement les données d'apprentissage individuelles et de cohortes au niveau même du moteur de base de données sans complexité de multi-tenancy multi-schémas.

---

### CONSEQUENCES
- **Positives :** Garanties ACID complètes, intégrité mathématique des parcours de certification, requêtage puissant.
- **Points d'attention :** Interdiction absolue de stocker des fichiers volumineux dans cette base (voir ADR-003).

---

### OUT OF SCOPE
- Sharding multi-régions ou clusters distribués complexes (la volumétrie textuelle et transactionnelle du MVP reste largement dans les capacités d'un nœud PostgreSQL standard).
