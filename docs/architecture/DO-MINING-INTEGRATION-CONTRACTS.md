# DO-MINING — CONTRATS D'INTÉGRATION & PORTS D'INFRASTRUCTURE

**Statut :** FIGÉ (FROZEN)  
**Date :** 2026-09-15  
**Version :** 1.0.0-phase0  

---

## 1. STRATÉGIE DES PORTS & ADAPTATEURS

Afin d'immuniser le noyau contre l'obsolescence ou le changement d'un fournisseur cloud (Vercel, Supabase, Cloudflare, Jitsi, Hostinger), toute entrée/sortie périphérique passe par un contrat TypeScript strict.

Pour chaque port, le système formalise :
1. Le **Contract** (Interface TypeScript abstraite).
2. Le **MockAdapter** (Comportement en mémoire pour tests unitaires et mode hors-ligne).
3. Le **ManualAdapter** (Opérations supervisées manuellement par l'opérateur pour le MVP).
4. Le **FutureRealAdapter** (Implémentation connectée avec le SDK réel, activable sans altérer les consommateurs).

---

## 2. PORT DE STOCKAGE D'ACTIFS LOURDS (`StoragePort`)

### Le Contrat
```typescript
export interface StorageUploadRequest {
  storageKey: string;           // Chemin relatif sécurisé (ex: "videos/granulats-ch01.mp4")
  mimeType: string;
  sizeBytes: number;
  sha256Checksum?: string;
}

export interface PresignedUploadUrlResponse {
  uploadUrl: string;
  headers: Record<string, string>;
  expiresAt: string;
}

export interface StoragePort {
  getReadUrl(storageKey: string, expiresInSeconds?: number): Promise<string>;
  getPresignedUploadUrl(request: StorageUploadRequest): Promise<PresignedUploadUrlResponse>;
  deleteObject(storageKey: string): Promise<boolean>;
  verifyObjectExists(storageKey: string): Promise<boolean>;
}
```

### Déclinaisons
- **MockAdapter (`InMemoryStorageAdapter`) :** Simule les URLs de lecture via des URIs locales `data:` ou des URLs statiques de substitution.
- **ManualAdapter (`ManualStorageAdapter`) :** Permet à un administrateur de téléverser manuellement un fichier via la console Cloudflare R2 et de renseigner manuellement la clé `storage_key` dans le système.
- **FutureRealAdapter (`CloudflareR2StorageAdapter`) :** Exploite `@aws-sdk/client-s3` branché sur le endpoint S3 compatible de Cloudflare R2 avec URLs signées temporaires.

---

## 3. PORT DE CLASSES EN DIRECT & VISIOCONFÉRENCE (`LiveSessionPort`)

### Le Contrat
```typescript
export interface LiveRoomConfig {
  roomId: string;
  title: string;
  scheduledStartTime: string;
  durationMinutes: number;
  maxParticipants?: number;
}

export interface LiveParticipantCredentials {
  roomUrl: string;
  roomToken?: string;
  displayName: string;
  isHost: boolean;
}

export interface LiveSessionPort {
  provisionRoom(config: LiveRoomConfig): Promise<{ roomIdentifier: string; directUrl: string }>;
  generateParticipantAccess(
    roomIdentifier: string,
    userId: string,
    userName: string,
    isInstructor: boolean
  ): Promise<LiveParticipantCredentials>;
  closeRoom(roomIdentifier: string): Promise<void>;
}
```

### Déclinaisons
- **MockAdapter (`MockLiveSessionAdapter`) :** Renvoie une URL factice de salle de test locale avec un token signé bidon.
- **ManualAdapter (`ManualLiveSessionAdapter`) :** L'administrateur crée manuellement une salle Jitsi Meet (ex: `https://meet.jit.si/do-mining-session-xyz`) et colle le lien dans les métadonnées de la session sans automatisation API.
- **FutureRealAdapter (`JitsiAsAServiceAdapter` ou serveur auto-hébergé) :** Génère dynamiquement des jetons JWT Jitsi signés avec une clé asymétrique privée et contrôle les flux audio/vidéo des apprenants.

---

## 4. PORT DE NOTIFICATION ET D'ALERTES (`NotificationPort`)

### Le Contrat
```typescript
export interface NotificationPayload {
  recipientUserId: string;
  recipientEmail?: string;
  title: string;
  message: string;
  urgency: 'LOW' | 'NORMAL' | 'HIGH';
  actionUrl?: string;
}

export interface NotificationPort {
  dispatchInApp(payload: NotificationPayload): Promise<void>;
  dispatchEmail(payload: NotificationPayload): Promise<void>;
}
```

### Déclinaisons
- **MockAdapter :** Stocke les messages dans un tableau mémoire pour inspection dans les tests.
- **ManualAdapter :** Affiche une file de messages prêts à copier-coller dans une boîte d'administration.
- **FutureRealAdapter :** Intégration d'un routeur transactionnel (ex: Resend ou SMTP direct).

---

## 5. PORTS D'INFRASTRUCTURES SECONDAIRES (RÉSERVÉS)

- **`DeploymentPort` :** Découplage de l'orchestration Vercel/Cloud Run.
- **`DnsPort` :** Réservé pour la délégation de domaines entreprises (clients miniers grands comptes).
- **`RepositoryPort` :** Réservé pour l'audit et le versionnement externe sur GitHub.

Toutes ces interfaces interdisent formellement l'utilisation directe de variables d'environnement fournisseurs (`CF_API_KEY`, `VERCEL_TOKEN`, etc.) dans les modules de domaine ou les composants d'interface.
