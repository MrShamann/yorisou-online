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
  title: "Result | Yorisou",
  description: "Review the locked result label, teaser, share copy, and deep-reading boundary in one read-only result view.",
};

type SearchParams = Promise<{
  persona?: string;
  scenario?: string;
  surface?: string;
  sessionMode?: string;
  versionMode?: string;
}>;

function buildCurrentPath(input: {
  persona: string;
  scenario: LabScenario;
  surface: LabSurfaceMode;
  sessionMode: "anonymous" | "bound";
  versionMode: "valid" | "mismatch";
}) {
  const params = new URLSearchParams();
  params.set("persona", input.persona);
  params.set("scenario", input.scenario);
  params.set("surface", input.surface);
  params.set("sessionMode", input.sessionMode);
  params.set("versionMode", input.versionMode);
  return `/en/result?${params.toString()}`;
}

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

  const currentPath = buildCurrentPath({
    persona: personaId,
    scenario,
    surface,
    sessionMode,
    versionMode,
  });

  return <CanonicalResultSurface locale="en" snapshot={snapshot} currentPath={currentPath} />;
}
