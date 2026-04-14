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
  title: "あなたの結果 | Yorisou",
  description: "今の寄り添い方を、ひとつの見やすい結果として表示するページです。",
};

type SearchParams = Promise<{
  persona?: string;
  scenario?: string;
  surface?: string;
  sessionMode?: string;
  versionMode?: string;
}>;

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

  return <CanonicalResultSurface locale="ja" snapshot={snapshot} />;
}
