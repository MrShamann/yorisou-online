export const currentStateCheckV1 = {
  testId: "current_state_check_v1",
  testName: "今の状態チェック",
  estimatedMinutes: 6,
  dimensions: [
    {
      id: "pace",
      displayName: "進み方のペース",
    },
    {
      id: "clarity",
      displayName: "頭のまとまり",
    },
    {
      id: "openness",
      displayName: "人や外への開き方",
    },
    {
      id: "recovery_need",
      displayName: "整え直しの必要度",
    },
  ],
  questions: [
    {
      id: "csq01",
      prompt: "朝、最初にやることを思い浮かべたときの自分に近いのはどれですか。",
      options: [
        {
          id: "a",
          label: "そのまま動き出せそう",
          scores: { pace: 2, clarity: 1, openness: 0, recovery_need: 0 },
          tags: ["rhythm_fast", "start_ready"],
        },
        {
          id: "b",
          label: "順番が見えれば入りやすい",
          scores: { pace: 1, clarity: 2, openness: 0, recovery_need: 0 },
          tags: ["need_structure", "calm_start"],
        },
        {
          id: "c",
          label: "何から始めるか決めるのに少し止まる",
          scores: { pace: 0, clarity: 2, openness: 0, recovery_need: 1 },
          tags: ["decision_stall", "need_clarity"],
        },
        {
          id: "d",
          label: "まず静かに整える時間がほしい",
          scores: { pace: 0, clarity: 0, openness: 0, recovery_need: 2 },
          tags: ["need_rest", "quiet_entry"],
        },
      ],
      sensitivity: "low",
    },
    {
      id: "csq02",
      prompt: "小さな予定変更が入ったとき、今の自分に近い反応はどれですか。",
      options: [
        {
          id: "a",
          label: "すぐ切り替えられる",
          scores: { pace: 2, clarity: 1, openness: 0, recovery_need: 0 },
          tags: ["flexible", "rhythm_fast"],
        },
        {
          id: "b",
          label: "少し確認できれば大丈夫",
          scores: { pace: 1, clarity: 2, openness: 0, recovery_need: 0 },
          tags: ["structured_shift", "calm_adjustment"],
        },
        {
          id: "c",
          label: "流れが崩れた感じがしばらく残る",
          scores: { pace: 0, clarity: 2, openness: 0, recovery_need: 1 },
          tags: ["disrupted_flow", "need_reset"],
        },
        {
          id: "d",
          label: "それだけで少し負担に感じやすい",
          scores: { pace: 0, clarity: 0, openness: 0, recovery_need: 2 },
          tags: ["change_fatigue", "overload"],
        },
      ],
      sensitivity: "medium",
    },
    {
      id: "csq03",
      prompt: "返事がまだ来ていない連絡があるとき、今の自分に近いのはどれですか。",
      options: [
        {
          id: "a",
          label: "あまり気にせず別のことに移れる",
          scores: { pace: 1, clarity: 1, openness: 1, recovery_need: 0 },
          tags: ["stable_wait", "light_social_load"],
        },
        {
          id: "b",
          label: "少し気になるけれど待てる",
          scores: { pace: 0, clarity: 2, openness: 1, recovery_need: 0 },
          tags: ["measured_wait", "social_awareness"],
        },
        {
          id: "c",
          label: "理由を考えてしまい、頭に残りやすい",
          scores: { pace: 0, clarity: 2, openness: 0, recovery_need: 1 },
          tags: ["overthinking_reply", "need_reassurance"],
        },
        {
          id: "d",
          label: "返事のことが少し気に残りやすい",
          scores: { pace: 0, clarity: 0, openness: 0, recovery_need: 2 },
          tags: ["reply_residue", "social_drain"],
        },
      ],
      sensitivity: "medium",
    },
    {
      id: "csq04",
      prompt: "人に合わせたあと、自分の戻り方に近いのはどれですか。",
      options: [
        {
          id: "a",
          label: "そのまま次のことにも行きやすい",
          scores: { pace: 2, clarity: 0, openness: 2, recovery_need: 0 },
          tags: ["social_afterglow", "open_energy"],
        },
        {
          id: "b",
          label: "少しひと息つけば戻れる",
          scores: { pace: 1, clarity: 0, openness: 1, recovery_need: 1 },
          tags: ["balanced_social", "short_reset"],
        },
        {
          id: "c",
          label: "思ったより疲れが残りやすい",
          scores: { pace: 0, clarity: 0, openness: 0, recovery_need: 2 },
          tags: ["post_social_fatigue", "need_recovery"],
        },
        {
          id: "d",
          label: "あとから少し引きずりやすい",
          scores: { pace: 0, clarity: 1, openness: 0, recovery_need: 2 },
          tags: ["social_echo", "mental_drain"],
        },
      ],
      sensitivity: "medium",
    },
    {
      id: "csq05",
      prompt: "ひとり時間ができたとき、今の自分に近い感覚はどれですか。",
      options: [
        {
          id: "a",
          label: "そのまま前に進む力に変えやすい",
          scores: { pace: 2, clarity: 1, openness: 0, recovery_need: 0 },
          tags: ["solo_focus", "forward_energy"],
        },
        {
          id: "b",
          label: "頭の中を整えるのにちょうどよい",
          scores: { pace: 0, clarity: 2, openness: 0, recovery_need: 1 },
          tags: ["solo_sorting", "need_clarity"],
        },
        {
          id: "c",
          label: "ほっとするけれど少し止まりやすい",
          scores: { pace: 0, clarity: 1, openness: 0, recovery_need: 2 },
          tags: ["quiet_relief", "slow_mode"],
        },
        {
          id: "d",
          label: "今はそれがいちばん必要に感じる",
          scores: { pace: 0, clarity: 0, openness: 0, recovery_need: 2 },
          tags: ["deep_alone_time", "recovery_priority"],
        },
      ],
      sensitivity: "low",
    },
    {
      id: "csq06",
      prompt: "SNSや情報が多い画面を見たあと、近い感覚はどれですか。",
      options: [
        {
          id: "a",
          label: "必要なものだけ拾って動ける",
          scores: { pace: 1, clarity: 2, openness: 1, recovery_need: 0 },
          tags: ["filtering_ok", "clarity_keep"],
        },
        {
          id: "b",
          label: "少し散るが切り替えられる",
          scores: { pace: 1, clarity: 1, openness: 1, recovery_need: 1 },
          tags: ["mild_overload", "recoverable"],
        },
        {
          id: "c",
          label: "何となく頭が混み合いやすい",
          scores: { pace: 0, clarity: 2, openness: 0, recovery_need: 1 },
          tags: ["info_clutter", "need_clear_space"],
        },
        {
          id: "d",
          label: "見たあとに少し散りやすい",
          scores: { pace: 0, clarity: 0, openness: 0, recovery_need: 2 },
          tags: ["info_residue", "stimulus_overload"],
        },
      ],
      sensitivity: "low",
    },
    {
      id: "csq07",
      prompt: "今日の作業や学びに入るとき、近い入り方はどれですか。",
      options: [
        {
          id: "a",
          label: "まず動きながら形にしたい",
          scores: { pace: 2, clarity: 0, openness: 0, recovery_need: 0 },
          tags: ["move_first", "fast_entry"],
        },
        {
          id: "b",
          label: "小さく区切ると入りやすい",
          scores: { pace: 1, clarity: 2, openness: 0, recovery_need: 0 },
          tags: ["chunking", "structured_focus"],
        },
        {
          id: "c",
          label: "気になることが多くて入りにくい",
          scores: { pace: 0, clarity: 2, openness: 0, recovery_need: 1 },
          tags: ["scattered_start", "need_clarity"],
        },
        {
          id: "d",
          label: "今日は入る前に整え直しが必要",
          scores: { pace: 0, clarity: 0, openness: 0, recovery_need: 2 },
          tags: ["restart_needed", "recovery_first"],
        },
      ],
      sensitivity: "low",
    },
    {
      id: "csq08",
      prompt: "ひとつのことから別のことへ切り替えるとき、近いのはどれですか。",
      options: [
        {
          id: "a",
          label: "勢いのまま切り替えやすい",
          scores: { pace: 2, clarity: 1, openness: 0, recovery_need: 0 },
          tags: ["quick_switch", "fast_pace"],
        },
        {
          id: "b",
          label: "区切りがあると切り替えやすい",
          scores: { pace: 1, clarity: 2, openness: 0, recovery_need: 0 },
          tags: ["structured_switch", "clear_transition"],
        },
        {
          id: "c",
          label: "前のことが少し残りやすい",
          scores: { pace: 0, clarity: 1, openness: 0, recovery_need: 1 },
          tags: ["carryover", "slow_transition"],
        },
        {
          id: "d",
          label: "切り替えるたびに少し削られる感じがある",
          scores: { pace: 0, clarity: 0, openness: 0, recovery_need: 2 },
          tags: ["switch_drain", "overload"],
        },
      ],
      sensitivity: "medium",
    },
    {
      id: "csq09",
      prompt: "誰かから軽い相談を受けたとき、今の自分に近いのはどれですか。",
      options: [
        {
          id: "a",
          label: "自然に受け止めやすい",
          scores: { pace: 0, clarity: 0, openness: 2, recovery_need: 0 },
          tags: ["open_support", "social_room"],
        },
        {
          id: "b",
          label: "内容しだいで受け止められる",
          scores: { pace: 0, clarity: 1, openness: 1, recovery_need: 0 },
          tags: ["selective_open", "balanced_social"],
        },
        {
          id: "c",
          label: "少し距離をとって聞きたくなる",
          scores: { pace: 0, clarity: 0, openness: 1, recovery_need: 1 },
          tags: ["boundary_needed", "social_care"],
        },
        {
          id: "d",
          label: "今は自分のゆとりを守りたい気持ちが強い",
          scores: { pace: 0, clarity: 0, openness: 0, recovery_need: 2 },
          tags: ["protective_boundary", "recovery_priority"],
        },
      ],
      sensitivity: "medium",
    },
    {
      id: "csq10",
      prompt: "今日は、人との距離感をどう扱いやすそうですか。",
      options: [
        {
          id: "a",
          label: "少し広げても大丈夫そう",
          scores: { pace: 0, clarity: 0, openness: 2, recovery_need: 0 },
          tags: ["social_expansion", "open_mode"],
        },
        {
          id: "b",
          label: "必要な分だけ関われればよい",
          scores: { pace: 0, clarity: 1, openness: 1, recovery_need: 0 },
          tags: ["functional_contact", "balanced_distance"],
        },
        {
          id: "c",
          label: "無理に近づかないほうがよさそう",
          scores: { pace: 0, clarity: 0, openness: 1, recovery_need: 1 },
          tags: ["boundary_preference", "quiet_distance"],
        },
        {
          id: "d",
          label: "今は少し静かめに過ごしたい",
          scores: { pace: 0, clarity: 0, openness: 0, recovery_need: 2 },
          tags: ["closed_mode", "recovery_guard"],
        },
      ],
      sensitivity: "low",
    },
    {
      id: "csq11",
      prompt: "決めることがいくつか重なったとき、今の自分に近いのはどれですか。",
      options: [
        {
          id: "a",
          label: "優先をつけて進めやすい",
          scores: { pace: 2, clarity: 2, openness: 0, recovery_need: 0 },
          tags: ["decisive", "clear_sorting"],
        },
        {
          id: "b",
          label: "少し整理できれば決められる",
          scores: { pace: 1, clarity: 2, openness: 0, recovery_need: 0 },
          tags: ["deliberate", "need_structure"],
        },
        {
          id: "c",
          label: "どれもしっくり来ず決めきれない",
          scores: { pace: 0, clarity: 2, openness: 0, recovery_need: 1 },
          tags: ["indecision", "foggy_choice"],
        },
        {
          id: "d",
          label: "決めることは少しあとに回したい",
          scores: { pace: 0, clarity: 0, openness: 0, recovery_need: 2 },
          tags: ["decision_delay", "mental_load"],
        },
      ],
      sensitivity: "low",
    },
    {
      id: "csq12",
      prompt: "小さなミスや抜けに気づいたときの自分に近いのはどれですか。",
      options: [
        {
          id: "a",
          label: "直してそのまま進められる",
          scores: { pace: 2, clarity: 1, openness: 0, recovery_need: 0 },
          tags: ["recover_fast", "steady_flow"],
        },
        {
          id: "b",
          label: "少し引っかかるが整え直せる",
          scores: { pace: 1, clarity: 2, openness: 0, recovery_need: 0 },
          tags: ["repair_mode", "clear_reset"],
        },
        {
          id: "c",
          label: "頭に残って流れが止まりやすい",
          scores: { pace: 0, clarity: 2, openness: 0, recovery_need: 1 },
          tags: ["mistake_echo", "flow_break"],
        },
        {
          id: "d",
          label: "そのあと少し気に残りやすい",
          scores: { pace: 0, clarity: 0, openness: 0, recovery_need: 2 },
          tags: ["mistake_residue", "fragile_energy"],
        },
      ],
      sensitivity: "low",
    },
    {
      id: "csq13",
      prompt: "今日は、自分から話しかけるならどれが近いですか。",
      options: [
        {
          id: "a",
          label: "気軽に声をかけやすい",
          scores: { pace: 1, clarity: 0, openness: 2, recovery_need: 0 },
          tags: ["social_initiation", "open_energy"],
        },
        {
          id: "b",
          label: "必要なことなら声をかけられる",
          scores: { pace: 0, clarity: 1, openness: 1, recovery_need: 0 },
          tags: ["functional_talk", "measured_open"],
        },
        {
          id: "c",
          label: "少し様子を見てからにしたい",
          scores: { pace: 0, clarity: 0, openness: 1, recovery_need: 1 },
          tags: ["social_hesitation", "boundary_first"],
        },
        {
          id: "d",
          label: "今日は自分から広げたくない",
          scores: { pace: 0, clarity: 0, openness: 0, recovery_need: 2 },
          tags: ["social_close", "protect_energy"],
        },
      ],
      sensitivity: "low",
    },
    {
      id: "csq14",
      prompt: "何となく落ち着かないときの頭の中に近いのはどれですか。",
      options: [
        {
          id: "a",
          label: "一度動き出せばまとまりやすい",
          scores: { pace: 2, clarity: 1, openness: 0, recovery_need: 0 },
          tags: ["action_clarity", "move_to_settle"],
        },
        {
          id: "b",
          label: "書き出すと整いやすい",
          scores: { pace: 0, clarity: 2, openness: 0, recovery_need: 1 },
          tags: ["write_to_sort", "clarity_seek"],
        },
        {
          id: "c",
          label: "考えが散りやすい",
          scores: { pace: 0, clarity: 2, openness: 0, recovery_need: 1 },
          tags: ["mental_scatter", "fog_mode"],
        },
        {
          id: "d",
          label: "まず刺激を減らしたい感じがある",
          scores: { pace: 0, clarity: 0, openness: 0, recovery_need: 2 },
          tags: ["reduce_input", "quiet_needed"],
        },
      ],
      sensitivity: "medium",
    },
    {
      id: "csq15",
      prompt: "今日、人の反応を受け取るときに近いのはどれですか。",
      options: [
        {
          id: "a",
          label: "わりと軽く受け取れる",
          scores: { pace: 1, clarity: 0, openness: 2, recovery_need: 0 },
          tags: ["light_feedback", "social_room"],
        },
        {
          id: "b",
          label: "必要なところだけ受け取りたい",
          scores: { pace: 0, clarity: 1, openness: 1, recovery_need: 0 },
          tags: ["filtered_feedback", "balanced_open"],
        },
        {
          id: "c",
          label: "少し気に残りやすい",
          scores: { pace: 0, clarity: 1, openness: 0, recovery_need: 1 },
          tags: ["feedback_lingers", "careful_mode"],
        },
        {
          id: "d",
          label: "今は反応を受け取るゆとりがあまりない",
          scores: { pace: 0, clarity: 0, openness: 0, recovery_need: 2 },
          tags: ["low_margin", "protective_state"],
        },
      ],
      sensitivity: "medium",
    },
    {
      id: "csq16",
      prompt: "少し先の予定を考えるとき、今の自分に近いのはどれですか。",
      options: [
        {
          id: "a",
          label: "このまま入れても大丈夫そう",
          scores: { pace: 2, clarity: 1, openness: 1, recovery_need: 0 },
          tags: ["future_capacity", "forward_room"],
        },
        {
          id: "b",
          label: "間にゆとりがあれば入れやすい",
          scores: { pace: 1, clarity: 2, openness: 0, recovery_need: 0 },
          tags: ["planned_margin", "steady_mode"],
        },
        {
          id: "c",
          label: "増やす前に今を整理したい",
          scores: { pace: 0, clarity: 2, openness: 0, recovery_need: 1 },
          tags: ["hold_before_add", "clarity_first"],
        },
        {
          id: "d",
          label: "今は増やすこと自体が少し負担に感じやすい",
          scores: { pace: 0, clarity: 0, openness: 0, recovery_need: 2 },
          tags: ["future_load", "recovery_priority"],
        },
      ],
      sensitivity: "low",
    },
    {
      id: "csq17",
      prompt: "今日の学びや仕事で、誰かと並ぶなら近いのはどれですか。",
      options: [
        {
          id: "a",
          label: "一緒に進めると勢いが出やすい",
          scores: { pace: 1, clarity: 0, openness: 2, recovery_need: 0 },
          tags: ["co_work_energy", "open_collab"],
        },
        {
          id: "b",
          label: "確認の相手がいると安心しやすい",
          scores: { pace: 0, clarity: 2, openness: 1, recovery_need: 0 },
          tags: ["checkin_support", "clarity_support"],
        },
        {
          id: "c",
          label: "今は自分のペースを守りたい",
          scores: { pace: 0, clarity: 0, openness: 1, recovery_need: 1 },
          tags: ["solo_preference", "boundary_mode"],
        },
        {
          id: "d",
          label: "人に合わせるゆとりがあまりない",
          scores: { pace: 0, clarity: 0, openness: 0, recovery_need: 2 },
          tags: ["low_social_margin", "recovery_guard"],
        },
      ],
      sensitivity: "low",
    },
    {
      id: "csq18",
      prompt: "今日は、気持ちを言葉にするとしたら近いのはどれですか。",
      options: [
        {
          id: "a",
          label: "わりとその場で言葉にしやすい",
          scores: { pace: 1, clarity: 1, openness: 2, recovery_need: 0 },
          tags: ["expressive", "clear_outward"],
        },
        {
          id: "b",
          label: "少し考えれば言葉にできる",
          scores: { pace: 0, clarity: 2, openness: 1, recovery_need: 0 },
          tags: ["thoughtful_expression", "measured_open"],
        },
        {
          id: "c",
          label: "うまく言葉にできず残りやすい",
          scores: { pace: 0, clarity: 2, openness: 0, recovery_need: 1 },
          tags: ["unsaid_feeling", "inner_clutter"],
        },
        {
          id: "d",
          label: "今日はあまり広げずにいたい",
          scores: { pace: 0, clarity: 0, openness: 0, recovery_need: 2 },
          tags: ["quiet_expression", "soft_hold"],
        },
      ],
      sensitivity: "medium",
    },
    {
      id: "csq19",
      prompt: "今日の自分に合う情報の量に近いのはどれですか。",
      options: [
        {
          id: "a",
          label: "多めでも拾いながら進められる",
          scores: { pace: 2, clarity: 1, openness: 1, recovery_need: 0 },
          tags: ["high_input_ok", "active_mode"],
        },
        {
          id: "b",
          label: "必要な分だけならちょうどよい",
          scores: { pace: 1, clarity: 2, openness: 0, recovery_need: 0 },
          tags: ["moderate_input", "balanced_focus"],
        },
        {
          id: "c",
          label: "少なめにしないと散りやすい",
          scores: { pace: 0, clarity: 2, openness: 0, recovery_need: 1 },
          tags: ["reduced_input", "focus_protection"],
        },
        {
          id: "d",
          label: "今はかなり静かなほうが楽",
          scores: { pace: 0, clarity: 0, openness: 0, recovery_need: 2 },
          tags: ["very_low_input", "recovery_space"],
        },
      ],
      sensitivity: "low",
    },
    {
      id: "csq20",
      prompt: "何かを頼まれたとき、今の自分に近いのはどれですか。",
      options: [
        {
          id: "a",
          label: "できることならすぐ動ける",
          scores: { pace: 2, clarity: 0, openness: 2, recovery_need: 0 },
          tags: ["quick_help", "open_response"],
        },
        {
          id: "b",
          label: "条件が分かれば受けやすい",
          scores: { pace: 1, clarity: 2, openness: 1, recovery_need: 0 },
          tags: ["clear_request_needed", "structured_support"],
        },
        {
          id: "c",
          label: "少し考えてから返したい",
          scores: { pace: 0, clarity: 1, openness: 1, recovery_need: 1 },
          tags: ["delayed_response", "boundary_check"],
        },
        {
          id: "d",
          label: "今は増やしすぎないほうが合いそう",
          scores: { pace: 0, clarity: 0, openness: 0, recovery_need: 2 },
          tags: ["capacity_guard", "load_limit"],
        },
      ],
      sensitivity: "low",
    },
    {
      id: "csq21",
      prompt: "やることが残っている夜の自分に近いのはどれですか。",
      options: [
        {
          id: "a",
          label: "もう少し進めて終えたい",
          scores: { pace: 2, clarity: 1, openness: 0, recovery_need: 0 },
          tags: ["night_push", "forward_finish"],
        },
        {
          id: "b",
          label: "区切りだけつけて閉じたい",
          scores: { pace: 1, clarity: 2, openness: 0, recovery_need: 0 },
          tags: ["clean_close", "structured_end"],
        },
        {
          id: "c",
          label: "気になるが頭がまとまりにくい",
          scores: { pace: 0, clarity: 2, openness: 0, recovery_need: 1 },
          tags: ["unfinished_loop", "mental_residue"],
        },
        {
          id: "d",
          label: "今日は整えて終わるほうが合いそう",
          scores: { pace: 0, clarity: 0, openness: 0, recovery_need: 2 },
          tags: ["restore_over_push", "end_recovery"],
        },
      ],
      sensitivity: "low",
    },
    {
      id: "csq22",
      prompt: "今の自分がいちばん保ちたいものに近いのはどれですか。",
      options: [
        {
          id: "a",
          label: "進んでいる感じ",
          scores: { pace: 2, clarity: 1, openness: 0, recovery_need: 0 },
          tags: ["need_progress", "momentum"],
        },
        {
          id: "b",
          label: "頭の見通し",
          scores: { pace: 0, clarity: 2, openness: 0, recovery_need: 0 },
          tags: ["need_clarity", "mental_order"],
        },
        {
          id: "c",
          label: "人とのちょうどよい距離",
          scores: { pace: 0, clarity: 0, openness: 2, recovery_need: 1 },
          tags: ["need_boundary_balance", "social_fit"],
        },
        {
          id: "d",
          label: "静かに戻れるゆとり",
          scores: { pace: 0, clarity: 0, openness: 0, recovery_need: 2 },
          tags: ["need_rest", "quiet_margin"],
        },
      ],
      sensitivity: "low",
    },
    {
      id: "csq23",
      prompt: "今日の自分に合うペースを選ぶなら近いのはどれですか。",
      options: [
        {
          id: "a",
          label: "勢いのあるうちに進めたい",
          scores: { pace: 2, clarity: 0, openness: 0, recovery_need: 0 },
          tags: ["fast_lane", "move_now"],
        },
        {
          id: "b",
          label: "区切りながら安定して進めたい",
          scores: { pace: 1, clarity: 2, openness: 0, recovery_need: 0 },
          tags: ["steady_lane", "structured_rhythm"],
        },
        {
          id: "c",
          label: "波に合わせて変えたい",
          scores: { pace: 1, clarity: 1, openness: 0, recovery_need: 1 },
          tags: ["variable_lane", "adaptive_pace"],
        },
        {
          id: "d",
          label: "今日はゆるめに整えたい",
          scores: { pace: 0, clarity: 0, openness: 0, recovery_need: 2 },
          tags: ["slow_lane", "gentle_reset"],
        },
      ],
      sensitivity: "low",
    },
    {
      id: "csq24",
      prompt: "もう少し深く見るなら、今の自分がいちばん知りたいのはどれですか。",
      options: [
        {
          id: "a",
          label: "この流れをうまく活かす方法",
          scores: { pace: 2, clarity: 1, openness: 0, recovery_need: 0 },
          tags: ["report_progress", "next_step"],
        },
        {
          id: "b",
          label: "流れが止まりやすい場面の整理",
          scores: { pace: 0, clarity: 2, openness: 0, recovery_need: 1 },
          tags: ["report_clarity", "pattern_review"],
        },
        {
          id: "c",
          label: "人との距離感にどう出やすいか",
          scores: { pace: 0, clarity: 0, openness: 2, recovery_need: 0 },
          tags: ["report_relationship", "social_lens"],
        },
        {
          id: "d",
          label: "休み方と戻り方のヒント",
          scores: { pace: 0, clarity: 0, openness: 0, recovery_need: 2 },
          tags: ["report_recovery", "rest_hint"],
        },
      ],
      sensitivity: "low",
    },
  ],
  results: [
    {
      id: "open_stride",
      displayName: "ひらけた前進モード",
      recognitionLine: "いまは、外とのやり取りも動き出しも比較的つくりやすい状態です。",
      publicBullets: [
        "やることの入口を見つけやすい",
        "人との行き来も広げやすい",
        "小さな前進がそのまま流れになりやすい",
      ],
      reportAngle: "進みやすい日に抱えすぎず、流れを保つ整え方を見る",
      recommendationTags: [
        "state_open",
        "rhythm_fast",
        "need_next_step",
        "context_daily_life",
        "content_report",
      ],
      nextTestIds: ["relationship_distance_check_v1", "work_learning_rhythm_check_v1"],
    },
    {
      id: "balanced_window",
      displayName: "ほどよく整うモード",
      recognitionLine: "いまは、少し整えながらなら無理なく進めやすい状態に近そうです。",
      publicBullets: [
        "区切りがあると力を出しやすい",
        "無理をしなければ安定しやすい",
        "見通しを持つと安心して動きやすい",
      ],
      reportAngle: "安定を崩しにくい進め方と、ちょうどよいゆとりの作り方を見る",
      recommendationTags: [
        "state_calm",
        "rhythm_steady",
        "need_structure",
        "content_short_reading",
        "content_report",
      ],
      nextTestIds: ["work_learning_rhythm_check_v1", "relationship_distance_check_v1"],
    },
    {
      id: "sorting_entry",
      displayName: "整理入口モード",
      recognitionLine: "いまは、動く前に少し順番や見通しをつくると合いやすい状態です。",
      publicBullets: [
        "先に整えると進みやすさが戻りやすい",
        "気になることが減ると集中しやすい",
        "急がされないほうが力を出しやすい",
      ],
      reportAngle: "流れが止まりやすい場面を整理して、次に進みやすい入口を見る",
      recommendationTags: [
        "state_unclear",
        "need_clarity",
        "rhythm_stuck",
        "content_checklist",
        "content_report",
      ],
      nextTestIds: ["work_learning_rhythm_check_v1", "relationship_distance_check_v1"],
    },
    {
      id: "switching_wave",
      displayName: "切り替え調整モード",
      recognitionLine: "いまは、場面ごとにリズムが変わりやすく、切り替え方が大事な状態かもしれません。",
      publicBullets: [
        "一定の型より場面ごとの調整が合いやすい",
        "情報や予定の量で流れが変わりやすい",
        "小さな切り替えの工夫が役に立ちやすい",
      ],
      reportAngle: "波のある日に散らかりすぎず進むための切り替え方を見る",
      recommendationTags: [
        "state_variable",
        "rhythm_variable",
        "need_next_step",
        "content_reflection_prompt",
        "content_report",
      ],
      nextTestIds: ["work_learning_rhythm_check_v1", "current_state_check_v1"],
    },
    {
      id: "quiet_restore",
      displayName: "静かな回復モード",
      recognitionLine:
        "いまは、広げるより、少し静かめのペースで整えるほうが合いやすいタイミングかもしれません。",
      publicBullets: [
        "速さより整え方が大事になりやすい",
        "刺激を減らすと見通しが戻りやすい",
        "ひとりで落ち着く時間が役に立ちやすい",
      ],
      reportAngle: "戻りやすい順番と、刺激を減らす整え方を見る",
      recommendationTags: [
        "state_rebuilding",
        "need_rest",
        "rhythm_slow",
        "context_private_time",
        "content_report",
      ],
      nextTestIds: ["relationship_distance_check_v1", "work_learning_rhythm_check_v1"],
    },
  ],
  scoring: {
    method: "sum_dimension_scores_then_map_to_best_fit_result",
    dimensionRules: {
      pace: "higher scores indicate easier forward movement and lower hesitation",
      clarity: "higher scores indicate stronger need for structure, sorting, and mental organization",
      openness: "higher scores indicate easier outward engagement and lower social closing",
      recovery_need: "higher scores indicate stronger need for quiet, margin, and reset",
    },
    mappingLogic: [
      "high pace + high openness + low recovery_need => open_stride",
      "mid pace + high clarity + low-mid recovery_need => balanced_window",
      "low-mid pace + high clarity + mid recovery_need => sorting_entry",
      "mixed pace + mixed clarity + mixed recovery_need => switching_wave",
      "low pace + low openness + high recovery_need => quiet_restore",
    ],
    tieBreak: [
      "if recovery_need is highest, prefer quiet_restore",
      "if clarity strongly exceeds pace, prefer sorting_entry over open_stride",
      "if scores are broadly even, prefer balanced_window",
    ],
    confidenceRule:
      "if top result leads by fewer than 3 total weighted points, use softer wording and surface balanced_window or switching_wave if fit is mixed",
    fallbackResultId: "balanced_window",
  },
  reportOutline: [
    {
      id: "state_view",
      title: "いまの状態の見え方",
      promise: "今日の流れがどこで作られやすいかを整理する",
    },
    {
      id: "stuck_scenes",
      title: "流れが止まりやすい場面",
      promise: "予定変更、返事待ち、情報の多さなどで流れが止まりやすい場面を見る",
    },
    {
      id: "reset_entry",
      title: "整え方の入口",
      promise: "今の状態に合う小さな整え方を示す",
    },
    {
      id: "distance_lens",
      title: "人との距離感への出やすさ",
      promise: "外との開き方や疲れ方にどう出やすいかを言葉にする",
    },
    {
      id: "work_learning_lens",
      title: "仕事・学び方のリズム",
      promise: "取りかかり方、切り替え方、続け方への出やすさを見る",
    },
    {
      id: "recovery_lens",
      title: "休み方・戻り方",
      promise: "刺激を減らす方法や戻る順番のヒントを示す",
    },
    {
      id: "next_hints",
      title: "次に見るとよさそうなもの",
      promise: "今の状態に合う次のチェックや短い読みものを案内する",
    },
    {
      id: "recheck_timing",
      title: "もう一度チェックするタイミング",
      promise: "この状態を見直すのに合う再チェックの目安を示す",
    },
  ],
  recommendationTags: [
    "state_open",
    "state_calm",
    "state_unclear",
    "state_variable",
    "state_rebuilding",
    "need_clarity",
    "need_rest",
    "need_boundary",
    "need_next_step",
    "context_daily_life",
    "context_relationship",
    "context_work",
    "context_learning",
    "content_short_reading",
    "content_checklist",
    "content_reflection_prompt",
    "content_report",
  ],
  internalOnlyTags: {
    recommendationRouting: ["commercial_paid_report_interest"],
    handlingRules: [
      "internal-only",
      "must_not_render_in_ui",
      "must_not_appear_in_user_copy",
      "must_not_be_sent_in_frontend_visible_payload",
      "must_not_be_used_as_user-visible_analytics_label",
    ],
  },
  safetyNotes: [
    "This is a current-state reflection, not a diagnosis.",
    "Do not frame the result as fixed personality or true essence.",
    "Keep free-result copy public-safe and avoid exposing deeper vulnerability.",
    "Do not use expert, scientific validation, or statistics claims without verified evidence.",
    "Do not use fortune-telling, destiny, or certainty framing.",
    "Paid report positioning must remain optional deeper reading.",
    "Recommendation positioning must remain a next-hint layer after the result.",
  ],
  userFacingForbiddenTermsCheck: {
    blockedTerms: [
      "clinical",
      "diagnosis",
      "therapy",
      "disorder",
      "Borderline",
      "burnout",
      "本当の性格",
      "本質",
      "完全診断",
      "正確に判断",
      "運命",
      "反芻",
      "消耗",
      "余白が少ない",
      "重い",
      "閉じていたい",
      "commercial_paid_report_interest",
    ],
    status: "checked_for_current_user_facing_copy",
    note: "The internal-only tag is retained for routing only and must never be shown on user-facing surfaces.",
  },
  revisionLog: [
    {
      field: "csq03.options.d.label",
      change: "softened to reduce overload-screening feel",
    },
    {
      field: "csq04.options.d.label",
      change: "replaced higher-risk mental-health-adjacent wording with lighter residue wording",
    },
    {
      field: "csq06.options.d.label",
      change: "softened to reduce depletion framing",
    },
    {
      field: "csq12.options.d.label",
      change: "softened to reduce depletion framing",
    },
    {
      field: "csq14.options.c.label",
      change: "simplified to lighter scatter wording",
    },
    {
      field: "csq15.options.d.label",
      change: "softened with safer margin wording",
    },
    {
      field: "csq18.options.d.label",
      change: "softened to reduce closed-state wording",
    },
    {
      field: "csq20.options.d.label",
      change: "softened to avoid incapacity-coded reading",
    },
    {
      field: "csq21.options.d.label",
      change: "softened to end-of-day reset wording",
    },
    {
      field: "results.sorting_entry.reportAngle",
      change: "changed to clearer and less friction-heavy wording",
    },
    {
      field: "results.switching_wave.displayName",
      change: "changed to safer adjustment framing",
    },
    {
      field: "results.quiet_restore.recognitionLine",
      change: "softened to calm-pace framing",
    },
    {
      field: "reportOutline.stuck_scenes",
      change: "softened title and promise to reduce pressure",
    },
    {
      field: "internalOnlyTags",
      change: "locked commercial routing tag as internal-only",
    },
  ],
} as const;

