import { promises as fs } from "fs";
import { randomUUID } from "crypto";

import { ensureLocalArtifactDir, getOpenClawArtifactLocalFiles, mirrorOpenClawArtifact } from "@/lib/server/openclawArtifactStore";
import { forwardVoiceSignalToOpenClaw } from "@/lib/server/openclawVoiceBridge";
import type { VoiceSignalRecord } from "@/lib/voice/contracts";

async function readLocalVoiceSignals() {
  for (const file of getOpenClawArtifactLocalFiles("voice-signals")) {
    try {
      const content = await fs.readFile(file, "utf8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed as VoiceSignalRecord[];
      }
    } catch {
      continue;
    }
  }

  return [] as VoiceSignalRecord[];
}

export async function recordOpenClawVoiceSignal(
  payload: Omit<VoiceSignalRecord, "id" | "createdAt"> & { id?: string; createdAt?: string },
) {
  const signal: VoiceSignalRecord = {
    id: payload.id || `voice_signal_${randomUUID()}`,
    createdAt: payload.createdAt || new Date().toISOString(),
    ...payload,
  };

  const current = await readLocalVoiceSignals();
  current.push(signal);

  await ensureLocalArtifactDir();
  await fs.writeFile(getOpenClawArtifactLocalFiles("voice-signals")[0], JSON.stringify(current, null, 2) + "\n", "utf8");
  await mirrorOpenClawArtifact("voice-signals", signal);
  const backendForwarded = await forwardVoiceSignalToOpenClaw(signal);

  return {
    signal,
    backendForwarded,
  };
}
