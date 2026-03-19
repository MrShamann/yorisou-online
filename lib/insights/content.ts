import type { InsightSeed } from "@/lib/insights/types";

export const insightSeeds: InsightSeed[] = [
  {
    slug: "japan-aging-mobility-gap",
    sourceName: "国土交通分野の公開資料",
    sourceUrl: "https://www.mlit.go.jp/",
    publishedAt: "2025-10-08",
    category: "aging-society",
    region: "japan",
    tags: ["高齢社会", "移動格差", "日常移動"],
    content: {
      ja: {
        title: "高齢社会で広がる日常移動の負担を、地域の設計課題として見る",
        summary:
          "高齢化が進む地域では、買い物や通院のような短距離移動が生活継続の前提になっています。一方で、既存交通だけでは埋めきれない小さな移動の空白が目立ちやすくなっています。",
        whyItMatters:
          "高齢社会の移動課題は、単なる乗り物不足ではなく、生活導線そのものの設計課題です。本人だけでなく家族や地域支援側の負担にも直結します。",
        yorisouView: [
          "Yorisouは、この変化を『移動手段の追加』ではなく『暮らしに沿った移動導線の再設計』として捉えています。",
          "日本では徒歩圏の縮小がそのまま生活の選択肢の縮小につながるため、近距離移動を無理なく支える仕組みが重要です。",
          "ご本人・ご家族・地域関係者は、車両性能だけでなく、保管、試乗、付き添い負担、地域ルールまで一体で見る必要があります。",
        ],
        practicalTakeaways: [
          "検討初期から『どこへ、週に何回、誰の支援で移動するか』を整理する。",
          "通院と買い物のように用途が複数ある場合は、1台でどこまで対応できるかを確認する。",
          "相談時には、本人の歩行状況だけでなく家族の送迎・見守り負担も共有する。",
        ],
        whatThisMeans: {
          seniors: "近い距離でも移動しにくさを感じるなら、早めに選択肢を持つことが生活維持につながります。",
          families: "移動支援の負担が固定化する前に、本人に合う補助手段を比較することが重要です。",
          localCommunities: "移動課題を個人問題ではなく地域導線の課題として捉える視点が求められます。",
          operators: "短距離・低速・高頻度の利用実態を踏まえた設計が実装の鍵になります。",
        },
      },
      en: {
        title: "Viewing mobility strain in an aging society as a community design issue",
        summary:
          "As communities age, short local trips for shopping or clinic visits become central to daily life. Conventional transport alone often leaves a gap around these small but essential movements.",
        whyItMatters:
          "This is not only a vehicle shortage issue. It is a question of how daily living routes are designed, and it affects users, families, and local support networks together.",
        yorisouView: [
          "Yorisou sees this not as simply adding another vehicle, but as redesigning mobility around real daily routines.",
          "In Japan, when comfortable walking range shrinks, available life choices also shrink, so near-distance mobility support becomes especially important.",
          "Users, families, and local partners should review storage, trial use, caregiving burden, and local rules alongside product features.",
        ],
        practicalTakeaways: [
          "Clarify where the user needs to go, how often, and with whose support.",
          "If use cases are mixed, check how far one solution can realistically cover them.",
          "Discuss walking condition together with family accompaniment and monitoring burden.",
        ],
        whatThisMeans: {
          seniors: "If even nearby trips feel heavy, having an option early can help preserve daily independence.",
          families: "Compare support options before mobility assistance becomes a fixed family burden.",
          localCommunities: "Mobility should be treated as part of community route design, not only as an individual issue.",
          operators: "Implementation works best when it reflects low-speed, short-range, high-frequency usage patterns.",
        },
      },
    },
  },
  {
    slug: "community-transport-pilot-lessons",
    sourceName: "地域交通に関する公開議論",
    sourceUrl: "https://www.soumu.go.jp/",
    publishedAt: "2025-09-14",
    category: "community-transport",
    region: "local-community",
    tags: ["地域交通", "実証", "コミュニティ"],
    content: {
      ja: {
        title: "地域交通の実証で見落としやすいのは、車両より運用の継続性",
        summary:
          "地域交通の実証では、導入時の話題性よりも、誰が案内し、誰が管理し、どう安全に回すかという運用面が成果を左右します。",
        whyItMatters:
          "高齢者向けモビリティは、乗れること以上に『続けて使えること』が重要です。地域導入では保守・説明・記録の仕組みが欠かせません。",
        yorisouView: [
          "Yorisouは、地域導入の成否は車両単体よりも現場運用の設計に左右されると考えています。",
          "日本の地域交通では、導入主体が複数にまたがることが多く、役割分担が曖昧なまま始めると継続が難しくなります。",
          "自治体、施設、地域団体、協力事業者は、初期の責任分担を明確にしてから小規模に始めるのが現実的です。",
        ],
        practicalTakeaways: [
          "試乗会や導入前説明を、単発イベントではなく運用確認の場として設計する。",
          "安全確認、保管、予約、問い合わせ窓口の担当者を決めておく。",
          "実証では利用者数だけでなく、付き添い負担や現場対応工数も記録する。",
        ],
        whatThisMeans: {
          seniors: "地域で導入される場合でも、日々の使いやすさや相談先の分かりやすさが大切です。",
          families: "使い始めた後に困ったとき、誰へ相談できるかを事前に確認しておくと安心です。",
          localCommunities: "実証の目的を共有し、運用役割を小さく切り分けることが継続につながります。",
          operators: "機体導入だけでなく、窓口・点検・記録まで含めた運用設計が必要です。",
        },
      },
      en: {
        title: "In community transport pilots, continuity matters more than the vehicle alone",
        summary:
          "In local transport pilots, long-term operation often matters more than launch visibility. Results depend on who explains the service, who manages it, and how safely it is run.",
        whyItMatters:
          "For senior-friendly mobility, it is not enough that a vehicle can be used once. It needs to remain usable in a stable, understandable way over time.",
        yorisouView: [
          "Yorisou believes community deployment succeeds or fails more on field operations than on the vehicle itself.",
          "In Japan, local mobility initiatives often involve several stakeholders, and vague responsibility splits quickly weaken continuity.",
          "A small and well-defined pilot is usually more realistic than a broad launch without role clarity.",
        ],
        practicalTakeaways: [
          "Treat trial events as operational checks, not only promotional moments.",
          "Decide who handles safety checks, storage, booking, and user questions.",
          "Record caregiver burden and field workload in addition to user counts.",
        ],
        whatThisMeans: {
          seniors: "Even in community-led programs, clarity around daily use and support contacts matters.",
          families: "It is reassuring to know in advance who to contact if use becomes difficult.",
          localCommunities: "Shared pilot goals and small, clear operating roles improve continuity.",
          operators: "Vehicle deployment should be packaged with support desk, inspection, and logging design.",
        },
      },
    },
  },
  {
    slug: "senior-mobility-family-reassurance",
    sourceName: "介護・福祉分野の公開資料",
    sourceUrl: "https://www.mhlw.go.jp/",
    publishedAt: "2025-08-22",
    category: "senior-mobility",
    region: "japan",
    tags: ["家族安心", "シニアモビリティ", "試乗"],
    content: {
      ja: {
        title: "シニアモビリティ選びで家族が重視するのは、本人の安心感と説明のしやすさ",
        summary:
          "モビリティ導入の検討では、ご本人の操作性に加え、ご家族が納得できる安全説明や試乗確認のしやすさが意思決定に大きく影響します。",
        whyItMatters:
          "高齢者向けモビリティは、利用者本人だけでなく家族の心理的安心が導入可否を左右します。説明負担を減らす設計が重要です。",
        yorisouView: [
          "Yorisouは、ご本人の乗りやすさと同じくらい、ご家族が理解しやすい相談体験を大切にしています。",
          "日本では家族が比較検討や相談窓口の役割を担う場面が多いため、分かりやすい案内と段階的な確認が必要です。",
          "操作、速度、保管、トラブル時の連絡先を落ち着いて整理できることが、長く使える導入につながります。",
        ],
        practicalTakeaways: [
          "試乗時は本人の感想だけでなく、家族が気になった点も記録する。",
          "購入前に、操作説明を誰が一緒に聞くかを決めておく。",
          "比較表では価格だけでなく、収納、乗降、相談体制も並べて見る。",
        ],
        whatThisMeans: {
          seniors: "使い始めた後に不安を残さないため、遠慮なく操作確認を重ねることが大切です。",
          families: "説明の分かりやすさや相談のしやすさは、継続利用の安心に直結します。",
          localCommunities: "家族同席の相談機会を設けることで、地域導入後の摩擦を減らしやすくなります。",
          operators: "利用者体験だけでなく家族向け説明導線まで含めた提案が求められます。",
        },
      },
      en: {
        title: "When choosing senior mobility, families value reassurance and clear explanation",
        summary:
          "In mobility selection, decision-making is shaped not only by usability for the senior user, but also by how clearly safety, storage, and trial steps can be explained to family members.",
        whyItMatters:
          "Family reassurance often determines whether adoption moves forward. Reducing explanation burden is part of a good mobility experience.",
        yorisouView: [
          "Yorisou places strong value on a consultation experience that is understandable for families as well as comfortable for the user.",
          "In Japan, family members often play the role of comparer, coordinator, and follow-up contact, so staged explanation is essential.",
          "Clear discussion around controls, speed, storage, and support contacts leads to more sustainable adoption.",
        ],
        practicalTakeaways: [
          "Capture family concerns alongside the user’s own trial impressions.",
          "Decide who should attend the operation explanation before purchase or trial.",
          "Compare not only price, but also storage, boarding ease, and support setup.",
        ],
        whatThisMeans: {
          seniors: "Repeated, calm confirmation of controls helps reduce anxiety after adoption.",
          families: "Ease of explanation and consultation directly supports long-term confidence.",
          localCommunities: "Family-inclusive consultations can reduce friction after local deployment.",
          operators: "Proposal quality improves when family communication is designed into the process.",
        },
      },
    },
  },
  {
    slug: "welfare-mobility-last-mile-practicality",
    sourceName: "福祉移動に関する公開情報",
    sourceUrl: "https://www8.cao.go.jp/kourei/",
    publishedAt: "2025-07-03",
    category: "welfare-mobility",
    region: "japan",
    tags: ["福祉移動", "ラストマイル", "実務"],
    content: {
      ja: {
        title: "福祉移動で重要なのは、ラストマイルを実務的に埋める視点",
        summary:
          "福祉・介護の現場では、目的地までの大枠移動よりも、玄関から受付までの短い区間に負担が集中することがあります。",
        whyItMatters:
          "この小さな移動の負担は見落とされやすい一方、本人の疲労や付き添い時間に大きく影響します。福祉移動では実務的な近距離支援が重要です。",
        yorisouView: [
          "Yorisouは、ラストマイルを『最後の少し』ではなく、利用継続を左右する重要区間と考えています。",
          "日本の高齢社会では、施設敷地内、病院構内、商業施設周辺などの移動が想像以上に負担になりやすい傾向があります。",
          "そのため、速度や航続距離だけでなく、停止のしやすさ、取り回し、付き添い時の安心感を重視すべきです。",
        ],
        practicalTakeaways: [
          "病院や施設では、建物の入口から目的地点までの実距離を確認する。",
          "小回りと安定感のどちらを優先するかを利用場面ごとに整理する。",
          "付き添い者がいる場合は、並走や待機のしやすさも比較ポイントに含める。",
        ],
        whatThisMeans: {
          seniors: "短い距離でも疲れやすい場面があるなら、実際の導線で確認することが大切です。",
          families: "送迎の有無だけでなく、降車後の移動負担まで見ておくと判断しやすくなります。",
          localCommunities: "施設や病院の周辺導線を含めた支援設計が必要です。",
          operators: "近距離・狭域での運用性を訴求できる設計と説明が有効です。",
        },
      },
      en: {
        title: "In welfare mobility, practical last-mile coverage matters most",
        summary:
          "In welfare and care settings, the burden often concentrates not on the full trip, but on the short distance from entrance to reception or from parking to destination.",
        whyItMatters:
          "This small stretch is easy to overlook, yet it strongly affects fatigue, accompaniment time, and continued use.",
        yorisouView: [
          "Yorisou treats the last mile not as a minor final step, but as a decisive part of sustainable use.",
          "In Japan’s aging society, movement inside hospital grounds, facility premises, and shopping areas can be more demanding than expected.",
          "That is why turning ease, stopping control, and reassurance during accompaniment matter alongside speed or range.",
        ],
        practicalTakeaways: [
          "Measure the real walking distance inside hospitals or facilities.",
          "Clarify whether turning ease or stability matters more in each setting.",
          "If someone accompanies the user, compare side-by-side movement and waiting practicality too.",
        ],
        whatThisMeans: {
          seniors: "If short stretches feel tiring, check the route in the real environment before deciding.",
          families: "Review post-drop-off movement burden, not only the car trip itself.",
          localCommunities: "Support design should include hospital and facility surroundings.",
          operators: "Messaging should reflect usability in narrow, short-range operating environments.",
        },
      },
    },
  },
  {
    slug: "micro-mobility-local-fit-japan",
    sourceName: "地域モビリティ関連の公開論点",
    sourceUrl: "https://www.meti.go.jp/",
    publishedAt: "2025-06-11",
    category: "micro-mobility",
    region: "kyushu",
    tags: ["マイクロモビリティ", "地域適合", "九州"],
    content: {
      ja: {
        title: "マイクロモビリティは、地域に合う形で使い分ける時代へ",
        summary:
          "マイクロモビリティへの関心は高い一方で、地域の道路環境、生活導線、利用者層に合わない導入は定着しにくい傾向があります。",
        whyItMatters:
          "日本の地域交通では『導入できるか』より『定着するか』が重要です。高齢者向けでは特に、地域との相性確認が必要になります。",
        yorisouView: [
          "Yorisouは、マイクロモビリティを一律に勧めるのではなく、地域条件に合わせて役割を整理するべきだと考えています。",
          "坂道、歩道幅、保管場所、交差点の多さなど、日本の地域特性は導入判断に大きく影響します。",
          "そのため、車種の比較だけでなく、どの導線にどの手段が適しているかを実地で見極めることが重要です。",
        ],
        practicalTakeaways: [
          "利用予定エリアの坂道、段差、道路幅を事前に見ておく。",
          "屋外中心か施設周辺中心かで候補カテゴリーを分けて考える。",
          "実証や試乗では、平坦路だけでなく実際の生活導線でも確認する。",
        ],
        whatThisMeans: {
          seniors: "使いやすさは車両単体より、普段の道との相性で変わります。",
          families: "カタログ比較だけで決めず、実際の行き先に合わせて見ることが重要です。",
          localCommunities: "地域条件に合わせた役割分担が、導入後の受容性を高めます。",
          operators: "提案時には道路環境と利用者導線の確認を標準化するべきです。",
        },
      },
      en: {
        title: "Micro mobility works best when matched carefully to local conditions",
        summary:
          "Interest in micro mobility is high, but adoption tends to stall when vehicles do not match local roads, daily routes, or user demographics.",
        whyItMatters:
          "In Japanese local mobility, the real question is not whether a vehicle can be introduced, but whether it will settle into everyday use.",
        yorisouView: [
          "Yorisou does not treat micro mobility as a one-size-fits-all answer. Its role should be defined by local conditions.",
          "Slopes, sidewalk width, storage conditions, and intersection density all shape what is realistic in Japan.",
          "That is why route fit should be reviewed in the field, not only through catalog comparison.",
        ],
        practicalTakeaways: [
          "Check slopes, curbs, and road width in the expected use area.",
          "Separate candidates by outdoor-heavy routes versus facility-area use.",
          "Use real-life routes, not only flat test courses, during pilots and trials.",
        ],
        whatThisMeans: {
          seniors: "Ease of use depends on your everyday route as much as on the vehicle itself.",
          families: "Real destinations matter more than catalog comparison alone.",
          localCommunities: "Role clarity by local condition improves post-launch acceptance.",
          operators: "Road environment and route review should be standard in proposals.",
        },
      },
    },
  },
];