type QuizData = typeof currentStateCheckV1;
type Question = QuizData["questions"][number];
type Result = QuizData["results"][number];

export type CurrentStateQuestion = Question;
export type CurrentStateResult = Result;
export type CurrentStateResultId = Result["id"];
export type CurrentStateAnswerMap = Record<string, string>;

export const currentStateQuestions = currentStateCheckV1.questions;
export const currentStateResults = currentStateCheckV1.results;

export function getCurrentStateQuestion(questionId: string) {
  return currentStateCheckV1.questions.find((question) => question.id === questionId) ?? null;
}

export function getCurrentStateResult(resultId: string | null | undefined) {
  if (!resultId) {
    return null;
  }
  return currentStateCheckV1.results.find((result) => result.id === resultId) ?? null;
}

export function getCurrentStateSegmentLabel(index: number) {
  if (index <= 7) {
    return "今日のペース";
  }
  if (index <= 15) {
    return "人との開き方";
  }
  return "整え方と次のヒント";
}

export function getCurrentStateMilestone(index: number) {
  if (index === 7) {
    return "ここまでで前半です";
  }
  if (index === 15) {
    return "あと少しで無料結果です";
  }
  return null;
}

function sumDimensionScores(answers: CurrentStateAnswerMap) {
  return currentStateCheckV1.questions.reduce(
    (totals, question) => {
      const selected = question.options.find((option) => option.id === answers[question.id]);
      if (!selected) {
        return totals;
      }
      return {
        pace: totals.pace + selected.scores.pace,
        clarity: totals.clarity + selected.scores.clarity,
        openness: totals.openness + selected.scores.openness,
        recovery_need: totals.recovery_need + selected.scores.recovery_need,
      };
    },
    { pace: 0, clarity: 0, openness: 0, recovery_need: 0 },
  );
}

