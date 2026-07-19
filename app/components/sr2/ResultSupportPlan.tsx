"use client";

// SR-2 — one shared result→service surface for every result family (§5, "do not
// create nine independent implementations"). It builds the deterministic support
// plan + the public-safe device-local save record + the guest-journey handoff
// from a small set of public-safe inputs, and renders the existing SR-1
// SupportPlanView (support plan + anonymous device-local save + feedback).

import { buildSupportPlan, type SupportPlanFamily } from "@/lib/sr1/supportPlan";
import SupportPlanView from "@/app/components/sr1/SupportPlanView";

type ResultSupportPlanProps = {
  family: SupportPlanFamily;
  resultLabel: string; // public result title
  traits?: string[]; // public-safe trait/trend lines
  confidence?: "low" | "medium";
  reportHref?: string | null; // deeper reading if one exists
  resultPath: string; // canonical route to re-open this result
  recognitionLine?: string;
  className?: string;
};

function toTriple(values: string[] | undefined, label: string): [string, string, string] {
  const t = (values ?? []).filter((v) => typeof v === "string" && v.trim()).slice(0, 3);
  return [t[0] ?? label, t[1] ?? "今の状態", t[2] ?? "公開結果"];
}

export default function ResultSupportPlan({
  family,
  resultLabel,
  traits,
  confidence = "low",
  reportHref = null,
  resultPath,
  recognitionLine,
  className,
}: ResultSupportPlanProps) {
  const plan = buildSupportPlan({ family, resultLabel, traits, confidence, reportHref, resultPath });

  return (
    <SupportPlanView
      className={className}
      plan={plan}
      save={{
        resultType: family,
        resultLabel,
        context: "public-result",
        recognitionLine,
        traitChips: toTriple(traits, resultLabel),
        resultPath,
        continuePath: resultPath,
        confidenceBand: confidence,
      }}
      journeyResult={{ family, label: resultLabel, resultPath }}
    />
  );
}
