# ADR-006 : SOUDURES COMMERCIALES DÉCOUPLÉES PAR NICHES (COMMERCIAL SEAMS)

**Statut :** ACCEPTÉ  
**Date :** 2026-09-15  

---

### CONTEXT
DO-Mining a vocation à commercialiser des formations sous des formes variées :
- Abonnement global à l'ensemble du catalogue Mines & Carrières pour les grandes compagnies minières.
- Achat unitaire ou licence par poste pour une filière spécialisée (ex: "Opérateur de concassage-criblage").
- Vente isolée d'un vertical complet à un organisme de formation partenaire (ex: Niche "Topographie minière").

Si le système de facturation est fusionné avec la structure des cours (comme un champ `price` posé sur une table `courses`), il devient impossible de packager différemment les sous-branches ou d'accorder des accès modulaires sans réécrire le modèle.

---

### DECISION
Découpler totalement la structure des contenus de la logique commerciale par trois concepts indépendants :
1. **`CatalogOffering` :** Représente un produit commercialgable, avec un SKU et un pointeur vers un `ContentNode` racine (qui peut être un domaine entier, un cours isolé ou un simple module).
2. **`UserEntitlement` :** Représente le droit effectif d'un apprenant ou d'une organisation, conféré lors d'une validation d'inscription manuelle ou future transaction.
3. **`AccessScope` :** Algorithme qui évalue la visibilité et le déblocage en cascade à partir du nœud racine accordé jusqu'à ses feuilles.

---

### WHY
1. **Modularité commerciale absolue :** Une branche quelconque de l'Universal Content Tree peut être monétisée indépendamment du reste sans toucher à son code ni à son arborescence.
2. **Support des licences d'entreprises :** Permet d'attribuer un pack "Mines & Carrières — Exploitation" à une entreprise A, et uniquement "Topographie" à une entreprise B.
3. **Préparation future sans complexité immédiate :** Établit la structure nécessaire dès la phase 0 sans nécessiter l'écriture d'un moteur de paiement complexe maintenant.

---

### CONSEQUENCES
- **Positives :** Souplesse marketing infinie, monétisation par granularité arbitraire, conformité avec la doctrine *New Niche = New Commercial Configuration*.
- **Points d'attention :** L'évaluation des droits d'accès nécessite de remonter l'arbre récursif jusqu'au nœud racine d'attribution (couvert efficacement par les index et les requêtes récursives PostgreSQL).

---

### OUT OF SCOPE
- Moteur de facturation récurrente automatisée, TVA multi-pays et génération automatique de factures PDF (traités en phases ultérieures).
