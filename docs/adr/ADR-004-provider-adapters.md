# ADR-004 : ISOLATION DES FOURNISSEURS PAR ARCHITECTURE HEXAGONALE (PORTS & ADAPTERS)

**Statut :** ACCEPTÉ  
**Date :** 2026-09-15  

---

### CONTEXT
Lier directement l'application aux bibliothèques propriétaires de fournisseurs externes (Cloudflare, Supabase, Jitsi, Vercel, Hostinger, Stripe) rend le système fragile face aux hausses de tarifs, aux dépréciations d'APIs et aux obligations de souveraineté des données de certaines compagnies minières nationales.

---

### DECISION
Isoler systématiquement toute infrastructure tierce derrière un contrat abstrait TypeScript pur (`Port`).  
Chaque port sera doté d'une implémentation `MockAdapter`, d'une implémentation d'exploitation manuelle supervisée `ManualAdapter`, et d'un futur connecteur branché `RealAdapter`.

---

### WHY
1. **Antifragilité & Interchangeabilité :** Si Jitsi Meet est un jour remplacé par une instance Zoom On-Premise ou Daily.co, seul l'adaptateur de classe en direct change. Le domaine, les contrôleurs et les vues restent inchangés.
2. **Développement et Tests sans friction :** Possibilité d'exécuter l'intégralité des tests unitaires et d'intégration en mémoire sans aucune connexion Internet ni clés d'API payantes.
3. **Respect de la doctrine du MVP contrôlé :** Permet d'opérer la plateforme au stade MVP sans dépendre de scripts d'automatisation risqués ou instables.

---

### CONSEQUENCES
- **Positives :** Souveraineté totale sur le code métier, découplage architectural impeccable, zéro régression lors des migrations techniques.
- **Points d'attention :** Nécessite une rigueur d'ingénierie stricte pour interdire les imports directs de SDKs tiers dans la couche UI ou métier.

---

### OUT OF SCOPE
- Moteur d'injection de dépendances complexe ou framework lourd d'Inversion de Contrôle (un simple conteneur Factory / Registry TypeScript suffit).
