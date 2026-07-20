# MTF-2A — Daily Check-in「きょうの空模様」Complete Copy System (daily-copy-v1.1 / daily-ack-v1.1)

Canonical copy lives in `daily-check-in.v1.json` (`copyBundles`, `stateSchema`, `acknowledgementRules`). This document presents it for editorial review. Every sentence is newly authored for YORISOU.

## Product name & entry

| Surface | Copy |
|---|---|
| 名前 | きょうの空模様 |
| サブタイトル | 1分のじぶん記録 |
| エントリーフック | きょうのじぶんを、天気にたとえるなら。 |
| スタート画面 | 1分だけ、きょうのわたしを記録します。点数は出ません。記録は非公開が基本です。 |
| はじめての記録 | はじめての記録です。まずは、いまの天気から。 |

## State prompts & options

| プロンプト | ヘルパー | 選択肢 |
|---|---|---|
| こころの天気 | いまの気分に近いものをひとつ | はれ・うすぐもり・くもり・あめ・かぜが強い |
| からだの充電 | 元気の残量のイメージで | たっぷり・まあまあ・少なめ・ほぼ空 |
| あたまの余白 | 考えごとの詰まり具合 | すっきり・ふつう・ぎっしり・ぐるぐるしている |
| ひととの距離 | きょうのちょうどいい距離感 | 近くにいたい・いつも通り・少しそっとしていたい・ひとりの時間がほしい |
| きょうほしいもの | いちばん近いものをひとつ | やすみ・整理する時間・気分転換・だれかと話すこと・ひとりの時間・小さな達成感 |
| ひとことメモ（任意） | 自分だけに残る | 自由入力・140字まで・初期設定はオフ |

## Flow copy

進行: 「のこり少しです」 · スキップ: 「この項目はとばす」 · 中断: 「とちゅうでやめる（記録は保存されません）」 · 完了: 「きょうの記録が残りました。」 · 再訪: 「また明日、気が向いたら。」 · 空白期間: 「あいだが空いても、なにも失われません。きょうの一枚からまた始まります。」

## Privacy & share boundary

- プライバシー: 「この記録は非公開が基本です。ほかの利用者に公開されることはなく、内容が共有カードやURLに載ることもありません。保存・処理はプライバシーポリシーにもとづきます。」
- 共有境界: 「共有できるのは『記録をつづけていること』だけ。状態の中身は共有カードやURLに載りません。」

## History & timeline

空の履歴: 「まだ記録はありません。きょうの一枚から始まります。」 · 7日: 「この7日の空模様」 · 30日: 「この30日の空模様」 · 修正: 「きょうの記録をなおす（前の内容は履歴として残ります）」 · 削除: 「きょうの記録を消す」（版管理された訂正モデル：破壊的上書きなし・CPV1履歴ポリシーで旧版保全）

## Acknowledgements (きょうのひとこと — full set, 13 · daily-ack-v1.1, MTF-2A.1 risk-reviewed)