function calculateWeightedResultFits(totals: ReturnType<typeof sumDimensionScores>) {
  const fits: Record<CurrentStateResultId, number> = {
    open_stride: totals.pace * 2.1 + totals.openness * 2 - totals.recovery_need * 1.2 - totals.clarity * 0.35,
    balanced_window:
      totals.pace * 1.15 +
      totals.clarity * 1.75 +
      totals.openness * 0.55 -
      totals.recovery_need * 0.45 -
      Math.abs(totals.pace - totals.clarity) * 0.25,
    sorting_entry:
      totals.clarity * 2 +
      totals.recovery_need * 0.85 -
      totals.pace * 0.65 -
      totals.openness * 0.2,
    switching_wave:
      totals.pace * 1 +
      totals.clarity * 1 +
      totals.recovery_need * 1 +
      Math.min(totals.pace, totals.clarity) * 0.35 +
      Math.abs(totals.pace - totals.recovery_need) * 0.1,
    quiet_restore:
      totals.recovery_need * 2.25 +
      totals.clarity * 0.45 -
      totals.pace * 0.9 -
      totals.openness * 0.8,
  };

  return Object.entries(fits)
    .map(([resultId, score]) => ({ resultId: resultId as CurrentStateResultId, score }))
    .sort((left, right) => right.score - left.score);
}

