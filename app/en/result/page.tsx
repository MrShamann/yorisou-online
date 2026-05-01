import type { Metadata } from "next";

import CanonicalResultSurface from "@/app/components/CanonicalResultSurface";
import {
  buildResultLabSnapshot,
  getCanonicalPersonaOptions,
  getLabScenarioOptions,
  getSurfaceOptions,
  getVersionModeOptions,
  type LabScenario,
  type LabSurfaceMode,
} from "@/lib/result/rendering-contract-adapter";

export const metadata: Metadata = {
  title: "Your result | Yorisou",
  description: "A clear, read-only result view that shows the support pattern that fits you right now.",
};

type SearchParams = Promise<{
  persona?: string;
  scenario?: string;
  surface?: string;
  sessionMode?: string;
  versionMode?: string;
}>;

export default async function EnglishResultPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = (await searchParams) || {};
  const personaOptions = getCanonicalPersonaOptions();
  const scenarioOptions = getLabScenarioOptions();
  const surfaceOptions = getSurfaceOptions();
  const versionModeOptions = getVersionModeOptions();

  const personaId = personaOptions.find((item) => item.personaId === params.persona)?.personaId || personaOptions[0]?.personaId || "P01";
  const scenario = (scenarioOptions.find((item) => item.value === params.scenario)?.value || "result_ready") as LabScenario;
  const surface = (surfaceOptions.find((item) => item.value === params.surface)?.value || "primary") as LabSurfaceMode;
  const sessionMode: "anonymous" | "bound" = params.sessionMode === "bound" ? "bound" : "anonymous";
  const versionMode = versionModeOptions.find((item) => item.value === params.versionMode)?.value || "valid";

  const snapshot = buildResultLabSnapshot({
    personaId,
    scenario,
    surfaceMode: surface,
    sessionMode,
    versionMode,
  });
  const nextStepHref = `/en/result/continue?persona=${encodeURIComponent(personaId)}`;

  return <CanonicalResultSurface locale="en" snapshot={snapshot} nextStepHref={nextStepHref} nextStepLabel="Continue reading" nextStepHint="Read the deeper continuation" />;
}
