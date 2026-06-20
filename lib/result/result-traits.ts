import dimensionDefinitionTableJson from "@/docs/yorisou_canonical_21_dimension_framework_2026-04-13/yorisou_dimension_definition_table.json";
import type { ResultLabSnapshot } from "@/lib/result/rendering-contract-adapter";

type DimensionDefinitionRow = {
  dimension_id: string;
  dimension_name: string;
};

const dimensionDefinitions = dimensionDefinitionTableJson as { dimensions: DimensionDefinitionRow[] };
const dimensionNameLookup = new Map(dimensionDefinitions.dimensions.map((dimension) => [dimension.dimension_id, dimension.dimension_name]));

function uniqueDimensionIds(codes: string[] | null | undefined) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const code of codes || []) {
    if (!code || seen.has(code)) continue;
    seen.add(code);
    result.push(code);
  }
  return result;
}

export function buildCoreTraitLabels(snapshot: ResultLabSnapshot, limit = 3) {
  const personaIdentity = snapshot.payload?.subobjects.persona_identity;
  const core = uniqueDimensionIds(personaIdentity?.core_dimension_signature);
  const supporting = uniqueDimensionIds(personaIdentity?.supporting_dimensions);
  const merged = [...core, ...supporting].filter((code, index, array) => array.indexOf(code) === index);
  const selected = merged.slice(0, limit);

  return selected.map((code) => ({
    code,
    label: dimensionNameLookup.get(code) || code,
  }));
}

