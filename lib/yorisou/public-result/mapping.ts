import type { SubdimensionCode } from "@/lib/yorisou/scoring/types";

import { PUBLIC_ARCHETYPE_BY_CODE } from "./taxonomy";
import type { PublicClanCode } from "./types";

type PublicClanRule = {
  clanCode: PublicClanCode;
  clanEnglish: string;
  clanJapanese: string;
  primarySubdimensions: SubdimensionCode[];
  secondarySubdimensions: SubdimensionCode[];
};

type PublicArchetypeRule = {
  publicCode: keyof typeof PUBLIC_ARCHETYPE_BY_CODE;
  clanCode: PublicClanCode;
  primarySubdimensions: SubdimensionCode[];
  secondarySubdimensions: SubdimensionCode[];
};

export const PUBLIC_CLAN_RULES: readonly PublicClanRule[] = [
  {
    clanCode: "Mist",
    clanEnglish: "Mist",
    clanJapanese: "霞",
    primarySubdimensions: [
      "SD_ATMOSPHERE_READING",
      "SO_NOTICING_STATE",
      "EL_AFTER_EFFECT",
      "SO_NAMING_PATTERN",
    ],
    secondarySubdimensions: [
      "EL_TENSION",
      "SD_RETURNABLE_DISTANCE",
    ],
  },
  {
    clanCode: "Ember",
    clanEnglish: "Ember",
    clanJapanese: "灯",
    primarySubdimensions: [
      "AR_STARTABILITY",
      "DR_STARTING_POINT",
      "RP_RESTORATION_TRIGGER",
      "CL_EXPLANATION_PRESSURE",
      "SO_FEEDBACK_OPENNESS",
    ],
    secondarySubdimensions: [
      "EL_INNER_WEIGHT",
      "AR_RESTART",
    ],
  },
  {
    clanCode: "Willow",
    clanEnglish: "Willow",
    clanJapanese: "柳",
    primarySubdimensions: [
      "BD_ROLE_DISTANCE",
      "BD_HOLDING_RESPONSE",
      "BD_TAKING_ON_TOO_MUCH",
      "SD_REPLY_PRESSURE",
      "SD_RETURNABLE_DISTANCE",
    ],
    secondarySubdimensions: [
      "SO_FEEDBACK_OPENNESS",
      "CL_EXPLANATION_PRESSURE",
    ],
  },
  {
    clanCode: "Tide",
    clanEnglish: "Tide",
    clanJapanese: "潮",
    primarySubdimensions: [
      "DR_TRANSITION",
      "AR_RESTART",
      "RP_RESET_METHOD",
      "AR_STARTABILITY",
      "CL_OPTION_LOAD",
    ],
    secondarySubdimensions: [
      "EL_TENSION",
      "RP_RESTORATION_TRIGGER",
    ],
  },
  {
    clanCode: "Cedar",
    clanEnglish: "Cedar",
    clanJapanese: "杜",
    primarySubdimensions: [
      "AR_CONTINUATION",
      "DR_ROUTINE_ANCHOR",
      "RP_RECOVERY_NEED",
      "RP_RESTORATION_TRIGGER",
      "SD_RETURNABLE_DISTANCE",
    ],
    secondarySubdimensions: [
      "SO_FEEDBACK_OPENNESS",
      "BD_HOLDING_RESPONSE",
    ],
  },
  {
    clanCode: "Iris",
    clanEnglish: "Iris",
    clanJapanese: "菫",
    primarySubdimensions: [
      "CL_CRITERIA",
      "CL_OPTION_LOAD",
      "SO_NAMING_PATTERN",
      "EL_AFTER_EFFECT",
      "DR_STARTING_POINT",
    ],
    secondarySubdimensions: [
      "EL_INNER_WEIGHT",
      "SO_NOTICING_STATE",
    ],
  },
] as const;

