import type { Metadata } from "next";

import CanonicalResultSurface from "@/app/components/CanonicalResultSurface";
import {
  buildResultLabSnapshot,
  getLabScenarioOptions,
  getCanonicalPersonaOptions,
  getSurfaceOptions,
  getVersionModeOptions,
  type LabScenario,
  type LabSurfaceMode,
} from "@/lib/result/rendering-contract-adapter";

export const metadata: Metadata = {
  title: "結果 | Yorisou",
  description: "ロック済みの結果名、ティーザー、共有文、深い読みをひとつの結果として確認するページです。",
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
  return `/result?${params.toString()}`;
}

export default async function ResultPage({
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

  return (
    <CanonicalResultSurface locale="ja" snapshot={snapshot} currentPath={currentPath} />
  );
}
