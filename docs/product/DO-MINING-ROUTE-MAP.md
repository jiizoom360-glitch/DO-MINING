# DO-MINING — FEUILLE DE ROUTE & TRAJECTOIRE (ROUTE MAP)

**Statut :** FIGÉ (FROZEN)  
**Date :** 2026-09-15  
**Version :** 1.0.0-phase0  

---

## PHASAGE DE DÉVELOPPEMENT

```
+-------------------------------------------------------------------------------+
|  PHASE 0 : ARCHITECTURE FREEZE (Phase Actuelle)                               |
|  - Spécification formelle des ports et contrats                               |
|  - Gel de la doctrine "New Niche != New Application"                         |
|  - Documentation d'architecture & ADRs                                        |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
|  PHASE 1 : PROTOTYPE EXPÉRIENTIEL & UI DESIGN SYSTEM                          |
|  - Implémentation du Design System premium technique (palette DO-Mining)      |
|  - Parcours vertical pilote : Exploitation carrières & Granulats              |
|  - Moteur de navigation dans l'Universal Content Tree                         |
|  - Vues dédiées (Apprenant, Formateur, Admin, Auditeur)                       |
|  - Adaptateurs Mock complets & Données réalistes sans API externe             |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
|  PHASE 2 : MOTEUR DOMAINE & COUCHE DATA DÉFINITIVE                           |
|  - Implémentation Next.js / TypeScript strict                                 |
|  - Schéma Supabase / PostgreSQL conforme au modèle UCT                        |
|  - Mise en place des règles RLS et de la traçabilité d'audit                  |
|  - Transition des MockAdapters vers les ManualAdapters exploitables           |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
|  PHASE 3 : EXPANSION MULTI-NICHES (VALIDATION DE LA DOCTRINE)                 |
|  - Injection par les données de la branche "Forage & Sondages"               |
|  - Injection de la branche "Minage & Tirs"                                    |
|  - Vérification empirique : ZÉRO modification du code source de l'application|
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
|  PHASE 4 : CONNECTEURS FOURNISSEURS RÉELS (REAL ADAPTERS)                    |
|  - Remplacement du StoragePort par Cloudflare R2 (S3 API)                     |
|  - Remplacement de LiveSessionPort par instance Jitsi JWT sécurisée           |
|  - Intégration de la passerelle de paiement par abonnement                    |
+-------------------------------------------------------------------------------+
```

---

## CRITÈRES DE SUCCÈS POUR LE PASSAGE EN PHASE 1

1. **Stabilité du contrat :** L'équipe de réalisation (Antigravity) ne remet jamais en cause la structure du nœud universel.
2. **Qualité perçue :** L'interface dépasse les standards des LMS génériques par son ancrage direct dans les problématiques des directeurs d'exploitation et chefs de carrières.
3. **Zéro régression de frontières :** Aucun appel externe non mocké lors des phases de prototypage.