export const PUBLIC_ARCHETYPE_RULES: readonly PublicArchetypeRule[] = [
  {
    publicCode: "MS-KI",
    clanCode: "Mist",
    primarySubdimensions: ["SD_ATMOSPHERE_READING", "SO_NOTICING_STATE"],
    secondarySubdimensions: ["EL_TENSION"],
  },
  {
    publicCode: "MS-SZ",
    clanCode: "Mist",
    primarySubdimensions: ["EL_TENSION", "SD_ATMOSPHERE_READING"],
    secondarySubdimensions: ["AR_RESTART", "DR_TRANSITION"],
  },
  {
    publicCode: "MS-YO",
    clanCode: "Mist",
    primarySubdimensions: ["EL_AFTER_EFFECT", "SO_NAMING_PATTERN"],
    secondarySubdimensions: ["SO_NOTICING_STATE"],
  },
  {
    publicCode: "MS-SI",
    clanCode: "Mist",
    primarySubdimensions: ["SO_NOTICING_STATE", "SD_RETURNABLE_DISTANCE"],
    secondarySubdimensions: ["DR_STARTING_POINT"],
  },
  {
    publicCode: "EM-AK",
    clanCode: "Ember",
    primarySubdimensions: ["AR_STARTABILITY", "DR_STARTING_POINT"],
    secondarySubdimensions: ["AR_RESTART"],
  },
  {
    publicCode: "EM-FB",
    clanCode: "Ember",
    primarySubdimensions: ["EL_INNER_WEIGHT", "AR_CONTINUATION"],
    secondarySubdimensions: ["SO_NOTICING_STATE"],
  },
  {
    publicCode: "EM-KU",
    clanCode: "Ember",
    primarySubdimensions: ["RP_RESTORATION_TRIGGER", "AR_RESTART"],
    secondarySubdimensions: ["SO_FEEDBACK_OPENNESS"],
  },
  {
    publicCode: "EM-KA",
    clanCode: "Ember",
    primarySubdimensions: ["CL_EXPLANATION_PRESSURE", "SO_FEEDBACK_OPENNESS"],
    secondarySubdimensions: ["SD_REPLY_PRESSURE"],
  },
  {
    publicCode: "WL-YM",
    clanCode: "Willow",
    primarySubdimensions: ["BD_ROLE_DISTANCE", "SD_RETURNABLE_DISTANCE"],
    secondarySubdimensions: ["SD_ATMOSPHERE_READING"],
  },
  {
    publicCode: "WL-SE",
    clanCode: "Willow",
    primarySubdimensions: ["BD_TAKING_ON_TOO_MUCH", "BD_ROLE_DISTANCE"],
    secondarySubdimensions: ["CL_EXPLANATION_PRESSURE", "EL_INNER_WEIGHT"],
  },
  {
    publicCode: "WL-UN",
    clanCode: "Willow",
    primarySubdimensions: ["BD_HOLDING_RESPONSE", "SD_REPLY_PRESSURE"],
    secondarySubdimensions: ["BD_TAKING_ON_TOO_MUCH"],
  },
  {
    publicCode: "WL-SK",
    clanCode: "Willow",
    primarySubdimensions: ["BD_HOLDING_RESPONSE", "SO_FEEDBACK_OPENNESS"],
    secondarySubdimensions: ["SD_REPLY_PRESSURE"],
  },
  {
    publicCode: "TD-SG",
    clanCode: "Tide",
    primarySubdimensions: ["DR_TRANSITION", "RP_RESET_METHOD"],
    secondarySubdimensions: ["AR_RESTART"],
  },
  {
    publicCode: "TD-NT",
    clanCode: "Tide",
    primarySubdimensions: ["RP_RESET_METHOD", "EL_TENSION"],
    secondarySubdimensions: ["AR_RESTART", "AR_CONTINUATION"],
  },
  {
    publicCode: "TD-KY",
    clanCode: "Tide",
    primarySubdimensions: ["CL_OPTION_LOAD", "DR_TRANSITION"],
    secondarySubdimensions: ["RP_RESET_METHOD"],
  },
  {
    publicCode: "TD-TB",
    clanCode: "Tide",
    primarySubdimensions: ["AR_STARTABILITY", "CL_OPTION_LOAD"],
    secondarySubdimensions: ["DR_STARTING_POINT"],
  },
  {
    publicCode: "CD-IS",
    clanCode: "Cedar",
    primarySubdimensions: ["AR_CONTINUATION", "DR_ROUTINE_ANCHOR"],
    secondarySubdimensions: ["BD_HOLDING_RESPONSE"],
  },
  {
    publicCode: "CD-SG",
    clanCode: "Cedar",
    primarySubdimensions: ["RP_RESTORATION_TRIGGER", "SO_FEEDBACK_OPENNESS"],
    secondarySubdimensions: ["BD_HOLDING_RESPONSE"],
  },
  {
    publicCode: "CD-AS",
    clanCode: "Cedar",
    primarySubdimensions: ["DR_ROUTINE_ANCHOR", "DR_STARTING_POINT"],
    secondarySubdimensions: ["CL_CRITERIA"],
  },
  {
    publicCode: "CD-KJ",
    clanCode: "Cedar",
    primarySubdimensions: ["SD_RETURNABLE_DISTANCE", "RP_RECOVERY_NEED"],
    secondarySubdimensions: ["DR_ROUTINE_ANCHOR"],
  },
  {
    publicCode: "IR-IH",
    clanCode: "Iris",
    primarySubdimensions: ["CL_OPTION_LOAD", "EL_AFTER_EFFECT"],
    secondarySubdimensions: ["SO_NAMING_PATTERN"],
  },
  {
    publicCode: "IR-MH",
    clanCode: "Iris",
    primarySubdimensions: ["DR_STARTING_POINT", "CL_CRITERIA"],
    secondarySubdimensions: ["CL_OPTION_LOAD"],
  },
  {
    publicCode: "IR-SI",
    clanCode: "Iris",
    primarySubdimensions: ["CL_CRITERIA", "SO_NAMING_PATTERN"],
    secondarySubdimensions: ["AR_STARTABILITY"],
  },
  {
    publicCode: "IR-MK",
    clanCode: "Iris",
    primarySubdimensions: ["SO_NAMING_PATTERN", "CL_EXPLANATION_PRESSURE"],
    secondarySubdimensions: ["CL_OPTION_LOAD"],
  },
] as const;
