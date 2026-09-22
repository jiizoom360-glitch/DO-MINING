# DO-MINING — RESPONSABILITÉS & PROPRIÉTÉ DES DONNÉES (DATA OWNERSHIP)

**Statut :** FIGÉ (FROZEN)  
**Date :** 2026-09-15  
**Version :** 1.0.0-phase0  

---

## 1. STRATÉGIE DE RÉPARTITION ASYMÉTRIQUE DES DONNÉES

Afin d'éviter l'engorgement de la base relationnelle et de garantir des coûts d'infrastructure prévisibles à grande échelle, la propriété des données est strictement départagée :

```
+------------------------------------+      +------------------------------------+
|        POSTGRESQL / SUPABASE       |      |           CLOUDFLARE R2            |
|       (Source de Vérité d'État)    |      |         (Conteneur Immuable)       |
+------------------------------------+      +------------------------------------+
| - Universal Content Tree (nœuds)   |      | - Fichiers vidéos MP4 / HLS        |
| - Métadonnées JSON structurées     |      | - Enregistrements audio            |
| - Clés de pointage vers R2         |      | - Manuels PDF constructeurs lourds |
| - Sommes de contrôle SHA-256       |      | - Workbooks & plans DWG/CAD        |
| - États de progression utilisateurs|      | - Archives de certifications zippées|
| - Banques de quiz et résultats     |      +------------------------------------+
| - Logs d'audit et de conformité    |
| - Droits d'accès et licences       |
+------------------------------------+
```

---

## 2. RÈGLES D'OR DE PERSISTANCE

### Règle 1 : Aucun Blob Lourd dans PostgreSQL
- La taille maximale autorisée pour une colonne de type `text` ou `jsonb` dans PostgreSQL est plafonnée à **500 Ko**.
- Tout actif dépassant 500 Ko (document technique, vidéo pédagogique, enregistrement de masterclass) doit impérativement être déposé sur **Cloudflare R2**.
- PostgreSQL n'enregistre que la structure `storage_key`, le `mime_type`, la `size_bytes` et le hachage d'intégrité `sha256`.

### Règle 2 : Clés de Stockage Relatives & Déterministes
- Les URLs absolues (ex: `https://pub-xxxx.r2.dev/...`) ne doivent **JAMAIS** être persistées en base.
- Seuls des chemins logiques normalisés sont enregistrés :
  `content/{vertical_slug}/{node_id}/{revision_id}/{asset_name}`
  *Exemple :* `content/carrieres-granulats/c7f8a9e0-1234/rev-1/concasseur-machoires-coupe.pdf`
- L'URL de lecture est générée à la volée par le `StoragePort` au moment de la demande du client.

### Règle 3 : Immuabilité & Soft-Archive
- Tout nœud de formation ayant franchi le statut `PUBLISHED` ne peut plus subir de suppression physique (`DELETE` SQL banni).
- Il ne peut recevoir qu'une modification de statut vers `ARCHIVED` avec renseignement de `archived_at`.
- Les révisions publiées d'un cours sont gelées : toute modification donne lieu à une nouvelle `ContentRevision` pour garantir qu'un apprenant certifié puisse toujours auditer la version exacte du cours sur laquelle il a été évalué.

### Règle 4 : Isolation Multi-Niches par Métadonnées
- Les données de la niche *Forage* ne créent pas de tables séparées par rapport à la niche *Carrières*.
- Toutes les niches partagent le même schéma normalisé. L'isolation et le cloisonnement sont assurés par le rattachement hiérarchique au nœud racine du vertical et par les politiques d'accès (RLS PostgreSQL).