| ackId | 条件 | コピー | 判定 |
|---|---|---|---|
| ACK_FIRST | 初回 | きょうの空模様、はじめの一枚が残りました。ここから少しずつ、じぶんの天気図ができていきます。 | lock_keep |
| ACK_RAIN | 天気=あめ | あめの日の記録も、大事な一枚です。きょうはこのまま、無理のない過ごし方で。 | lock_keep |
| ACK_WIND | 天気=かぜ | かぜが強い日。落ち着かないまま記録して大丈夫です。 | rewrite_required |
| ACK_LOWBATT | 充電=ほぼ空 | 充電少なめの日ですね。記録できただけで、きょうの分はもう十分です。 | lock_keep |
| ACK_SWIRL | 余白=ぐるぐる | 考えごとがぐるぐるする日。ぐるぐるのまま、ここに置いておけます。 | rewrite_required |
| ACK_NEED_YASUMI | ほしいもの=やすみ | きょうほしいのは、やすみ。その声が、きょうのいちばんの手がかりです。 | rewrite_required |
| ACK_NEED_SEIRI | =整理する時間 | 整理する時間がほしい日。その気持ちから、きょうの一枚が残りました。 | rewrite_required |
| ACK_NEED_TENKAN | =気分転換 | 気分転換がほしい日。どんな形が合うかは、あなたが決めてよいことです。 | rewrite_required |
| ACK_NEED_HANASU | =だれかと話す | だれかと話したい日。その気持ちも、大事な状態のひとつです。 | rewrite_required |
| ACK_NEED_HITORI | =ひとりの時間 | ひとりの時間がほしい日。その距離感も、きょうのあなたの一部です。 | polish_candidate |
| ACK_NEED_TASSEI | =小さな達成感 | 小さな達成感がほしい日。そう選んだことが、きょうの記録です。 | rewrite_required |
| ACK_SUNNY | 天気=はれ | はれの日の記録です。あとで見返すときの、目印のひとつになります。 | polish_candidate |
| ACK_NEUTRAL | 既定 | きょうの一枚が残りました。それだけで、きょうの記録は完了です。 | lock_keep |

MTF-2A.1 risk pass: 未来の予測・改善の保証・行動が「効く」示唆・歩行の前提・求められていない助言をすべて除去（keep 4 / polish 2 / rewrite 7 — 判定列参照）。

## Longitudinal copy (daily-longitudinal-v1 — MTF-2A.1 completion)

**7日サマリー** — 最少3日分の記録で作動・同時最大2件・優先順は canonical JSON の priorityOrder・不足時: 「まだ7日分の景色にはなっていません。記録が3日分たまると、ここに様子が出ます。」

| summaryId | 条件 | コピー |
|---|---|---|
| SUM_RAIN_RUN | kokoro_tenki == ame on >=3 recorded days in the last 7 | この7日は、あめの日が多めでした。 |
| SUM_LOWBATT_RUN | karada_juden == hobo_kara on >=3 recorded days | この7日は、充電少なめの日が続きました。 |
| SUM_SWIRL_RUN | atama_yohaku == guruguru on >=3 recorded days | この7日は、考えごとの多い日が目立ちました。 |
| SUM_NEED_REPEAT | the same kyou_hoshii option on >=3 recorded days | この7日、いちばん多かった「ほしいもの」は「{need}」でした。 |
| SUM_SUNNY_RUN | kokoro_tenki == hare on >=4 recorded days | この7日は、はれの日が多めでした。 |
| SUM_MIXED_WEATHER | >=4 distinct kokoro_tenki values across recorded days | この7日は、日ごとに天気の変わる一週間でした。 |

**30日ビュー** — 天気ストリップ（1日1マス、記録なしは空欄＝中立）・最頻「ほしいもの」（同数は「と」で併記、3件未満は非表示）・最少7日分・不足時: 「この30日の眺めは、記録が7日分たまってからです。急がなくて大丈夫です。」・連続記録の称賛/圧力なし。

**リフレクション・プロンプト（3件・週1まで・任意・非公開・自由記述不要）**
- **RP_1**: この一週間の記録で、いちばん「自分らしい」と感じる一枚はどれですか。
- **RP_2**: 「ほしいもの」に何度か出てきたものがあれば、それはいまの暮らしのどこと関係していそうですか。
- **RP_3**: きょうの空模様を、半年後の自分が見たら、どんなひとことを添えると思いますか。

## Accessibility labels

選択肢グループ: 「きょうの状態の選択肢」 · 選択中表示: 「選択中」 · タイムライン: 「日ごとの記録の一覧」 · メモ欄: 「自分だけのひとことメモ入力欄」

## Editorial boundaries honored

現在形・低圧の言葉のみ。禁止領域（良い日/悪い日の順位づけ・深刻度表現・悪化の示唆・診断的解釈・恒久的な人物評・危機/医療トリアージ）はコピー全体に不使用。
