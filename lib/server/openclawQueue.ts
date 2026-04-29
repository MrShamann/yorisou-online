import {
  appendOpenClawRunHistory as appendOpenClawRunHistoryStore,
  appendOpenClawApprovedPoolHistoryEvent as appendOpenClawApprovedPoolHistoryEventStore,
  getOpenClawQueuePaths as getOpenClawQueuePathsStore,
  getOpenClawStoreStatus,
  listOpenClawArtifacts as listOpenClawArtifactsStore,
  listOpenClawApprovedPoolHistoryRecords as listOpenClawApprovedPoolHistoryRecordsStore,
  listOpenClawApprovedPoolRecords as listOpenClawApprovedPoolRecordsStore,
  listOpenClawApprovedStagingRecords as listOpenClawApprovedStagingRecordsStore,
  listOpenClawStagingHistoryRecords as listOpenClawStagingHistoryRecordsStore,
  appendOpenClawStagingHistoryEvent as appendOpenClawStagingHistoryEventStore,
  readOpenClawOperatorSummary as readOpenClawOperatorSummaryStore,
  readOpenClawQueueIndex as readOpenClawQueueIndexStore,
  readOpenClawApprovedPoolState as readOpenClawApprovedPoolStateStore,
  readOpenClawApprovedStagingState as readOpenClawApprovedStagingStateStore,
  readOpenClawReviewState as readOpenClawReviewStateStore,
  rebuildOpenClawQueueIndex as rebuildOpenClawQueueIndexStore,
  removeOpenClawApprovedStagingRecord as removeOpenClawApprovedStagingRecordStore,
  restoreOpenClawApprovedPoolRecord as restoreOpenClawApprovedPoolRecordStore,
  restoreOpenClawApprovedStagingRecord as restoreOpenClawApprovedStagingRecordStore,
  setOpenClawApprovedPoolCooldown as setOpenClawApprovedPoolCooldownStore,
  setOpenClawApprovedPoolRetired as setOpenClawApprovedPoolRetiredStore,
  restageOpenClawApprovedStagingRecord as restageOpenClawApprovedStagingRecordStore,
  updateOpenClawReviewRecord as updateOpenClawReviewRecordStore,
  upsertOpenClawApprovedPoolRecord as upsertOpenClawApprovedPoolRecordStore,
  upsertOpenClawApprovedStagingRecord as upsertOpenClawApprovedStagingRecordStore,
  writeOpenClawReviewState as writeOpenClawReviewStateStore,
  readOpenClawRunHistory as readOpenClawRunHistoryStore,
} from "@/automation/yorisou/shared/openclaw-store.mjs";

export type OpenClawArtifactFamily =
  | "question-candidates"
  | "result-surface-candidates"
  | "ui-experiments"
  | "feedback-learning"
  | "operating-loop"
  | "post-deploy-audit";

export type OpenClawQueueItemStatus =
  | "pending"
  | "approve"
  | "reject"
  | "hold"
  | "needs_revision"
  | "preferred"
  | "accept_recommendation"
  | "review_later"
  | "reject_recommendation"
  | "passed"
  | "warning_acknowledged"
  | "needs_follow_up";

export type OpenClawReviewRecord = {
  artifactKey: string;
  artifactFamily: OpenClawArtifactFamily;
  status: OpenClawQueueItemStatus | "pending";
  notes: string;
  updatedAt: string;
  itemNotes?: Record<string, { status: OpenClawQueueItemStatus; note: string; updatedAt: string }>;
  preferredItemId?: string | null;
};

export type OpenClawBatch = {
  artifactKey: string;
  artifactFamily: OpenClawArtifactFamily;
  createdAt: string;
  filePath: string;
  reviewState: OpenClawReviewRecord | null;
  data: unknown;
};

export async function listOpenClawBatches() {
  const batches = await listOpenClawArtifactsStore();
  const reviewState = await readOpenClawReviewState();
  return batches.map((batch) => ({
    artifactKey: batch.artifactKey,
    artifactFamily: batch.artifactFamily as OpenClawArtifactFamily,
    createdAt: batch.createdAt,
    filePath: batch.filePath,
    reviewState: reviewState.batches?.[batch.artifactKey] || null,
    data: batch.data,
  })) as OpenClawBatch[];
}

export async function readOpenClawReviewState() {
  return readOpenClawReviewStateStore();
}

export async function writeOpenClawReviewState(nextState: { batches: Record<string, OpenClawReviewRecord> }) {
  return writeOpenClawReviewStateStore(nextState);
}

export async function updateOpenClawReviewRecord(input: {
  artifactKey: string;
  artifactFamily: OpenClawArtifactFamily;
  status: OpenClawQueueItemStatus | "pending";
  notes: string;
  itemId?: string | null;
  itemStatus?: OpenClawQueueItemStatus | null;
  itemNote?: string | null;
  preferredItemId?: string | null;
}) {
  return updateOpenClawReviewRecordStore(input);
}

export async function rebuildOpenClawQueueIndex() {
  return rebuildOpenClawQueueIndexStore();
}

export async function readOpenClawQueueIndex() {
  return readOpenClawQueueIndexStore();
}

export async function appendOpenClawRunHistory(entry: unknown) {
  return appendOpenClawRunHistoryStore(entry);
}

export async function readOpenClawRunHistory() {
  return readOpenClawRunHistoryStore();
}

export async function readOpenClawOperatorSummary() {
  return readOpenClawOperatorSummaryStore();
}

