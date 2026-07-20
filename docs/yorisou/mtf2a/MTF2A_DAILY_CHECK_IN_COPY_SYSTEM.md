# MTF-2A — Daily Check-in「きょうの空模様」Complete Copy System (daily-copy-v1.1 / daily-ack-v1.2)

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

- プライバシー: 「この記録は非公開が基本です。ほかの利用者に公開されることはなく、内容が共有カードやURLに載ることもありません。記録の保存・処理はプライバシーポリシーにもとづいて行われ、理解への活用にはそのつどの同意が必要です。」（canonical `privacyJa` 全文 — 非公開が基本／他利用者非公開／共有カード・URL不掲載／保存・処理はポリシー準拠／理解への活用は同意制。絶対的な不可視の主張は行わない。）
- 共有境界: 「共有できるのは『記録をつづけていること』だけ。状態の中身は共有カードやURLに載りません。」

## History & timeline

空の履歴: 「まだ記録はありません。きょうの一枚から始まります。」 · 7日: 「この7日の空模様」 · 30日: 「この30日の空模様」 · 修正: 「きょうの記録をなおす（前の内容は履歴として残ります）」 · 削除: 「きょうの記録を消す」（版管理された訂正モデル：破壊的上書きなし・CPV1履歴ポリシーで旧版保全）

## Acknowledgements (きょうのひとこと — full set, 13 · daily-ack-v1.2)

| ackId | 条件 | コピー | 判定 |
|---|---|---|---|
| ACK_FIRST | 初回 | きょうの空模様、はじめの一枚が残りました。ここから少しずつ、じぶんの天気図ができていきます。 | lock_keep |
| ACK_RAIN | 天気=あめ | あめの日の記録も、大事な一枚です。きょうの空模様として、そのまま残りました。 | rewrite_required |
| ACK_WIND | 天気=かぜ | かぜが強い日。落ち着かないまま記録して大丈夫です。 | rewrite_required |
| ACK_LOWBATT | 充電=ほぼ空 | 充電少なめの日。その状態が、きょうの一枚として残りました。 | rewrite_required |
| ACK_SWIRL | 余白=ぐるぐる | 考えごとがぐるぐるする日。ぐるぐるのまま、ここに置いておけます。 | rewrite_required |
| ACK_NEED_YASUMI | ほしいもの=やすみ | きょうほしいのは、やすみ。その声が、きょうのいちばんの手がかりです。 | rewrite_required |
| ACK_NEED_SEIRI | =整理する時間 | 整理する時間がほしい日。その気持ちから、きょうの一枚が残りました。 | rewrite_required |
| ACK_NEED_TENKAN | =気分転換 | 気分転換がほしい日。どんな形が合うかは、あなたが決めてよいことです。 | rewrite_required |
| ACK_NEED_HANASU | =だれかと話す | だれかと話したい日。その気持ちも、大事な状態のひとつです。 | rewrite_required |
| ACK_NEED_HITORI | =ひとりの時間 | ひとりの時間がほしい日。その距離感も、きょうのあなたの一部です。 | polish_candidate |
| ACK_NEED_TASSEI | =小さな達成感 | 小さな達成感がほしい日。そう選んだことが、きょうの記録です。 | rewrite_required |
| ACK_SUNNY | 天気=はれ | はれの日の記録です。あとで見返すときの、目印のひとつになります。 | polish_candidate |
| ACK_NEUTRAL | 既定 | きょうの一枚が残りました。それだけで、きょうの記録は完了です。 | lock_keep |

MTF-2A.2 second risk pass: ACK_RAIN（過ごし方の助言を除去）・ACK_LOWBATT（「もう十分」という評価を除去）を再訂正。全13件は観察のみ・非予測・非指示・移動前提なし・非臨床。

## Longitudinal copy (daily-longitudinal-v1 · MTF-2A.2 field-valid denominators)

**7日サマリー** — 分母は「その項目に回答した記録日」のみ（field-valid）。未記録日・未回答項目は中立で、既知の状態として扱わない。最少観測数は各ルールに明記・同時最大2件・不足時: 「まだ7日分の景色にはなっていません。記録が3日分たまると、ここに様子が出ます。」

| summaryId | 条件 | コピー |
|---|---|---|
| SUM_RAIN_RUN | kokoro_tenki == ame on >=3 of the days where kokoro_tenki was answered (min 3 field-valid observations) | 記録した日の中では、あめの日が多めでした。 |
| SUM_LOWBATT_RUN | karada_juden == hobo_kara on >=3 field-valid days | 記録した日の中では、充電少なめの日が目立ちました。 |
| SUM_SWIRL_RUN | atama_yohaku == guruguru on >=3 field-valid days | 記録した日の中では、考えごとの多い日が目立ちました。 |
| SUM_NEED_REPEAT | the same kyou_hoshii option on >=3 of the days where kyou_hoshii was answered | 記録した日の中でいちばん多かった「ほしいもの」は「{need}」でした。 |
| SUM_SUNNY_RUN | kokoro_tenki == hare on >=4 field-valid days | 記録した日の中では、はれの日が多めでした。 |
| SUM_MIXED_WEATHER | >=4 distinct kokoro_tenki values among field-valid days (min 4 observations) | 記録した日の天気は、いろいろでした。 |

**30日ビュー** — 天気ストリップ（回答した天気だけ描画、空欄は中立）・最頻「ほしいもの」は kyou_hoshii 回答日のみを分母に（同数は「と」併記、3件未満は非表示）・不足時: 「この30日の眺めは、記録が7日分たまってからです。急がなくて大丈夫です。」・連続記録の称賛/圧力なし。

**リフレクション・プロンプト（3件・週1まで・任意・非公開・自由記述不要）**
- **RP_1**: この一週間の記録で、いちばん「自分らしい」と感じる一枚はどれですか。
- **RP_2**: 「ほしいもの」に何度か出てきたものがあれば、それはいまの暮らしのどこと関係していそうですか。
- **RP_3**: きょうの空模様を、半年後の自分が見たら、どんなひとことを添えると思いますか。

## Accessibility labels

選択肢グループ: 「きょうの状態の選択肢」 · 選択中表示: 「選択中」 · タイムライン: 「日ごとの記録の一覧」 · メモ欄: 「自分だけのひとことメモ入力欄」

## Editorial boundaries honored

現在形・低圧の言葉のみ。禁止領域（良い日/悪い日の順位づけ・深刻度表現・悪化の示唆・診断的解釈・恒久的な人物評・危機/医療トリアージ）はコピー全体に不使用。
