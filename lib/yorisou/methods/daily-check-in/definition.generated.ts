// GENERATED FILE — DO NOT EDIT BY HAND.
// Source of truth: docs/yorisou/mtf2a/daily-check-in.v1.json
// Source content hash (sha256, canonical serialization): 4107f004e0099bfd4ef82936f9801c421d256eb6d7ccacda8e762a7a132a8bd3
// Regenerate: node scripts/generate-daily-check-in-runtime.mjs
// Drift check: node scripts/generate-daily-check-in-runtime.mjs --check
// Validation fails when this artifact drifts from the canonical JSON
// (lib/yorisou/methods/daily-check-in/__tests__/canonical.test.ts).

export const DAILY_CHECK_IN_SOURCE_HASH = "4107f004e0099bfd4ef82936f9801c421d256eb6d7ccacda8e762a7a132a8bd3" as const;

export const DAILY_CHECK_IN_DEFINITION = {
  "methodId": "daily-check-in",
  "methodVersion": "daily-check-in-v1.0",
  "nameJa": "きょうの空模様",
  "subtitleJa": "1分のじぶん記録",
  "family": "yorisou_state",
  "executionModel": "recorded_state",
  "activationState": "gated",
  "schemaVersion": "daily-state-schema-v1.1",
  "acknowledgementVersion": "daily-ack-v1.2",
  "longitudinalVersion": "daily-longitudinal-v1",
  "recordContractVersion": "daily-record-contract-v1",
  "contentHash": "4107f004e0099bfd4ef82936f9801c421d256eb6d7ccacda8e762a7a132a8bd3",
  "yorisouScoring": null,
  "fields": [
    {
      "fieldId": "kokoro_tenki",
      "labelJa": "こころの天気",
      "helperJa": "いまの気分に近いものをひとつ",
      "options": [
        {
          "optionId": "hare",
          "labelJa": "はれ"
        },
        {
          "optionId": "usugumori",
          "labelJa": "うすぐもり"
        },
        {
          "optionId": "kumori",
          "labelJa": "くもり"
        },
        {
          "optionId": "ame",
          "labelJa": "あめ"
        },
        {
          "optionId": "kaze",
          "labelJa": "かぜが強い"
        }
      ]
    },
    {
      "fieldId": "karada_juden",
      "labelJa": "からだの充電",
      "helperJa": "元気の残量のイメージで",
      "options": [
        {
          "optionId": "tappuri",
          "labelJa": "たっぷり"
        },
        {
          "optionId": "maamaa",
          "labelJa": "まあまあ"
        },
        {
          "optionId": "sukuname",
          "labelJa": "少なめ"
        },
        {
          "optionId": "hobo_kara",
          "labelJa": "ほぼ空"
        }
      ]
    },
    {
      "fieldId": "atama_yohaku",
      "labelJa": "あたまの余白",
      "helperJa": "考えごとの詰まり具合",
      "options": [
        {
          "optionId": "sukkiri",
          "labelJa": "すっきり"
        },
        {
          "optionId": "futsuu",
          "labelJa": "ふつう"
        },
        {
          "optionId": "gisshiri",
          "labelJa": "ぎっしり"
        },
        {
          "optionId": "guruguru",
          "labelJa": "ぐるぐるしている"
        }
      ]
    },
    {
      "fieldId": "hito_kyori",
      "labelJa": "ひととの距離",
      "helperJa": "きょうのちょうどいい距離感",
      "options": [
        {
          "optionId": "chikaku",
          "labelJa": "近くにいたい"
        },
        {
          "optionId": "itsumo_doori",
          "labelJa": "いつも通り"
        },
        {
          "optionId": "sotto",
          "labelJa": "少しそっとしていたい"
        },
        {
          "optionId": "hitori",
          "labelJa": "ひとりの時間がほしい"
        }
      ]
    },
    {
      "fieldId": "kyou_hoshii",
      "labelJa": "きょうほしいもの",
      "helperJa": "いちばん近いものをひとつ",
      "options": [
        {
          "optionId": "yasumi",
          "labelJa": "やすみ"
        },
        {
          "optionId": "seiri",
          "labelJa": "整理する時間"
        },
        {
          "optionId": "kibun_tenkan",
          "labelJa": "気分転換"
        },
        {
          "optionId": "hanasu",
          "labelJa": "だれかと話すこと"
        },
        {
          "optionId": "hitori_jikan",
          "labelJa": "ひとりの時間"
        },
        {
          "optionId": "tassei",
          "labelJa": "小さな達成感"
        }
      ]
    }
  ],
  "privateReflection": {
    "fieldId": "hitokoto_memo",
    "labelJa": "ひとことメモ（任意・非公開）",
    "defaultOff": true,
    "maxLength": 140
  },
  "acknowledgementCascade": [
    {
      "rule": "first_entry_ever",
      "ackId": "ACK_FIRST"
    },
    {
      "rule": "kokoro_tenki == ame",
      "ackId": "ACK_RAIN"
    },
    {
      "rule": "kokoro_tenki == kaze",
      "ackId": "ACK_WIND"
    },
    {
      "rule": "karada_juden == hobo_kara",
      "ackId": "ACK_LOWBATT"
    },
    {
      "rule": "atama_yohaku == guruguru",
      "ackId": "ACK_SWIRL"
    },
    {
      "rule": "kyou_hoshii == yasumi",
      "ackId": "ACK_NEED_YASUMI"
    },
    {
      "rule": "kyou_hoshii == seiri",
      "ackId": "ACK_NEED_SEIRI"
    },
    {
      "rule": "kyou_hoshii == kibun_tenkan",
      "ackId": "ACK_NEED_TENKAN"
    },
    {
      "rule": "kyou_hoshii == hanasu",
      "ackId": "ACK_NEED_HANASU"
    },
    {
      "rule": "kyou_hoshii == hitori_jikan",
      "ackId": "ACK_NEED_HITORI"
    },
    {
      "rule": "kyou_hoshii == tassei",
      "ackId": "ACK_NEED_TASSEI"
    },
    {
      "rule": "kokoro_tenki == hare",
      "ackId": "ACK_SUNNY"
    },
    {
      "rule": "default",
      "ackId": "ACK_NEUTRAL"
    }
  ],
  "acknowledgements": [
    {
      "ackId": "ACK_FIRST",
      "copyJa": "きょうの空模様、はじめの一枚が残りました。ここから少しずつ、じぶんの天気図ができていきます。"
    },
    {
      "ackId": "ACK_RAIN",
      "copyJa": "あめの日の記録も、大事な一枚です。きょうの空模様として、そのまま残りました。"
    },
    {
      "ackId": "ACK_WIND",
      "copyJa": "かぜが強い日。落ち着かないまま記録して大丈夫です。"
    },
    {
      "ackId": "ACK_LOWBATT",
      "copyJa": "充電少なめの日。その状態が、きょうの一枚として残りました。"
    },
    {
      "ackId": "ACK_SWIRL",
      "copyJa": "考えごとがぐるぐるする日。ぐるぐるのまま、ここに置いておけます。"
    },
    {
      "ackId": "ACK_NEED_YASUMI",
      "copyJa": "きょうほしいのは、やすみ。その声が、きょうのいちばんの手がかりです。"
    },
    {
      "ackId": "ACK_NEED_SEIRI",
      "copyJa": "整理する時間がほしい日。その気持ちから、きょうの一枚が残りました。"
    },
    {
      "ackId": "ACK_NEED_TENKAN",
      "copyJa": "気分転換がほしい日。どんな形が合うかは、あなたが決めてよいことです。"
    },
    {
      "ackId": "ACK_NEED_HANASU",
      "copyJa": "だれかと話したい日。その気持ちも、大事な状態のひとつです。"
    },
    {
      "ackId": "ACK_NEED_HITORI",
      "copyJa": "ひとりの時間がほしい日。その距離感も、きょうのあなたの一部です。"
    },
    {
      "ackId": "ACK_NEED_TASSEI",
      "copyJa": "小さな達成感がほしい日。そう選んだことが、きょうの記録です。"
    },
    {
      "ackId": "ACK_SUNNY",
      "copyJa": "はれの日の記録です。あとで見返すときの、目印のひとつになります。"
    },
    {
      "ackId": "ACK_NEUTRAL",
      "copyJa": "きょうの一枚が残りました。それだけで、きょうの記録は完了です。"
    }
  ],
  "sevenDaySummary": {
    "minimumRecordedDays": 3,
    "maxSimultaneousSummaries": 2,
    "priorityOrder": [
      "SUM_RAIN_RUN",
      "SUM_LOWBATT_RUN",
      "SUM_SWIRL_RUN",
      "SUM_NEED_REPEAT",
      "SUM_SUNNY_RUN",
      "SUM_MIXED_WEATHER"
    ],
    "insufficientHistoryCopyJa": "まだ7日分の景色にはなっていません。記録が3日分たまると、ここに様子が出ます。",
    "rules": [
      {
        "summaryId": "SUM_RAIN_RUN",
        "minFieldValid": 3,
        "copyJa": "記録した日の中では、あめの日が多めでした。"
      },
      {
        "summaryId": "SUM_LOWBATT_RUN",
        "minFieldValid": 3,
        "copyJa": "記録した日の中では、充電少なめの日が目立ちました。"
      },
      {
        "summaryId": "SUM_SWIRL_RUN",
        "minFieldValid": 3,
        "copyJa": "記録した日の中では、考えごとの多い日が目立ちました。"
      },
      {
        "summaryId": "SUM_NEED_REPEAT",
        "minFieldValid": 3,
        "copyJa": "記録した日の中でいちばん多かった「ほしいもの」は「{need}」でした。"
      },
      {
        "summaryId": "SUM_SUNNY_RUN",
        "minFieldValid": 4,
        "copyJa": "記録した日の中では、はれの日が多めでした。"
      },
      {
        "summaryId": "SUM_MIXED_WEATHER",
        "minFieldValid": 4,
        "copyJa": "記録した日の天気は、いろいろでした。"
      }
    ]
  },
  "thirtyDaySummary": {
    "minimumRecordedDays": 7,
    "insufficientDataCopyJa": "この30日の眺めは、記録が7日分たまってからです。急がなくて大丈夫です。"
  },
  "reflectionPrompts": [
    {
      "promptId": "RP_1",
      "copyJa": "この一週間の記録で、いちばん「自分らしい」と感じる一枚はどれですか。"
    },
    {
      "promptId": "RP_2",
      "copyJa": "「ほしいもの」に何度か出てきたものがあれば、それはいまの暮らしのどこと関係していそうですか。"
    },
    {
      "promptId": "RP_3",
      "copyJa": "きょうの空模様を、半年後の自分が見たら、どんなひとことを添えると思いますか。"
    }
  ],
  "copy": {
    "version": "daily-copy-v1.1",
    "entryHookJa": "きょうのじぶんを、天気にたとえるなら。",
    "startPageJa": "1分だけ、きょうのわたしを記録します。点数は出ません。記録は非公開が基本です。",
    "progressJa": "のこり少しです",
    "skipJa": "この項目はとばす",
    "exitJa": "とちゅうでやめる（記録は保存されません）",
    "completionJa": "きょうの記録が残りました。",
    "retestJa": "また明日、気が向いたら。",
    "privacyJa": "この記録は非公開が基本です。ほかの利用者に公開されることはなく、内容が共有カードやURLに載ることもありません。記録の保存・処理はプライバシーポリシーにもとづいて行われ、理解への活用にはそのつどの同意が必要です。",
    "shareBoundaryJa": "共有できるのは「記録をつづけていること」だけ。状態の中身は共有カードやURLに載りません。",
    "emptyHistoryJa": "まだ記録はありません。きょうの一枚から始まります。",
    "firstEntryJa": "はじめての記録です。まずは、いまの天気から。",
    "timeline7Ja": "この7日の空模様",
    "timeline30Ja": "この30日の空模様",
    "correctionJa": "きょうの記録をなおす（前の内容は履歴として残ります）",
    "rejectionJa": "きょうの記録を消す",
    "accessibilityLabels": {
      "fieldGroupJa": "きょうの状態の選択肢",
      "optionSelectedJa": "選択中",
      "timelineJa": "日ごとの記録の一覧",
      "memoJa": "自分だけのひとことメモ入力欄"
    }
  },
  "needMapping": [
    {
      "optionId": "yasumi",
      "tag": "need_rest",
      "fitReasonJa": "「やすみ」を選んだ日の状態に、休息系のヒントが対応するため"
    },
    {
      "optionId": "seiri",
      "tag": "need_order",
      "fitReasonJa": "「整理する時間」を選んだ日の状態に、整えごと系のヒントが対応するため"
    },
    {
      "optionId": "kibun_tenkan",
      "tag": "need_change",
      "fitReasonJa": "「気分転換」を選んだ日の状態に、変化・切り替え系のヒントが対応するため"
    },
    {
      "optionId": "hanasu",
      "tag": "need_connect",
      "fitReasonJa": "「だれかと話すこと」を選んだ日の状態に、つながり系のヒントが対応するため"
    },
    {
      "optionId": "hitori_jikan",
      "tag": "need_solo",
      "fitReasonJa": "「ひとりの時間」を選んだ日の状態に、ひとり時間系のヒントが対応するため"
    },
    {
      "optionId": "tassei",
      "tag": "need_small_win",
      "fitReasonJa": "「小さな達成感」を選んだ日の状態に、小さな一歩系のヒントが対応するため"
    }
  ],
  "unansweredNeedBehavior": "no_recommendation",
  "comparisonPolicy": "method_local_timeline_only",
  "understandingPolicy": "method_derived_eligible",
  "understandingNoteJa": "この記録は「いまの状態の文脈」として、本人の同意の範囲でだけ理解に使われます。他のテストの結果と数値で混ぜられることはありません。",
  "confirmationRequired": true,
  "cadence": {
    "type": "daily",
    "streakFree": true,
    "noPenaltyForGaps": true,
    "gapCopyJa": "あいだが空いても、なにも失われません。きょうの一枚からまた始まります。"
  },
  "privacy": {
    "privacyClass": "P5_free_text",
    "privateByDefault": true,
    "notPublishedToOtherUsers": true,
    "nothingInUrlsOrShareCards": true,
    "processingNote": "saved records are processed and stored by the service under the privacy policy; downstream use requires the applicable consent; no absolute-invisibility claim is made"
  },
  "prohibitions": [
    "no score of any kind",
    "no good/bad day ranking",
    "no severity language or severity calculation",
    "no worsening claims",
    "no diagnostic interpretation",
    "no automatic crisis classification or medical inference",
    "no automatic hotline/consultation pointer triggered by daily selections alone (V1 Founder decision 3.2)",
    "no permanent identity statements",
    "no streak pressure"
  ]
} as const;

export type DailyCheckInDefinition = typeof DAILY_CHECK_IN_DEFINITION;
export type DailyFieldId = DailyCheckInDefinition["fields"][number]["fieldId"];
export type DailyAckId = DailyCheckInDefinition["acknowledgements"][number]["ackId"];
