import {
  PUBLIC_RESULT_CURRENT_STATE_NOTE,
  PUBLIC_RESULT_MAPPING_VERSION,
  type PublicArchetypeDefinition,
} from "./types";

function defineArchetype(
  definition: Omit<
    PublicArchetypeDefinition,
    "currentStateNote" | "mappingVersion"
  >,
): PublicArchetypeDefinition {
  return {
    ...definition,
    currentStateNote: PUBLIC_RESULT_CURRENT_STATE_NOTE,
    mappingVersion: PUBLIC_RESULT_MAPPING_VERSION,
  };
}

export const PUBLIC_ARCHETYPE_TAXONOMY = [
  defineArchetype({
    publicCode: "MS-KI",
    nickname: "気配読み",
    clanCode: "Mist",
    clanEnglish: "Mist",
    clanJapanese: "霞",
    secondaryBadge: "気配と余韻",
  }),
  defineArchetype({
    publicCode: "MS-SZ",
    nickname: "さざ波番",
    clanCode: "Mist",
    clanEnglish: "Mist",
    clanJapanese: "霞",
    secondaryBadge: "揺れの気配",
  }),
  defineArchetype({
    publicCode: "MS-YO",
    nickname: "余韻結び",
    clanCode: "Mist",
    clanEnglish: "Mist",
    clanJapanese: "霞",
    secondaryBadge: "意味の余韻",
  }),
  defineArchetype({
    publicCode: "MS-SI",
    nickname: "静けさ読み",
    clanCode: "Mist",
    clanEnglish: "Mist",
    clanJapanese: "霞",
    secondaryBadge: "静かな観察",
  }),
  defineArchetype({
    publicCode: "EM-AK",
    nickname: "灯起こし",
    clanCode: "Ember",
    clanEnglish: "Ember",
    clanJapanese: "灯",
    secondaryBadge: "小さな着火",
  }),
  defineArchetype({
    publicCode: "EM-FB",
    nickname: "伏せ火",
    clanCode: "Ember",
    clanEnglish: "Ember",
    clanJapanese: "灯",
    secondaryBadge: "内なる火種",
  }),
  defineArchetype({
    publicCode: "EM-KU",
    nickname: "風受け",
    clanCode: "Ember",
    clanEnglish: "Ember",
    clanJapanese: "灯",
    secondaryBadge: "動きのきっかけ",
  }),
  defineArchetype({
    publicCode: "EM-KA",
    nickname: "声の灯",
    clanCode: "Ember",
    clanEnglish: "Ember",
    clanJapanese: "灯",
    secondaryBadge: "言葉の火",
  }),
  defineArchetype({
    publicCode: "WL-YM",
    nickname: "柳間合い",
    clanCode: "Willow",
    clanEnglish: "Willow",
    clanJapanese: "柳",
    secondaryBadge: "距離の調整",
  }),
  defineArchetype({
    publicCode: "WL-SE",
    nickname: "線守り",
    clanCode: "Willow",
    clanEnglish: "Willow",
    clanJapanese: "柳",
    secondaryBadge: "境界の見張り",
  }),
  defineArchetype({
    publicCode: "WL-UN",
    nickname: "受け流し",
    clanCode: "Willow",
    clanEnglish: "Willow",
    clanJapanese: "柳",
    secondaryBadge: "流して整える",
  }),
  defineArchetype({
    publicCode: "WL-SK",
    nickname: "掬い手",
    clanCode: "Willow",
    clanEnglish: "Willow",
    clanJapanese: "柳",
    secondaryBadge: "必要なものだけ",
  }),
  defineArchetype({
    publicCode: "TD-SG",
    nickname: "潮替え",
    clanCode: "Tide",
    clanEnglish: "Tide",
    clanJapanese: "潮",
    secondaryBadge: "流れの切替",
  }),
  defineArchetype({
    publicCode: "TD-NT",
    nickname: "波立て直し",
    clanCode: "Tide",
    clanEnglish: "Tide",
    clanJapanese: "潮",
    secondaryBadge: "小さな立て直し",
  }),
  defineArchetype({
    publicCode: "TD-KY",
    nickname: "景色替え",
    clanCode: "Tide",
    clanEnglish: "Tide",
    clanJapanese: "潮",
    secondaryBadge: "場面の切替",
  }),
  defineArchetype({
    publicCode: "TD-TB",
    nickname: "試し火",
    clanCode: "Tide",
    clanEnglish: "Tide",
    clanJapanese: "潮",
    secondaryBadge: "試して進む",
  }),
  defineArchetype({
    publicCode: "CD-IS",
    nickname: "石積み",
    clanCode: "Cedar",
    clanEnglish: "Cedar",
    clanJapanese: "杜",
    secondaryBadge: "積み上げる足場",
  }),
  defineArchetype({
    publicCode: "CD-SG",
    nickname: "支え木",
    clanCode: "Cedar",
    clanEnglish: "Cedar",
    clanJapanese: "杜",
    secondaryBadge: "支えの手触り",
  }),
  defineArchetype({
    publicCode: "CD-AS",
    nickname: "足元番",
    clanCode: "Cedar",
    clanEnglish: "Cedar",
    clanJapanese: "杜",
    secondaryBadge: "まず足元から",
  }),
  defineArchetype({
    publicCode: "CD-KJ",
    nickname: "帰り印",
    clanCode: "Cedar",
    clanEnglish: "Cedar",
    clanJapanese: "杜",
    secondaryBadge: "戻れる目印",
  }),
  defineArchetype({
    publicCode: "IR-IH",
    nickname: "糸ほどき",
    clanCode: "Iris",
    clanEnglish: "Iris",
    clanJapanese: "菫",
    secondaryBadge: "ほどいて見る",
  }),
  defineArchetype({
    publicCode: "IR-MH",
    nickname: "道ひらき",
    clanCode: "Iris",
    clanEnglish: "Iris",
    clanJapanese: "菫",
    secondaryBadge: "道筋をつける",
  }),
  defineArchetype({
    publicCode: "IR-SI",
    nickname: "印つけ",
    clanCode: "Iris",
    clanEnglish: "Iris",
    clanJapanese: "菫",
    secondaryBadge: "確認のしるし",
  }),
  defineArchetype({
    publicCode: "IR-MK",
    nickname: "見立て替え",
    clanCode: "Iris",
    clanEnglish: "Iris",
    clanJapanese: "菫",
    secondaryBadge: "見方の切替",
  }),
] as const satisfies readonly PublicArchetypeDefinition[];

export const PUBLIC_ARCHETYPE_BY_CODE = Object.fromEntries(
  PUBLIC_ARCHETYPE_TAXONOMY.map((item) => [item.publicCode, item]),
) as Record<(typeof PUBLIC_ARCHETYPE_TAXONOMY)[number]["publicCode"], PublicArchetypeDefinition>;

export function findPublicArchetypeByCode(code: string | null | undefined) {
  if (!code) return null;
  return PUBLIC_ARCHETYPE_BY_CODE[code as keyof typeof PUBLIC_ARCHETYPE_BY_CODE] ?? null;
}