export function scoreCurrentStateCheck(answers: CurrentStateAnswerMap) {
  const totals = sumDimensionScores(answers);
  const rankedFits = calculateWeightedResultFits(totals);
  let selectedId = rankedFits[0]?.resultId ?? currentStateCheckV1.scoring.fallbackResultId;

  const highestDimension = Object.entries(totals).sort((left, right) => right[1] - left[1])[0]?.[0];
  const evenlySpread =
    Math.max(totals.pace, totals.clarity, totals.openness, totals.recovery_need) -
      Math.min(totals.pace, totals.clarity, totals.openness, totals.recovery_need) <=
    3;

  if (highestDimension === "recovery_need") {
    selectedId = "quiet_restore";
  } else if (totals.clarity >= totals.pace + 5 && selectedId === "open_stride") {
    selectedId = "sorting_entry";
  } else if (evenlySpread) {
    selectedId = "balanced_window";
  }

  const lead = (rankedFits[0]?.score ?? 0) - (rankedFits[1]?.score ?? 0);
  if (lead < 3) {
    const mixedFit =
      Math.abs(totals.pace - totals.clarity) <= 3 &&
      Math.abs(totals.clarity - totals.recovery_need) <= 3;
    selectedId = mixedFit ? "switching_wave" : "balanced_window";
  }

  return {
    totals,
    resultId: selectedId,
    result: getCurrentStateResult(selectedId) ?? currentStateCheckV1.results.find((result) => result.id === currentStateCheckV1.scoring.fallbackResultId)!,
  };
}

export function getCurrentStateReportSections() {
  return currentStateCheckV1.reportOutline;
}
