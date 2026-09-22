# ADR-005 : STRICTE INTERDICTION DES APIS EXTERNES EN PHASE MVP

**Statut :** ACCEPTÉ  
**Date :** 2026-09-15  

---

### CONTEXT
Les projets MVP échouent fréquemment en s'épuisant sur les détails d'intégration d'APIs périphériques (gestion des webhooks Stripe, quotas d'API Cloudflare, provisioning de conteneurs Jitsi, automatisations DNS Hostinger, webhooks GitHub) avant même d'avoir éprouvé le cœur pédagogique et la modélisation métier de la plateforme.

---

### DECISION
Bannir formellement toute connexion active avec des APIs tierces pendant la phase MVP de DO-Mining :
- Aucun appel réseau sortant vers Cloudflare, Jitsi, GitHub, Hostinger ou des passerelles de paiement.
- Toutes les fonctionnalités requérant un tiers sont satisfaites par le couple `MockAdapter` / `ManualAdapter`.
- Les secrets et clés de production de ces services sont absents du code et des variables d'environnement actives.

---

### WHY
1. **Focus absolu sur l'excellence métier :** Garantir que le premier vertical *Mines & Carrières → Production des granulats* soit pédagogiquement irréprochable et ergonomiquement parfait.
2. **Hermétisme et Sécurité :** Aucun risque de fuite de clés ou de facturation non maîtrisée durant le développement local (Antigravity) et la validation d'interface.
3. **Auditabilité immédiate :** L'auditeur (Work) peut valider chaque flux de bout en bout de manière déterministe et reproductible.

---

### CONSEQUENCES
- **Positives :** Temps de démarrage ultra-rapide, zéro dépendance réseau externe, zéro coût de licence ou d'API pendant la conception.
- **Points d'attention :** Nécessite de concevoir des interfaces d'administration internes permettant aux opérateurs de renseigner manuellement les liens de visioconférence et clés de médias durant la phase manuelle.

---

### OUT OF SCOPE
- Provisioning d'infrastructure as Code (Terraform / Pulumi) pour les services tiers.