export async function readOpenClawApprovedStagingState() {
  return readOpenClawApprovedStagingStateStore();
}

export async function readOpenClawApprovedPoolState() {
  return readOpenClawApprovedPoolStateStore();
}

export async function listOpenClawApprovedStagingRecords() {
  return listOpenClawApprovedStagingRecordsStore();
}

export async function listOpenClawApprovedPoolRecords() {
  return listOpenClawApprovedPoolRecordsStore();
}

export async function listOpenClawStagingHistoryRecords() {
  return listOpenClawStagingHistoryRecordsStore();
}

export async function listOpenClawApprovedPoolHistoryRecords() {
  return listOpenClawApprovedPoolHistoryRecordsStore();
}

export async function appendOpenClawStagingHistoryEvent(event: {
  artifactKey: string;
  artifactFamily: OpenClawArtifactFamily;
  scope?: "batch" | "item";
  itemId?: string | null;
  action: string;
  previousState?: string | null;
  nextState?: string | null;
  reviewStatus?: string | null;
  reviewNote?: string | null;
  itemNote?: string | null;
  preferredItemId?: string | null;
  sourceArtifactCreatedAt?: string | null;
  sourceArtifactFilePath?: string | null;
  timestamp?: string;
  operatorAction?: string | null;
  operatorTag?: string | null;
}) {
  return appendOpenClawStagingHistoryEventStore(event);
}

export async function appendOpenClawApprovedPoolHistoryEvent(event: {
  poolKey: string;
  artifactKey: string;
  artifactFamily: OpenClawArtifactFamily;
  scope?: "batch" | "item";
  itemId?: string | null;
  action: string;
  previousState?: string | null;
  nextState?: string | null;
  reviewStatus?: string | null;
  reviewNote?: string | null;
  sourceArtifactCreatedAt?: string | null;
  sourceArtifactFilePath?: string | null;
  sourceStagingKey?: string | null;
  sourceStagingStatus?: string | null;
  timestamp?: string;
  operatorAction?: string | null;
  operatorTag?: string | null;
  operatorNote?: string | null;
  retirementReason?: string | null;
  cooldownUntil?: string | null;
}) {
  return appendOpenClawApprovedPoolHistoryEventStore(event);
}

export async function upsertOpenClawApprovedStagingRecord(input: {
  artifactKey: string;
  artifactFamily: OpenClawArtifactFamily;
  status: OpenClawQueueItemStatus | "pending";
  notes: string;
  itemId?: string | null;
  itemStatus?: OpenClawQueueItemStatus | null;
  itemNote?: string | null;
  preferredItemId?: string | null;
  sourceArtifactCreatedAt?: string | null;
  sourceArtifactFilePath?: string | null;
  operatorAction?: string | null;
  operatorTag?: string | null;
}) {
  return upsertOpenClawApprovedStagingRecordStore(input);
}

export async function upsertOpenClawApprovedPoolRecord(input: {
  artifactKey: string;
  artifactFamily: OpenClawArtifactFamily;
  status?: "active" | "cooling_down" | "retired";
  notes?: string;
  pools?: string[] | string;
  poolNames?: string[] | string;
  itemId?: string | null;
  itemStatus?: OpenClawQueueItemStatus | null;
  itemNote?: string | null;
  sourceArtifactCreatedAt?: string | null;
  sourceArtifactFilePath?: string | null;
  sourceStagingKey?: string | null;
  sourceStagingStatus?: string | null;
  sourceReviewStatus?: string | null;
  sourceReviewNote?: string | null;
  operatorAction?: string | null;
  operatorTag?: string | null;
  operatorNote?: string | null;
}) {
  return upsertOpenClawApprovedPoolRecordStore(input);
}

export async function setOpenClawApprovedPoolCooldown(input: {
  artifactKey: string;
  artifactFamily: OpenClawArtifactFamily;
  itemId?: string | null;
  notes?: string;
  operatorNote?: string;
}) {
  return setOpenClawApprovedPoolCooldownStore(input);
}

export async function setOpenClawApprovedPoolRetired(input: {
  artifactKey: string;
  artifactFamily: OpenClawArtifactFamily;
  itemId?: string | null;
  notes?: string;
  retirementReason?: string;
  operatorNote?: string;
}) {
  return setOpenClawApprovedPoolRetiredStore(input);
}

export async function restoreOpenClawApprovedPoolRecord(input: {
  artifactKey: string;
  artifactFamily: OpenClawArtifactFamily;
  itemId?: string | null;
  notes?: string;
  operatorNote?: string;
}) {
  return restoreOpenClawApprovedPoolRecordStore(input);
}

export async function removeOpenClawApprovedStagingRecord(input: {
  artifactKey: string;
  artifactFamily: OpenClawArtifactFamily;
  itemId?: string | null;
}) {
  return removeOpenClawApprovedStagingRecordStore(input);
}

export async function restoreOpenClawApprovedStagingRecord(input: {
  artifactKey: string;
  artifactFamily: OpenClawArtifactFamily;
  itemId?: string | null;
}) {
  return restoreOpenClawApprovedStagingRecordStore(input);
}

export async function restageOpenClawApprovedStagingRecord(input: {
  artifactKey: string;
  artifactFamily: OpenClawArtifactFamily;
  itemId?: string | null;
}) {
  return restageOpenClawApprovedStagingRecordStore(input);
}

export function getOpenClawQueuePaths() {
  return getOpenClawQueuePathsStore();
}

export function getOpenClawStoreSummary() {
  return getOpenClawStoreStatus();
}
