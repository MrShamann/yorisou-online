# MTF-2A — Yorisou Values: Complete V1 Question Bank (values-bank-v1.0 / values-scoring-v1.0)

**Canonical data: `yorisou-values.v1.json` → `questionBank.items` (single source of truth; this table is regenerated from it).** 48 items · A/B forced trade-off · one pair per screen · fixed bank order. **A canonical result requires all 48 answers** (0–47 → `insufficient_coverage`; scoring integrity — every result uses the identical 13/14 exposure structure). Canonical bank hash (sha256): `919f17251a280bb34258f6042db46bb9fd543763b33e041de64c36b305eaa9a6`.

Sensitivity vocabulary: `none` · `work_context` · `relationship_context` · `emotional_context`. MTF-2A.2 blinded answer-attractiveness audit: 46 items keep; **VAL_Q04 and VAL_Q25 rewritten** to remove moral-attractiveness bias (the helping side no longer reads as kinder/more generous; both sides equally legitimate role choices; Q25 remains non-financial and now non-charitable).

| # | Pair | Prompt | A (dim) | B (dim) | Sensitivity |
|---|---|---|---|---|---|
| VAL_Q01 | anshin–pace | 転職や異動を考えるとき、心が向くのは | 長くつづけられそうな安心感 (anshin) | 進め方を自分で決められる裁量 (pace) | work_context |
| VAL_Q02 | anshin–tsunagari | 住む場所を選ぶなら、より重視したいのは | 生活の安定と安心 (anshin) | 大切な人たちとの近さ (tsunagari) | relationship_context |
| VAL_Q03 | anshin–seicho | 新しい役割の打診があったら | いまの確実な役割を大事にしたい (anshin) | 未経験でも伸びそうな方を試したい (seicho) | work_context |
| VAL_Q04 | anshin–yakuwari | 新しい場に入って、最初にしたいのは | 様子をつかんで、足場を固めること (anshin) | できる役割を、引き受けてみること (yakuwari) | none |
| VAL_Q05 | anshin–totonoi | 日曜の夕方にやりたくなるのは | 来週の予定を確かめて安心する (anshin) | 部屋と持ちものをととのえる (totonoi) | none |
| VAL_Q06 | anshin–jikkan | 連休の過ごし方として心地よいのは | 予定を決めて見通しよく過ごす (anshin) | その場で心が動く方へ行く (jikkan) | none |
| VAL_Q07 | pace–tsunagari | 誘いが重なった夜、先に守りたいのは | 自分の予定と自分の時間 (pace) | 会いたい人との時間 (tsunagari) | relationship_context |
| VAL_Q08 | pace–seicho | なにかを学ぶなら、合っているのは | 自分の速度で進められるやり方 (pace) | 少し背伸びが必要な環境 (seicho) | none |
| VAL_Q09 | pace–yakuwari | 頼まれごとが増えてきたとき | 予定を見直して、自分のペースを保つ (pace) | 段取りを組み直して、引き受ける (yakuwari) | none |
| VAL_Q10 | pace–totonoi | 平日の夜に近いのは | 気の向くままに過ごす (pace) | いつものリズムで過ごす (totonoi) | none |
| VAL_Q11 | pace–jikkan | 旅の魅力を選ぶなら | しばられない自由さ (pace) | 心が動く体験 (jikkan) | none |
| VAL_Q12 | tsunagari–seicho | 講座やイベントのあと、好きな時間は | 参加者と話してつながる時間 (tsunagari) | 学んだことをひとりで深める時間 (seicho) | none |
| VAL_Q13 | tsunagari–yakuwari | 友人から相談を受けたら | まず、そばで聞いていたい (tsunagari) | 力になれる方法を探したい (yakuwari) | relationship_context |
| VAL_Q14 | tsunagari–totonoi | 疲れた週の回復のしかたに近いのは | 気の置けない人と過ごす (tsunagari) | ひとりで暮らしをととのえる (totonoi) | none |
| VAL_Q15 | tsunagari–jikkan | 集まりに行くなら惹かれるのは | いつもの気の合う顔ぶれ (tsunagari) | 初めての面白そうな場 (jikkan) | none |
| VAL_Q16 | seicho–yakuwari | 仕事で役割を選べるなら | 新しい力が身につく役割 (seicho) | 人の役に立つ実感がある役割 (yakuwari) | work_context |
| VAL_Q17 | seicho–totonoi | 朝に30分の余白があったら | 学びや練習にあてたい (seicho) | 暮らしをととのえることにあてたい (totonoi) | none |
| VAL_Q18 | seicho–jikkan | 習いごとを選ぶ決め手は | 上達の手応えがあること (seicho) | とにかく楽しいと思えること (jikkan) | none |
| VAL_Q19 | yakuwari–totonoi | 身近な集まりや当番ごとでは | 役割を引き受けて力になりたい (yakuwari) | まず自分の生活の整いを保ちたい (totonoi) | none |
| VAL_Q20 | yakuwari–jikkan | 週末、どちらか一方に行けるなら | 自分が力になれる集まり (yakuwari) | 心が動きそうな集まり (jikkan) | none |
| VAL_Q21 | totonoi–jikkan | 「良い一日だった」と思うのは | 整った、落ち着いた一日 (totonoi) | 心が動いた、あたらしい一日 (jikkan) | none |
| VAL_Q22 | anshin–pace | 大きめの買いものを決めるとき | 納得いくまで自分のペースで選びたい (pace) | 実績や保証のある安心な方にしたい (anshin) | none |
| VAL_Q23 | anshin–tsunagari | 不安なことがあった夜は | 人と話して落ち着きたい (tsunagari) | 調べて見通しを立てて落ち着きたい (anshin) | emotional_context |
| VAL_Q24 | anshin–seicho | これからの理想に近いのは | できることが増えつづけること (seicho) | 足場が揺らがないこと (anshin) | none |
| VAL_Q25 | anshin–yakuwari | 催しや集まりに関わるなら | 運営や手伝いの側で、動きたい (yakuwari) | 参加する側で、見通しよく楽しみたい (anshin) | none |
| VAL_Q26 | anshin–totonoi | 新生活の最初の週にやりたいのは | 部屋と生活リズムをととのえる (totonoi) | 手続きと備えを先に固める (anshin) | none |
| VAL_Q27 | anshin–jikkan | 外食のお店を選ぶなら | 気になっていた新しい店 (jikkan) | 味の分かっている定番の店 (anshin) | none |
| VAL_Q28 | pace–tsunagari | 長い休みの計画は | 大切な人との予定から決める (tsunagari) | まず自分の自由な時間を確保する (pace) | relationship_context |
| VAL_Q29 | pace–seicho | 上達が止まったと感じたら | 負荷を上げて壁を越えたい (seicho) | ペースを落としてでも続けたい (pace) | none |
| VAL_Q30 | pace–yakuwari | チームでの役回りとして選びやすいのは | 頼られる調整役 (yakuwari) | 自分の裁量が保てる役割 (pace) | work_context |
| VAL_Q31 | pace–totonoi | 休日の午前に近いのは | いつもの家事や習慣を先に済ませる (totonoi) | その日の気分で決める (pace) | none |
| VAL_Q32 | pace–jikkan | 面白そうな急な誘いが来たら | 心が動いたら乗る (jikkan) | 自分の予定は崩したくない (pace) | none |
| VAL_Q33 | tsunagari–seicho | 転機のときに頼りにしたいのは | 学んで力をつけること (seicho) | 信頼できる人とのつながり (tsunagari) | none |
| VAL_Q34 | tsunagari–yakuwari | 職場や学校でうれしいのは | 「助かった」と言われること (yakuwari) | 気持ちよく雑談できる関係 (tsunagari) | work_context |
| VAL_Q35 | tsunagari–totonoi | 平日の夜の連絡ごとについて近いのは | 夜のリズムは崩したくない (totonoi) | やりとりの時間を大事にしたい (tsunagari) | relationship_context |
| VAL_Q36 | tsunagari–jikkan | 記憶に残っているのは、どちらの時間 | 初めての体験に飛び込んだ時間 (jikkan) | 大切な人と笑っていた時間 (tsunagari) | relationship_context |
| VAL_Q37 | seicho–yakuwari | 新しく時間を使うなら | 人をサポートする側の活動 (yakuwari) | 自分が学ぶ側の活動 (seicho) | none |
| VAL_Q38 | seicho–totonoi | 平日の夜、自由な1時間があったら | 部屋やあすの段取りをととのえる (totonoi) | 気になっていた学びを進める (seicho) | none |
| VAL_Q39 | seicho–jikkan | 続いている趣味の、続いている理由は | 単純に楽しいから (jikkan) | 上達の手応えがあるから (seicho) | none |
| VAL_Q40 | yakuwari–totonoi | 予定の詰まった週に、新しい頼まれごとが来たら | 「来週なら」と時期を提案する (totonoi) | 予定を組み替えて応じる (yakuwari) | none |
| VAL_Q41 | yakuwari–jikkan | 満たされた気持ちになるのは | 心が動く体験をしたとき (jikkan) | 誰かの役に立てたとき (yakuwari) | none |
| VAL_Q42 | totonoi–jikkan | 部屋に手を入れるなら | 心が動く遊び心を足したい (jikkan) | 使いやすくととのえたい (totonoi) | none |
| VAL_Q43 | anshin–seicho | 資格やスキルの勉強を始めるなら、動機に近いのは | 先々の安心につながるから (anshin) | できることを増やしたいから (seicho) | none |
| VAL_Q44 | pace–totonoi | 暮らしの理想に近いのは | よい習慣が決まってまわっている (totonoi) | その時々で自由に組み替えられる (pace) | none |
| VAL_Q45 | tsunagari–jikkan | 週末に出かけるなら | いつもの人と、ゆっくり深く (tsunagari) | 面白そうなら知らない場でも (jikkan) | relationship_context |
| VAL_Q46 | seicho–yakuwari | 人に教える立場になったら、うれしいのは | 相手の力になれていること (yakuwari) | 教えることで自分も伸びること (seicho) | none |
| VAL_Q47 | anshin–tsunagari | 大きな決断の前にしたいのは | 信頼する人に相談する (tsunagari) | 情報を集めて見通しを固める (anshin) | emotional_context |
| VAL_Q48 | totonoi–jikkan | 理想の平日の夜に近いのは | 整った部屋で静かに過ごす (totonoi) | 予定外の楽しいことが起きる (jikkan) | none |

## Design rules honored

- **Side balance:** paired repeats flip A/B; per-dimension A-side exposure 43–57% (validator tolerance 40–60%); third-pass items audited.
- **Blinded attractiveness audit (MTF-2A.2):** each side assessed without its dimension label for kinder/healthier/more-responsible/more-generous/selfish/fearful/lazy readings — Q04/Q25 rewritten; all other items keep (both options comparably legitimate).
- **Not alignable item-by-item with any external instrument.**
