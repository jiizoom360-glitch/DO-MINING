# ADR-003 : EXTERNALISATION DES MÉDIAS LOURDS VERS CLOUDFLARE R2

**Statut :** ACCEPTÉ  
**Date :** 2026-09-15  

---

### CONTEXT
Les formations techniques Mines & Carrières impliquent des supports médias lourds :
- Vidéos 4K de concasseurs industriels en fonctionnement.
- Manuels constructeurs Caterpillar / Metso de plusieurs dizaines de mégaoctets.
- Plans CAD/DWG et schémas d'usines de traitement.

Stocker des colonnes `bytea` ou de volumineux payloads encodés en base64 dans PostgreSQL dégrade immédiatement les performances du pool de connexions, fait exploser la taille des sauvegardes et alourdit les coûts d'hébergement.

---

### DECISION
Interdire tout stockage de blob média dans la base PostgreSQL.  
Les médias lourds sont obligatoirement délégués à **Cloudflare R2** (stockage objet compatible S3).  
PostgreSQL ne conserve que des références immuables : `storage_key`, `size_bytes`, `mime_type` et `sha256`.

---

### WHY
1. **Économie & Prévisibilité :** Cloudflare R2 ne facture aucun coût de bande passante sortante (zéro frais d'egress), ce qui est capital pour la diffusion de flux vidéo de formation intensive.
2. **Performance de la base :** La taille de la base relationnelle reste minime, permettant des snapshots et des restaurations ultra-rapides.
3. **Distribution Edge :** Intégration native avec le réseau CDN mondial de Cloudflare pour un chargement rapide même sur des connexions distantes de chantiers miniers.

---

### CONSEQUENCES
- **Positives :** Réduction drastique des coûts d'infrastructure, vitesse de lecture des vidéos, résilience des backups.
- **Points d'attention :** Nécessite la signature d'URLs temporaires (`presigned URLs`) pour sécuriser l'accès aux documents privés et restreints.

---

### OUT OF SCOPE
- Transcodage vidéo à la volée multi-résolutions (HLS/DASH) lors du MVP. Des formats MP4 standards optimisés suffisent pour la phase pilote.
