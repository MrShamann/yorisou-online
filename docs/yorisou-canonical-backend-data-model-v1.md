# Yorisou Canonical Backend Data Model v1

This document defines Step 01 of the backend foundation: the canonical data model for Identity, CRM, Messaging, Privacy, and Support Operations.

It is aligned to the live implementation in `/lib/server/foundation/schema.ts` and `/lib/server/foundation/store.ts`.

## Scope

The canonical entities are:

1. `UserProfile`
2. `AuthIdentity`
3. `Conversation`
4. `MessageEvent`
5. `SupportCase`
6. `ConsentLog`
7. `AuditLog`

These seven entities are the source of truth for future backend/admin work. Hinata memory, support UI state, and OpenClaw learning artifacts are downstream consumers, not the primary record.

## Storage Model

- Storage mode: canonical foundation store
- Collections:
  - `user-profiles`
  - `auth-identities`
  - `conversations`
  - `message-events`
  - `support-cases`
  - `consent-logs`
  - `audit-logs`
- Shared-store capable through the foundation store abstraction in `/lib/server/foundation/store.ts`

## Entity Definitions

### 1. UserProfile

Purpose:
- canonical person/account profile for CRM and support continuity

Primary key:
- `userProfileId`

Important fields:
- `legacyAccountId`
- `profileStatus`
- `bindingState`
- `source`
- `channel`
- `profile.displayName`
- `profile.primaryLocale`
- `profile.city`
- `profile.role`
- `profile.lineDisplayName`
- `profile.lineNotificationsEnabled`
- `sensitiveProfile.familyContactName`
- `sensitiveProfile.familyContactRelation`
- `sensitiveProfile.familyContactMethod`
- `sensitiveProfile.familyContactValue`
- `sensitiveProfile.familyShareNote`
- `createdAt`
- `updatedAt`

Used by:
- Identity
- CRM
- Support Operations
- Privacy

### 2. AuthIdentity

Purpose:
- canonical login/binding record for email and LINE identities

Primary key:
- `authIdentityId`

Important fields:
- `identityType`
- `identityStatus`
- `bindingState`
- `userProfileId`
- `legacyAccountId`
- `identityKeyHash`
- `identityKeyHint`
- `externalIdentityKey`
- `externalIdentityKeyHint`
- `emailNormalized`
- `passwordHashPresent`
- `lineUserId`
- `lineIdTokenSubject`
- `linePictureUrl`
- `lineConnectedAt`
- `firstSeenAt`
- `lastSeenAt`
- `lastBoundAt`
- `source`
- `channel`
- `createdAt`
- `updatedAt`

Used by:
- Identity
- Privacy
- Support Operations

### 3. Conversation

Purpose:
- canonical conversation container across support-web, LINE, email, and future channels

Primary key:
- `conversationId`

Important fields:
- `userProfileId`
- `authIdentityId`
- `supportCaseId`
- `channel`
- `source`
- `bindingState`
- `externalIdentityKey`
- `externalIdentityKeyHint`
- `subject`
- `conversationStatus`
- `latestMessageEventId`
- `latestActivityAt`
- `createdAt`
- `updatedAt`

Used by:
- Messaging
- CRM
- Support Operations

### 4. MessageEvent

Purpose:
- canonical event timeline for inbound, outbound, and system message activity

Primary key:
- `messageEventId`

Important fields:
- `conversationId`
- `supportCaseId`
- `userProfileId`
- `authIdentityId`
- `channel`
- `source`
- `direction`
- `bindingState`
- `eventType`
- `messageType`
- `externalIdentityKey`
- `externalEventId`
- `externalMessageId`
- `replyTokenPresent`
- `replyStatus`
- `replyErrorCode`
- `deliveryMode`
- `isRedelivery`
- `sourceType`
- `contentText`
- `contentPayloadRef`
- `occurredAt`
- `recordedAt`
- `aiAssist`
- `createdAt`
- `updatedAt`

Used by:
- Messaging
- CRM timeline
- Support Operations
- Privacy audit support

### 5. SupportCase

Purpose:
- canonical support-work object that tracks state, summary, and follow-up continuity

Primary key:
- `supportCaseId`

Important fields:
- `userProfileId`
- `authIdentityId`
- `conversationId`
- `latestMessageEventId`
- `status`
- `bindingState`
- `source`
- `channel`
- `title`
- `summary`
- `latestActivityAt`
- `aiAssist`
- `createdAt`
- `updatedAt`

Used by:
- Support Operations
- CRM
- Messaging

### 6. ConsentLog

Purpose:
- canonical privacy/consent record for registration, identity binding, and related acceptance events

Primary key:
- `consentLogId`

Important fields:
- `userProfileId`
- `authIdentityId`
- `policyVersion`
- `consentType`
- `channel`
- `source`
- `bindingState`
- `timestamp`
- `metadata`
- `createdAt`
- `updatedAt`

Used by:
- Privacy
- Identity

### 7. AuditLog

Purpose:
- canonical audit trail for sensitive access, administrative actions, and system writes

Primary key:
- `auditLogId`

Important fields:
- `actorType`
- `actorUserProfileId`
- `actorAuthIdentityId`
- `action`
- `resourceType`
- `resourceId`
- `channel`
- `source`
- `bindingState`
- `containsSensitiveAccess`
- `summary`
- `ipHash`
- `metadata`
- `createdAt`
- `updatedAt`

Used by:
- Privacy
- Admin operations
- system traceability

## Core Relationships

- One `UserProfile` can own many `AuthIdentity` records.
- One `UserProfile` can own many `Conversation` records.
- One `Conversation` can own many `MessageEvent` records.
- One `SupportCase` can be linked to one active `Conversation`, and many `MessageEvent` records over time.
- `ConsentLog` and `AuditLog` attach accountability and privacy history to the same canonical identities.

## Ownership by Domain

- Identity:
  - `UserProfile`
  - `AuthIdentity`
- Messaging:
  - `Conversation`
  - `MessageEvent`
- Support Operations:
  - `SupportCase`
- Privacy:
  - `ConsentLog`
  - `AuditLog`
- CRM:
  - reads across all of the above, especially `UserProfile`, `Conversation`, `MessageEvent`, `SupportCase`

## Query Patterns Required for Phase 1

- Load a user by `userProfileId`
- Resolve identities by normalized email or `lineUserId`
- Resume support continuity by `externalIdentityKey` or bound user
- Load message history by `conversationId`
- Load active/open support cases by user
- Load recent consent history by user
- Load audit history for sensitive access and admin actions

## Backend Rule

These entities are the single source of truth for:

- identity state
- conversation continuity
- support timeline
- support case state
- privacy consent history
- auditability

Hinata memory, cached workspace state, and OpenClaw learning artifacts may derive from this layer, but they must not replace it.
