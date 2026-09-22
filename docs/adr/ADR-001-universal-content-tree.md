# ADR-001 : UNIVERSAL CONTENT TREE POUR LA STRUCTURE PÉDAGOGIQUE RÉCURSIVE

**Statut :** ACCEPTÉ  
**Date :** 2026-09-15  

---

### CONTEXT
Les LMS traditionnels enferment l'ingénierie pédagogique dans des schémas de base de données rigides à 3 ou 4 niveaux fixes (ex: `categories -> courses -> sections -> lessons`). Dans l'industrie minière et des carrières, la complexité des formations est intrinsèquement variable :
- Certaines formations requièrent une décomposition profonde : *Filière → Sous-secteur → Famille d'engins → Concasseur spécifique → Organe d'usure → Procédure de maintenance*.
- D'autres sont des modules courts transversaux (ex: *Fiche réflexe sécurité tir de mine*).

Forcer un nombre fixe de tables mène inévitablement à la duplication de code ou à des colonnes artificielles à chaque nouvelle niche.

---

### DECISION
Adopter une table et une entité uniques et récursives : **l'Universal Content Tree (`ContentNode`)** :
- Chaque nœud possède un identifiant UUID immuable, un `parent_id` (nullable pour les nœuds racines) et un champ sémantique `node_type` (`DOMAIN`, `PROGRAM`, `COURSE`, `MODULE`, `SECTION`, `LESSON`, `ACTIVITY`, `ASSESSMENT`, `RESOURCE`, `LIVE_SESSION`).
- Le schéma de données ignore la profondeur maximale.
- L'arborescence est interrogée via des requêtes récursives standard (CTEs PostgreSQL) ou restituée sous forme de graphe imbriqué.

---

### WHY
1. **Extensibilité infinie :** Ajouter un domaine complet (comme *Forage* ou *Topographie*) revient à insérer un nouveau nœud racine et ses descendants par de simples transactions de données.
2. **Économie de maintenance :** Un seul composant de navigation récursif et un seul jeu d'opérations CRUD gèrent l'ensemble de la plateforme.
3. **Résilience face aux évolutions pédagogiques :** Permet d'insérer ultérieurement un sous-niveau sans altérer le schéma relationnel.

---

### CONSEQUENCES
- **Positives :** Uniformité totale du modèle de données, zéro modification structurelle lors de l'ouverture de nouvelles niches industrielles, facilité de requêtage hiérarchique.
- **Points d'attention :** Nécessite d'empêcher les boucles cycliques lors des mises à jour de `parent_id` (contrainte assurée au niveau des règles de domaine ou via triggers SQL d'intégrité).

---

### OUT OF SCOPE
- Édition visuelle complexe de graphes ou arborescences libres à embranchements conditionnels (arbre linéaire / hiérarchique suffisant pour le MVP).
- Moteur d'apprentissage adaptatif dynamique par IA.
