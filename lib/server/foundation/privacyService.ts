import { headers } from "next/headers";

import { createFoundationId, createIpHash, nowIso } from "@/lib/server/foundation/ids";
import {
  foundationAuditLogRepository,
  foundationConsentLogRepository,
} from "@/lib/server/foundation/repositories";
import type { AuditAction, AuditActorType, BindingState, Channel, ConsentLog, ConsentType, Source, AuditLog } from "@/lib/server/foundation/schema";

function getPolicyVersion() {
  return process.env.YORISOU_POLICY_VERSION?.trim() || "phase1-baseline";
}

async function getRequestIpHash() {
  try {
    const headerStore = await headers();
    const forwardedFor = headerStore.get("x-forwarded-for");
    const firstIp = forwardedFor?.split(",")[0]?.trim() || headerStore.get("x-real-ip") || null;
    return createIpHash(firstIp);
  } catch {
    return null;
  }
}

export class PrivacyAuditService {
  async recordConsent(input: {
    userProfileId: string | null;
    authIdentityId: string | null;
    consentType: ConsentType;
    channel: Channel;
    source: Source;
    bindingState: BindingState;
    timestamp?: string;
    metadata?: Record<string, string | boolean | null>;
  }) {
    const timestamp = input.timestamp || nowIso();
    const record: ConsentLog = {
      consentLogId: createFoundationId("consent"),
      userProfileId: input.userProfileId,
      authIdentityId: input.authIdentityId,
      policyVersion: getPolicyVersion(),
      consentType: input.consentType,
      channel: input.channel,
      source: input.source,
      bindingState: input.bindingState,
      timestamp,
      metadata: input.metadata || {},
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await foundationConsentLogRepository.save(record);
    return record;
  }

  async recordAudit(input: {
    actorType: AuditActorType;
    actorUserProfileId: string | null;
    actorAuthIdentityId: string | null;
    action: AuditAction;
    resourceType: AuditLog["resourceType"];
    resourceId: string | null;
    channel: Channel;
    source: Source;
    bindingState: BindingState;
    containsSensitiveAccess?: boolean;
    summary: string;
    metadata?: Record<string, string | boolean | null>;
  }) {
    const createdAt = nowIso();
    const record: AuditLog = {
      auditLogId: createFoundationId("audit"),
      actorType: input.actorType,
      actorUserProfileId: input.actorUserProfileId,
      actorAuthIdentityId: input.actorAuthIdentityId,
      action: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      channel: input.channel,
      source: input.source,
      bindingState: input.bindingState,
      containsSensitiveAccess: Boolean(input.containsSensitiveAccess),
      summary: input.summary,
      ipHash: await getRequestIpHash(),
      metadata: input.metadata || {},
      createdAt,
      updatedAt: createdAt,
    };

    await foundationAuditLogRepository.save(record);
    return record;
  }

  async listRecentAuditEntries(limit = 20) {
    const entries = await foundationAuditLogRepository.list();
    return entries.slice(0, limit);
  }

  async listRecentConsentEntries(limit = 20) {
    const entries = await foundationConsentLogRepository.list();
    return entries.slice(0, limit);
  }
}

export const privacyAuditService = new PrivacyAuditService();
