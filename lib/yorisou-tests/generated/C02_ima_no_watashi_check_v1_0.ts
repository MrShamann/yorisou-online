export const c02ImaNoWatashiCheckV10 = {
  metadata: {
    test_id: "C02",
    version: "v1.0",
    test_name_jp: "今のわたしチェック",
    test_name_cn: "现在的我状态检查",
    layer: "Yorisou Core",
    question_count: 36,
    section_count: 4,
    expected_completion_time: "7-10 minutes",
    output_status: "draft_test_spec",
    codex_ready: false,
    implementation_status: "review_file_only_not_site_integration"
  },

  sections: [
    {
      id: "A",
      title_jp: "今の内側の温度",
      title_cn: "现在内在的温度",
      question_ids: ["C02_Q01","C02_Q02","C02_Q03","C02_Q04","C02_Q05","C02_Q06","C02_Q07","C02_Q08","C02_Q09"],
      section_break_copy_jp: "ここまでで、今の内側の温度が少し見えてきました。次は、人との距離と安心感を見ていきます。"
    },
    {
      id: "B",
      title_jp: "人との距離と安心感",
      title_cn: "与人的距离和安心感",
      question_ids: ["C02_Q10","C02_Q11","C02_Q12","C02_Q13","C02_Q14","C02_Q15","C02_Q16","C02_Q17","C02_Q18"],
      section_break_copy_jp: "人との距離の取り方が見えてきました。次は、動き出し方と迷い方を見ていきます。"
    },
    {
      id: "C",
      title_jp: "動き出し方と迷い方",
      title_cn: "行动方式和犹豫方式",
      question_ids: ["C02_Q19","C02_Q20","C02_Q21","C02_Q22","C02_Q23","C02_Q24","C02_Q25","C02_Q26","C02_Q27"],
      section_break_copy_jp: "今のあなたが動き出しやすい条件が見えてきました。最後に、回復と次の一歩を見ていきます。"
    },
    {
      id: "D",
      title_jp: "回復・選択・次の一歩",
      title_cn: "恢复、选择和下一步",
      question_ids: ["C02_Q28","C02_Q29","C02_Q30","C02_Q31","C02_Q32","C02_Q33","C02_Q34","C02_Q35","C02_Q36"],
      section_break_copy_jp: "回答ありがとうございます。結果では、今のあなたの状態タイプと、次に見るとよい診断を整理します。"
    }
  ],

  dimensions: {
    inner_temperature: "内在温度不明度 / 状态可感知度",
    emotional_clarity: "情绪与需求清晰度",
    emotional_sensitivity: "当前敏感度",
    emotional_stability: "当前稳定感",
    recovery_need: "恢复需求",
    reflection_need: "内省需求",
    action_energy: "行动能量",
    change_readiness: "改变准备度",
    next_step_readiness: "下一步准备度",
    decision_style: "决策节奏",
    reassurance_need: "安心确认需求",
    connection_need: "连接需求",
    autonomy_need: "独处 / 自主空间需求",
    boundary_need: "边界重整需求",
    light_support_need: "轻陪伴需求",
    relationship_focus: "关系主题相关度",
    work_focus: "工作 / 角色主题相关度",
    core_need_signal: "Core 深层理解信号",
    rhythm_reset_need: "生活节奏重整需求",
    lightness_need: "轻娱乐 / 轻提示需求",
    core_depth_intent: "120 问主测试意图",
    oracle_return_intent: "Oracle / 今日回访意图",
    recommendation_intent: "推荐 / 下一步接受度"
  },

  dimension_weights: {
    inner_temperature: 0.08,
    emotional_clarity: 0.08,
    recovery_need: 0.08,
    reflection_need: 0.07,
    action_energy: 0.08,
    next_step_readiness: 0.08,
    reassurance_need: 0.07,
    connection_need: 0.05,
    autonomy_need: 0.05,
    boundary_need: 0.05,
    decision_style: 0.06,
    relationship_focus: 0.05,
    work_focus: 0.05,
    core_depth_intent: 0.05,
    lightness_need: 0.05,
    recommendation_intent: 0.05
  },

  questions: [
    {
      id: "C02_Q01",
      section: "A",
      question_type: "scale",
      prompt_jp: "最近、自分の気持ちの温度が少し分かりにくい。",
      prompt_cn: "最近，我有点不太清楚自己内心的温度。",
      primary_dimension: "inner_temperature",
      secondary_dimension: "emotional_clarity",
      sensitivity_level: "medium",
      public_private_note: "aggregate only; do not expose in share card",
      risk_note: "Could imply emotional confusion; keep non-clinical.",
      interpretation_boundary: "Interpret as current self-awareness state, not mental health diagnosis.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["inner_temperature","emotional_clarity"], weights: { inner_temperature: 5, emotional_clarity: 1 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["inner_temperature","emotional_clarity"], weights: { inner_temperature: 4, emotional_clarity: 2 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["inner_temperature"], weights: { inner_temperature: 3, emotional_clarity: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["emotional_clarity"], weights: { inner_temperature: 2, emotional_clarity: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["emotional_clarity"], weights: { inner_temperature: 1, emotional_clarity: 5 } }
      ]
    },
    {
      id: "C02_Q02",
      section: "A",
      question_type: "scale",
      prompt_jp: "何かを頑張る前に、まず少し整える時間がほしい。",
      prompt_cn: "在努力做什么之前，我想先有一点整理自己的时间。",
      primary_dimension: "recovery_need",
      secondary_dimension: "action_energy",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; preparation and recovery preference only.",
      interpretation_boundary: "Interpret as pacing need, not inability to act.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["recovery_need","action_energy"], weights: { recovery_need: 5, action_energy: 1 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["recovery_need","action_energy"], weights: { recovery_need: 4, action_energy: 2 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["recovery_need"], weights: { recovery_need: 3, action_energy: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["action_energy"], weights: { recovery_need: 2, action_energy: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["action_energy"], weights: { recovery_need: 1, action_energy: 5 } }
      ]
    },
    {
      id: "C02_Q03",
      section: "A",
      question_type: "scale",
      prompt_jp: "今は、外に向かう力よりも内側を見たい気持ちが強い。",
      prompt_cn: "现在，比起向外行动，我更想看看自己的内在。",
      primary_dimension: "reflection_need",
      secondary_dimension: "action_energy",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; reflective orientation only.",
      interpretation_boundary: "Interpret as current attention direction, not social withdrawal.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["reflection_need","action_energy"], weights: { reflection_need: 5, action_energy: 1 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["reflection_need","action_energy"], weights: { reflection_need: 4, action_energy: 2 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["reflection_need"], weights: { reflection_need: 3, action_energy: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["action_energy"], weights: { reflection_need: 2, action_energy: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["action_energy"], weights: { reflection_need: 1, action_energy: 5 } }
      ]
    },
    {
      id: "C02_Q04",
      section: "A",
      question_type: "scale",
      prompt_jp: "小さなことにも、少し反応しやすくなっている。",
      prompt_cn: "我最近对一些小事也更容易有反应。",
      primary_dimension: "emotional_sensitivity",
      secondary_dimension: "recovery_need",
      sensitivity_level: "medium",
      public_private_note: "private aggregate only",
      risk_note: "Could touch sensitivity; avoid clinical interpretation.",
      interpretation_boundary: "Interpret as current sensitivity, not symptom or disorder.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["emotional_sensitivity","recovery_need"], weights: { emotional_sensitivity: 5, recovery_need: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["emotional_sensitivity","recovery_need"], weights: { emotional_sensitivity: 4, recovery_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["emotional_sensitivity"], weights: { emotional_sensitivity: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["emotional_stability"], weights: { emotional_sensitivity: 2, emotional_stability: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["emotional_stability"], weights: { emotional_sensitivity: 1, emotional_stability: 5 } }
      ]
    },
    {
      id: "C02_Q05",
      section: "A",
      question_type: "scale",
      prompt_jp: "今の自分に必要なものを、言葉にするのが少し難しい。",
      prompt_cn: "我现在有点难把自己需要什么说清楚。",
      primary_dimension: "emotional_clarity",
      secondary_dimension: "core_need_signal",
      sensitivity_level: "medium",
      public_private_note: "aggregate only; not share-card visible",
      risk_note: "Could imply confusion; avoid deficit framing.",
      interpretation_boundary: "Interpret as language clarity, not competence.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["emotional_clarity","core_need_signal"], weights: { emotional_clarity: 1, core_need_signal: 5 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["emotional_clarity","core_need_signal"], weights: { emotional_clarity: 2, core_need_signal: 4 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["core_need_signal"], weights: { emotional_clarity: 3, core_need_signal: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["emotional_clarity"], weights: { emotional_clarity: 4, core_need_signal: 2 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["emotional_clarity"], weights: { emotional_clarity: 5, core_need_signal: 1 } }
      ]
    },
    {
      id: "C02_Q06",
      section: "A",
      question_type: "scale",
      prompt_jp: "最近の私は、少し急かされるとペースが乱れやすい。",
      prompt_cn: "最近的我，如果被催促，节奏容易被打乱。",
      primary_dimension: "pace_sensitivity",
      secondary_dimension: "recovery_need",
      sensitivity_level: "medium",
      public_private_note: "aggregate only",
      risk_note: "Could touch stress response; keep non-clinical.",
      interpretation_boundary: "Interpret as pace sensitivity, not stress disorder.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["pace_sensitivity","recovery_need"], weights: { pace_sensitivity: 5, recovery_need: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["pace_sensitivity","recovery_need"], weights: { pace_sensitivity: 4, recovery_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["pace_sensitivity"], weights: { pace_sensitivity: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["action_energy"], weights: { pace_sensitivity: 2, action_energy: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["action_energy"], weights: { pace_sensitivity: 1, action_energy: 5 } }
      ]
    },
    {
      id: "C02_Q07",
      section: "A",
      question_type: "scale",
      prompt_jp: "まだ形になっていないけれど、変わりたい感じがある。",
      prompt_cn: "虽然还没成形，但我有一种想要改变的感觉。",
      primary_dimension: "change_readiness",
      secondary_dimension: "next_step_readiness",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; change intention only.",
      interpretation_boundary: "Interpret as readiness signal, not promise of change.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["change_readiness","next_step_readiness"], weights: { change_readiness: 5, next_step_readiness: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["change_readiness","next_step_readiness"], weights: { change_readiness: 4, next_step_readiness: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["change_readiness"], weights: { change_readiness: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["stability_need"], weights: { change_readiness: 2, stability_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["stability_need"], weights: { change_readiness: 1, stability_need: 5 } }
      ]
    },
    {
      id: "C02_Q08",
      section: "A",
      question_type: "scale",
      prompt_jp: "今は、大きな決断よりも小さな確認を重ねたい。",
      prompt_cn: "现在，比起做大决定，我更想一点点确认。",
      primary_dimension: "decision_style",
      secondary_dimension: "reassurance_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; decision rhythm only.",
      interpretation_boundary: "Interpret as decision pacing, not inability to decide.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["decision_style","reassurance_need"], weights: { decision_style: 5, reassurance_need: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["decision_style","reassurance_need"], weights: { decision_style: 4, reassurance_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["decision_style"], weights: { decision_style: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["action_energy"], weights: { decision_style: 2, action_energy: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["action_energy"], weights: { decision_style: 1, action_energy: 5 } }
      ]
    },
    {
      id: "C02_Q09",
      section: "A",
      question_type: "scale",
      prompt_jp: "今の自分を、誰かに少し分かってほしい気持ちがある。",
      prompt_cn: "我现在有一点希望有人理解我。",
      primary_dimension: "reassurance_need",
      secondary_dimension: "relationship_focus",
      sensitivity_level: "medium",
      public_private_note: "private aggregate only",
      risk_note: "Could reveal vulnerability; never expose in share card.",
      interpretation_boundary: "Interpret as current reassurance need, not loneliness diagnosis.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["reassurance_need","relationship_focus"], weights: { reassurance_need: 5, relationship_focus: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["reassurance_need","relationship_focus"], weights: { reassurance_need: 4, relationship_focus: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["reassurance_need"], weights: { reassurance_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["autonomy_need"], weights: { reassurance_need: 2, autonomy_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["autonomy_need"], weights: { reassurance_need: 1, autonomy_need: 5 } }
      ]
    },
    {
      id: "C02_Q10",
      section: "B",
      question_type: "scale",
      prompt_jp: "人と一緒にいる時間があると、気持ちが戻りやすい。",
      prompt_cn: "和人在一起时，我的状态更容易回来。",
      primary_dimension: "connection_need",
      secondary_dimension: "recovery_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; connection preference only.",
      interpretation_boundary: "Interpret as recovery preference, not dependence.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["connection_need","recovery_need"], weights: { connection_need: 5, recovery_need: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["connection_need","recovery_need"], weights: { connection_need: 4, recovery_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["connection_need"], weights: { connection_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["autonomy_need"], weights: { connection_need: 2, autonomy_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["autonomy_need"], weights: { connection_need: 1, autonomy_need: 5 } }
      ]
    },
    {
      id: "C02_Q11",
      section: "B",
      question_type: "scale",
      prompt_jp: "今は、ひとりで静かに戻る時間も大切にしたい。",
      prompt_cn: "现在，我也想重视一个人安静恢复的时间。",
      primary_dimension: "autonomy_need",
      secondary_dimension: "recovery_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; solitude preference only.",
      interpretation_boundary: "Interpret as recovery space, not isolation.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["autonomy_need","recovery_need"], weights: { autonomy_need: 5, recovery_need: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["autonomy_need","recovery_need"], weights: { autonomy_need: 4, recovery_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["autonomy_need"], weights: { autonomy_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["connection_need"], weights: { autonomy_need: 2, connection_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["connection_need"], weights: { autonomy_need: 1, connection_need: 5 } }
      ]
    },
    {
      id: "C02_Q12",
      section: "B",
      question_type: "scale",
      prompt_jp: "連絡の間が空くと、少し気持ちが揺れやすい。",
      prompt_cn: "如果联系中断一段时间，我的心情容易有点摇晃。",
      primary_dimension: "reassurance_need",
      secondary_dimension: "relationship_focus",
      sensitivity_level: "medium",
      public_private_note: "private aggregate only",
      risk_note: "Relationship reassurance sensitivity; avoid blaming others.",
      interpretation_boundary: "Interpret as reassurance rhythm, not relationship judgment.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["reassurance_need","relationship_focus"], weights: { reassurance_need: 5, relationship_focus: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["reassurance_need","relationship_focus"], weights: { reassurance_need: 4, relationship_focus: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["reassurance_need"], weights: { reassurance_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["autonomy_need"], weights: { reassurance_need: 2, autonomy_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["autonomy_need"], weights: { reassurance_need: 1, autonomy_need: 5 } }
      ]
    },
    {
      id: "C02_Q13",
      section: "B",
      question_type: "scale",
      prompt_jp: "人に合わせすぎて、自分の本音が後回しになることがある。",
      prompt_cn: "我有时会太配合别人，把自己的真实想法放到后面。",
      primary_dimension: "boundary_need",
      secondary_dimension: "emotional_clarity",
      sensitivity_level: "medium",
      public_private_note: "private aggregate only",
      risk_note: "Could expose boundary vulnerability; no share-card use.",
      interpretation_boundary: "Interpret as boundary tendency, not weakness or blame.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["boundary_need","emotional_clarity"], weights: { boundary_need: 5, emotional_clarity: 2 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["boundary_need","emotional_clarity"], weights: { boundary_need: 4, emotional_clarity: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["boundary_need"], weights: { boundary_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["autonomy_need"], weights: { boundary_need: 2, autonomy_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["autonomy_need"], weights: { boundary_need: 1, autonomy_need: 5 } }
      ]
    },
    {
      id: "C02_Q14",
      section: "B",
      question_type: "scale",
      prompt_jp: "今は、深い話よりも軽くそばにいてくれる感じがちょうどいい。",
      prompt_cn: "现在，比起很深的对话，轻轻陪在身边的感觉更刚好。",
      primary_dimension: "light_support_need",
      secondary_dimension: "connection_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; support style only.",
      interpretation_boundary: "Interpret as preferred support style, not emotional avoidance.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["light_support_need","connection_need"], weights: { light_support_need: 5, connection_need: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["light_support_need","connection_need"], weights: { light_support_need: 4, connection_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["light_support_need"], weights: { light_support_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["reflection_need"], weights: { light_support_need: 2, reflection_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["reflection_need"], weights: { light_support_need: 1, reflection_need: 5 } }
      ]
    },
    {
      id: "C02_Q15",
      section: "B",
      question_type: "scale",
      prompt_jp: "誰かに相談する前に、自分の中で少し整理したい。",
      prompt_cn: "在找人商量之前，我想先自己整理一下。",
      primary_dimension: "reflection_need",
      secondary_dimension: "autonomy_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; reflection preference only.",
      interpretation_boundary: "Interpret as processing style, not refusal to connect.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["reflection_need","autonomy_need"], weights: { reflection_need: 5, autonomy_need: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["reflection_need","autonomy_need"], weights: { reflection_need: 4, autonomy_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["reflection_need"], weights: { reflection_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["connection_need"], weights: { reflection_need: 2, connection_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["connection_need"], weights: { reflection_need: 1, connection_need: 5 } }
      ]
    },
    {
      id: "C02_Q16",
      section: "B",
      question_type: "scale",
      prompt_jp: "今の自分には、はっきりした助言よりも受け止めてもらう時間が必要だ。",
      prompt_cn: "对现在的我来说，比起明确建议，更需要被接住的时间。",
      primary_dimension: "reassurance_need",
      secondary_dimension: "light_support_need",
      sensitivity_level: "medium",
      public_private_note: "private aggregate only",
      risk_note: "Support need; avoid therapeutic framing.",
      interpretation_boundary: "Interpret as support preference, not therapy need.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["reassurance_need","light_support_need"], weights: { reassurance_need: 5, light_support_need: 5 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["reassurance_need","light_support_need"], weights: { reassurance_need: 4, light_support_need: 4 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["reassurance_need"], weights: { reassurance_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["action_energy"], weights: { reassurance_need: 2, action_energy: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["action_energy"], weights: { reassurance_need: 1, action_energy: 5 } }
      ]
    },
    {
      id: "C02_Q17",
      section: "B",
      question_type: "scale",
      prompt_jp: "人との関係で、少し距離を測り直したい相手がいる。",
      prompt_cn: "在人际关系里，我有想重新衡量距离的人。",
      primary_dimension: "boundary_need",
      secondary_dimension: "relationship_focus",
      sensitivity_level: "medium",
      public_private_note: "private aggregate only",
      risk_note: "Relationship boundary signal; avoid relationship judgment.",
      interpretation_boundary: "Interpret as distance recalibration, not advice to cut ties.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["boundary_need","relationship_focus"], weights: { boundary_need: 5, relationship_focus: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["boundary_need","relationship_focus"], weights: { boundary_need: 4, relationship_focus: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["boundary_need"], weights: { boundary_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["connection_need"], weights: { boundary_need: 2, connection_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["connection_need"], weights: { boundary_need: 1, connection_need: 5 } }
      ]
    },
    {
      id: "C02_Q18",
      section: "B",
      question_type: "scale",
      prompt_jp: "今は、人との関係よりも自分の足元を整えたい。",
      prompt_cn: "现在，比起人际关系，我更想整理好自己的脚下。",
      primary_dimension: "core_need_signal",
      secondary_dimension: "autonomy_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; focus direction only.",
      interpretation_boundary: "Interpret as current priority, not rejection of relationships.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["core_need_signal","autonomy_need"], weights: { core_need_signal: 5, autonomy_need: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["core_need_signal","autonomy_need"], weights: { core_need_signal: 4, autonomy_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["core_need_signal"], weights: { core_need_signal: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["relationship_focus"], weights: { core_need_signal: 2, relationship_focus: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["relationship_focus"], weights: { core_need_signal: 1, relationship_focus: 5 } }
      ]
    },
    {
      id: "C02_Q19",
      section: "C",
      question_type: "scale",
      prompt_jp: "やりたいことはあるのに、最初の一歩が重く感じる。",
      prompt_cn: "明明有想做的事，但第一步感觉很重。",
      primary_dimension: "action_energy",
      secondary_dimension: "decision_style",
      sensitivity_level: "medium",
      public_private_note: "private aggregate only",
      risk_note: "Could imply low energy; not clinical.",
      interpretation_boundary: "Interpret as action-start state, not inability or disorder.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["action_energy","decision_style"], weights: { action_energy: 1, decision_style: 5 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["action_energy","decision_style"], weights: { action_energy: 2, decision_style: 4 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["action_energy"], weights: { action_energy: 3, decision_style: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["action_energy"], weights: { action_energy: 4, decision_style: 2 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["action_energy"], weights: { action_energy: 5, decision_style: 1 } }
      ]
    },
    {
      id: "C02_Q20",
      section: "C",
      question_type: "scale",
      prompt_jp: "今は、考えるより先に少し動いてみたい気持ちがある。",
      prompt_cn: "现在，我有一点想先动起来而不是继续思考。",
      primary_dimension: "action_energy",
      secondary_dimension: "next_step_readiness",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; action readiness only.",
      interpretation_boundary: "Interpret as readiness, not instruction to act.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["action_energy","next_step_readiness"], weights: { action_energy: 5, next_step_readiness: 5 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["action_energy","next_step_readiness"], weights: { action_energy: 4, next_step_readiness: 4 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["action_energy"], weights: { action_energy: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["reflection_need"], weights: { action_energy: 2, reflection_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["reflection_need"], weights: { action_energy: 1, reflection_need: 5 } }
      ]
    },
    {
      id: "C02_Q21",
      section: "C",
      question_type: "scale",
      prompt_jp: "選択肢が多いと、どれが自分に合うのか分からなくなりやすい。",
      prompt_cn: "选择太多时，我容易不知道哪个适合自己。",
      primary_dimension: "decision_style",
      secondary_dimension: "emotional_clarity",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; decision style only.",
      interpretation_boundary: "Interpret as choice processing, not decisiveness judgment.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["decision_style","emotional_clarity"], weights: { decision_style: 5, emotional_clarity: 2 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["decision_style","emotional_clarity"], weights: { decision_style: 4, emotional_clarity: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["decision_style"], weights: { decision_style: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["emotional_clarity"], weights: { decision_style: 2, emotional_clarity: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["emotional_clarity"], weights: { decision_style: 1, emotional_clarity: 5 } }
      ]
    },
    {
      id: "C02_Q22",
      section: "C",
      question_type: "scale",
      prompt_jp: "小さく試せる形があると、動き出しやすい。",
      prompt_cn: "如果能以小规模尝试的方式开始，我更容易行动。",
      primary_dimension: "next_step_readiness",
      secondary_dimension: "action_energy",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; trial preference only.",
      interpretation_boundary: "Interpret as action design, not advice or instruction.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["next_step_readiness","action_energy"], weights: { next_step_readiness: 5, action_energy: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["next_step_readiness","action_energy"], weights: { next_step_readiness: 4, action_energy: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["next_step_readiness"], weights: { next_step_readiness: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["reflection_need"], weights: { next_step_readiness: 2, reflection_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["reflection_need"], weights: { next_step_readiness: 1, reflection_need: 5 } }
      ]
    },
    {
      id: "C02_Q23",
      section: "C",
      question_type: "scale",
      prompt_jp: "今の迷いは、情報不足というより自分の気持ちの確認に近い。",
      prompt_cn: "我现在的犹豫，比起信息不足，更像是在确认自己的心情。",
      primary_dimension: "emotional_clarity",
      secondary_dimension: "reflection_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; reflection signal only.",
      interpretation_boundary: "Interpret as inner confirmation need, not indecision flaw.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["emotional_clarity","reflection_need"], weights: { emotional_clarity: 2, reflection_need: 5 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["emotional_clarity","reflection_need"], weights: { emotional_clarity: 3, reflection_need: 4 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["reflection_need"], weights: { emotional_clarity: 3, reflection_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["action_energy"], weights: { emotional_clarity: 4, action_energy: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["action_energy"], weights: { emotional_clarity: 5, action_energy: 5 } }
      ]
    },
    {
      id: "C02_Q24",
      section: "C",
      question_type: "scale",
      prompt_jp: "誰かに背中を押されると、今なら少し動けそうだ。",
      prompt_cn: "如果有人轻轻推我一下，现在我也许能动起来。",
      primary_dimension: "reassurance_need",
      secondary_dimension: "next_step_readiness",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; encouragement preference only.",
      interpretation_boundary: "Interpret as support for action, not dependence.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["reassurance_need","next_step_readiness"], weights: { reassurance_need: 5, next_step_readiness: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["reassurance_need","next_step_readiness"], weights: { reassurance_need: 4, next_step_readiness: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["reassurance_need"], weights: { reassurance_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["autonomy_need"], weights: { reassurance_need: 2, autonomy_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["autonomy_need"], weights: { reassurance_need: 1, autonomy_need: 5 } }
      ]
    },
    {
      id: "C02_Q25",
      section: "C",
      question_type: "scale",
      prompt_jp: "今は、正解を探すよりも違和感を減らしたい。",
      prompt_cn: "现在，比起寻找正确答案，我更想减少违和感。",
      primary_dimension: "core_need_signal",
      secondary_dimension: "decision_style",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; decision comfort only.",
      interpretation_boundary: "Interpret as fit-seeking, not truth or certainty.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["core_need_signal","decision_style"], weights: { core_need_signal: 5, decision_style: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["core_need_signal","decision_style"], weights: { core_need_signal: 4, decision_style: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["core_need_signal"], weights: { core_need_signal: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["action_energy"], weights: { core_need_signal: 2, action_energy: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["action_energy"], weights: { core_need_signal: 1, action_energy: 5 } }
      ]
    },
    {
      id: "C02_Q26",
      section: "C",
      question_type: "scale",
      prompt_jp: "仕事や役割のことが、今の状態に影響している感じがある。",
      prompt_cn: "我感觉工作或角色正在影响我现在的状态。",
      primary_dimension: "work_focus",
      secondary_dimension: "core_need_signal",
      sensitivity_level: "medium",
      public_private_note: "private aggregate only",
      risk_note: "Work-state signal; no career advice.",
      interpretation_boundary: "Interpret as work relevance, not job diagnosis or resignation cue.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["work_focus","core_need_signal"], weights: { work_focus: 5, core_need_signal: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["work_focus","core_need_signal"], weights: { work_focus: 4, core_need_signal: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["work_focus"], weights: { work_focus: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["relationship_focus"], weights: { work_focus: 2, relationship_focus: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["relationship_focus"], weights: { work_focus: 1, relationship_focus: 4 } }
      ]
    },
    {
      id: "C02_Q27",
      section: "C",
      question_type: "scale",
      prompt_jp: "恋愛や大切な人との関係が、今の状態に影響している感じがある。",
      prompt_cn: "我感觉恋爱或重要关系正在影响我现在的状态。",
      primary_dimension: "relationship_focus",
      secondary_dimension: "core_need_signal",
      sensitivity_level: "medium",
      public_private_note: "private aggregate only",
      risk_note: "Relationship-state signal; no compatibility judgment.",
      interpretation_boundary: "Interpret as relationship relevance, not relationship outcome prediction.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["relationship_focus","core_need_signal"], weights: { relationship_focus: 5, core_need_signal: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["relationship_focus","core_need_signal"], weights: { relationship_focus: 4, core_need_signal: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["relationship_focus"], weights: { relationship_focus: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["work_focus"], weights: { relationship_focus: 2, work_focus: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["work_focus"], weights: { relationship_focus: 1, work_focus: 4 } }
      ]
    },
    {
      id: "C02_Q28",
      section: "D",
      question_type: "scale",
      prompt_jp: "今の自分には、まず休むよりも方向を決めることが必要に感じる。",
      prompt_cn: "对现在的我来说，比起先休息，我感觉更需要确定方向。",
      primary_dimension: "next_step_readiness",
      secondary_dimension: "recovery_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; direction vs rest preference only.",
      interpretation_boundary: "Interpret as current felt need, not recommendation to ignore rest.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["next_step_readiness","recovery_need"], weights: { next_step_readiness: 5, recovery_need: 1 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["next_step_readiness","recovery_need"], weights: { next_step_readiness: 4, recovery_need: 2 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["next_step_readiness"], weights: { next_step_readiness: 3, recovery_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["recovery_need"], weights: { next_step_readiness: 2, recovery_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["recovery_need"], weights: { next_step_readiness: 1, recovery_need: 5 } }
      ]
    },
    {
      id: "C02_Q29",
      section: "D",
      question_type: "scale",
      prompt_jp: "今の自分には、方向を決めるよりも回復する時間が必要に感じる。",
      prompt_cn: "对现在的我来说，比起确定方向，我感觉更需要恢复时间。",
      primary_dimension: "recovery_need",
      secondary_dimension: "next_step_readiness",
      sensitivity_level: "medium",
      public_private_note: "private aggregate only",
      risk_note: "Recovery signal; avoid health or treatment framing.",
      interpretation_boundary: "Interpret as recovery preference, not medical need.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["recovery_need","next_step_readiness"], weights: { recovery_need: 5, next_step_readiness: 1 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["recovery_need","next_step_readiness"], weights: { recovery_need: 4, next_step_readiness: 2 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["recovery_need"], weights: { recovery_need: 3, next_step_readiness: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["next_step_readiness"], weights: { recovery_need: 2, next_step_readiness: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["next_step_readiness"], weights: { recovery_need: 1, next_step_readiness: 5 } }
      ]
    },
    {
      id: "C02_Q30",
      section: "D",
      question_type: "scale",
      prompt_jp: "生活のリズムを少し整えると、気持ちも戻りやすそうだ。",
      prompt_cn: "如果稍微整理生活节奏，我的心情也更容易回来。",
      primary_dimension: "rhythm_reset_need",
      secondary_dimension: "recovery_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; lifestyle rhythm signal only.",
      interpretation_boundary: "Interpret as rhythm support, not health advice.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["rhythm_reset_need","recovery_need"], weights: { rhythm_reset_need: 5, recovery_need: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["rhythm_reset_need","recovery_need"], weights: { rhythm_reset_need: 4, recovery_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["rhythm_reset_need"], weights: { rhythm_reset_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["action_energy"], weights: { rhythm_reset_need: 2, action_energy: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["action_energy"], weights: { rhythm_reset_need: 1, action_energy: 5 } }
      ]
    },
    {
      id: "C02_Q31",
      section: "D",
      question_type: "scale",
      prompt_jp: "今の自分には、少し遊びや余白がある方が戻りやすい。",
      prompt_cn: "对现在的我来说，有一点玩心和余白更容易恢复。",
      primary_dimension: "lightness_need",
      secondary_dimension: "recovery_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; lightness preference only.",
      interpretation_boundary: "Interpret as reflective entertainment fit, not avoidance.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["lightness_need","recovery_need"], weights: { lightness_need: 5, recovery_need: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["lightness_need","recovery_need"], weights: { lightness_need: 4, recovery_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["lightness_need"], weights: { lightness_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["reflection_need"], weights: { lightness_need: 2, reflection_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["reflection_need"], weights: { lightness_need: 1, reflection_need: 5 } }
      ]
    },
    {
      id: "C02_Q32",
      section: "D",
      question_type: "scale",
      prompt_jp: "今の状態をもう少し深く知るなら、時間をかけても見てみたい。",
      prompt_cn: "如果能更深入理解现在的状态，我愿意花一点时间看。",
      primary_dimension: "core_depth_intent",
      secondary_dimension: "reflection_need",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; deep-test intent only.",
      interpretation_boundary: "Interpret as 120-question readiness, not paid pressure.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["core_depth_intent","reflection_need"], weights: { core_depth_intent: 5, reflection_need: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["core_depth_intent","reflection_need"], weights: { core_depth_intent: 4, reflection_need: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["core_depth_intent"], weights: { core_depth_intent: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["lightness_need"], weights: { core_depth_intent: 2, lightness_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["lightness_need"], weights: { core_depth_intent: 1, lightness_need: 5 } }
      ]
    },
    {
      id: "C02_Q33",
      section: "D",
      question_type: "scale",
      prompt_jp: "今は、深い診断よりも今日の小さなヒントがある方が合っている。",
      prompt_cn: "现在，比起深度测试，我更适合看看今天的小提示。",
      primary_dimension: "lightness_need",
      secondary_dimension: "oracle_return_intent",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; oracle/asobi routing signal only.",
      interpretation_boundary: "Interpret as light return preference, not fortune belief.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["lightness_need","oracle_return_intent"], weights: { lightness_need: 5, oracle_return_intent: 5 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["lightness_need","oracle_return_intent"], weights: { lightness_need: 4, oracle_return_intent: 4 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["lightness_need"], weights: { lightness_need: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["core_depth_intent"], weights: { lightness_need: 2, core_depth_intent: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["core_depth_intent"], weights: { lightness_need: 1, core_depth_intent: 5 } }
      ]
    },
    {
      id: "C02_Q34",
      section: "D",
      question_type: "scale",
      prompt_jp: "自分の状態を、恋愛や人との相性からも見てみたい。",
      prompt_cn: "我也想从恋爱或人与人的相性角度看看自己的状态。",
      primary_dimension: "relationship_focus",
      secondary_dimension: "recommendation_intent",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Relationship recommendation signal; no outcome prediction.",
      interpretation_boundary: "Interpret as interest routing to R01, not relationship advice.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["relationship_focus","recommendation_intent"], weights: { relationship_focus: 5, recommendation_intent: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["relationship_focus","recommendation_intent"], weights: { relationship_focus: 4, recommendation_intent: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["relationship_focus"], weights: { relationship_focus: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["work_focus"], weights: { relationship_focus: 2, work_focus: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["work_focus"], weights: { relationship_focus: 1, work_focus: 4 } }
      ]
    },
    {
      id: "C02_Q35",
      section: "D",
      question_type: "scale",
      prompt_jp: "自分の状態を、働き方や役割の面からも見てみたい。",
      prompt_cn: "我也想从工作方式或角色角度看看自己的状态。",
      primary_dimension: "work_focus",
      secondary_dimension: "recommendation_intent",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Work recommendation signal; no career advice.",
      interpretation_boundary: "Interpret as interest routing to F01, not career decision.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["work_focus","recommendation_intent"], weights: { work_focus: 5, recommendation_intent: 4 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["work_focus","recommendation_intent"], weights: { work_focus: 4, recommendation_intent: 3 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["work_focus"], weights: { work_focus: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["relationship_focus"], weights: { work_focus: 2, relationship_focus: 3 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["relationship_focus"], weights: { work_focus: 1, relationship_focus: 4 } }
      ]
    },
    {
      id: "C02_Q36",
      section: "D",
      question_type: "scale",
      prompt_jp: "今の自分には、ひとつだけ小さな次の一歩があるとよさそうだ。",
      prompt_cn: "对现在的我来说，如果有一个小小的下一步会很好。",
      primary_dimension: "next_step_readiness",
      secondary_dimension: "recommendation_intent",
      sensitivity_level: "low",
      public_private_note: "aggregate only",
      risk_note: "Low risk; next-step preference only.",
      interpretation_boundary: "Interpret as gentle next-step readiness, not instruction or obligation.",
      options: [
        { key: "A", label_jp: "とても近い", label_cn: "非常符合", score_tags: ["next_step_readiness","recommendation_intent"], weights: { next_step_readiness: 5, recommendation_intent: 5 } },
        { key: "B", label_jp: "やや近い", label_cn: "比较符合", score_tags: ["next_step_readiness","recommendation_intent"], weights: { next_step_readiness: 4, recommendation_intent: 4 } },
        { key: "C", label_jp: "どちらともいえない", label_cn: "说不清", score_tags: ["next_step_readiness"], weights: { next_step_readiness: 3 } },
        { key: "D", label_jp: "あまり近くない", label_cn: "不太符合", score_tags: ["recovery_need"], weights: { next_step_readiness: 2, recovery_need: 4 } },
        { key: "E", label_jp: "まったく近くない", label_cn: "完全不符合", score_tags: ["recovery_need"], weights: { next_step_readiness: 1, recovery_need: 5 } }
      ]
    }
  ],

  result_types: [
    { id: "C02_A", display_name_jp: "そっと整える", display_name_cn: "轻轻整理型", short_label_jp: "整える時間", share_card_line_jp: "今は、少し整えることで戻りやすい状態。" },
    { id: "C02_B", display_name_jp: "内側を見たい", display_name_cn: "内在回看型", short_label_jp: "内側確認", share_card_line_jp: "外へ急ぐより、内側を見たいタイミング。" },
    { id: "C02_C", display_name_jp: "小さく動ける", display_name_cn: "小步行动型", short_label_jp: "小さな一歩", share_card_line_jp: "大きく変えず、小さく試すと動きやすい状態。" },
    { id: "C02_D", display_name_jp: "人にほどける", display_name_cn: "关系舒展型", short_label_jp: "つながり回復", share_card_line_jp: "人とのやわらかいつながりで戻りやすい状態。" },
    { id: "C02_E", display_name_jp: "距離を測り直す", display_name_cn: "距离重整型", short_label_jp: "距離調整", share_card_line_jp: "人との距離を少し測り直したい状態。" },
    { id: "C02_F", display_name_jp: "方向を探す", display_name_cn: "方向寻找型", short_label_jp: "方向確認", share_card_line_jp: "正解よりも、自分に合う方向を探している状態。" },
    { id: "C02_G", display_name_jp: "余白で戻る", display_name_cn: "余白恢复型", short_label_jp: "余白回復", share_card_line_jp: "深く考えすぎず、軽い余白で戻りやすい状態。" },
    { id: "C02_H", display_name_jp: "深く知りたい", display_name_cn: "深度理解型", short_label_jp: "深掘り準備", share_card_line_jp: "今の自分を、もう少し深く見てもよさそうな状態。" }
  ],

  result_assignment_rules: {
    C02_A: {
      display_name_jp: "そっと整える",
      primary_trigger_dimensions: ["recovery_need", "rhythm_reset_need"],
      secondary_trigger_dimensions: ["pace_sensitivity", "emotional_sensitivity"],
      confidence_requirement: "medium_or_high",
      low_confidence_fallback: "C02_F",
      forbidden_interpretation: "Do not say user needs treatment, rest cure, or medical recovery."
    },
    C02_B: {
      display_name_jp: "内側を見たい",
      primary_trigger_dimensions: ["reflection_need", "emotional_clarity"],
      secondary_trigger_dimensions: ["core_need_signal", "inner_temperature"],
      confidence_requirement: "medium_or_high",
      low_confidence_fallback: "C02_F",
      forbidden_interpretation: "Do not say user is withdrawn, closed, or psychologically unstable."
    },
    C02_C: {
      display_name_jp: "小さく動ける",
      primary_trigger_dimensions: ["action_energy", "next_step_readiness"],
      secondary_trigger_dimensions: ["change_readiness", "recommendation_intent"],
      confidence_requirement: "medium_or_high",
      low_confidence_fallback: "C02_F",
      forbidden_interpretation: "Do not instruct user to make major decisions."
    },
    C02_D: {
      display_name_jp: "人にほどける",
      primary_trigger_dimensions: ["connection_need", "reassurance_need"],
      secondary_trigger_dimensions: ["light_support_need", "relationship_focus"],
      confidence_requirement: "medium_or_high",
      low_confidence_fallback: "C02_A",
      forbidden_interpretation: "Do not say user depends on others or needs relationship intervention."
    },
    C02_E: {
      display_name_jp: "距離を測り直す",
      primary_trigger_dimensions: ["boundary_need", "autonomy_need"],
      secondary_trigger_dimensions: ["relationship_focus", "emotional_clarity"],
      confidence_requirement: "medium_or_high",
      low_confidence_fallback: "C02_F",
      forbidden_interpretation: "Do not advise cutting ties, ending relationships, or confronting someone."
    },
    C02_F: {
      display_name_jp: "方向を探す",
      primary_trigger_dimensions: ["decision_style", "core_need_signal"],
      secondary_trigger_dimensions: ["emotional_clarity", "next_step_readiness"],
      confidence_requirement: "low_or_medium_or_high",
      low_confidence_fallback: "C02_F",
      forbidden_interpretation: "Do not say user is lost, indecisive, or lacking direction."
    },
    C02_G: {
      display_name_jp: "余白で戻る",
      primary_trigger_dimensions: ["lightness_need", "oracle_return_intent"],
      secondary_trigger_dimensions: ["recovery_need", "light_support_need"],
      confidence_requirement: "medium_or_high",
      low_confidence_fallback: "C02_A",
      forbidden_interpretation: "Do not frame oracle/asobi as prediction or fate."
    },
    C02_H: {
      display_name_jp: "深く知りたい",
      primary_trigger_dimensions: ["core_depth_intent", "reflection_need"],
      secondary_trigger_dimensions: ["core_need_signal", "emotional_clarity"],
      confidence_requirement: "medium_or_high",
      low_confidence_fallback: "C02_F",
      forbidden_interpretation: "Do not pressure user into 120問 or paid report."
    }
  },

  free_result_config: {
    order: ["score", "type", "visible_tendency_1", "visible_tendency_2", "friction_1", "small_question", "core_cta", "next_test_recommendation", "share_card"],
    score_label_jp: "今の状態参考スコア",
    share_cta_jp: "今のわたしタイプをシェアする",
    core_bridge_copy_jp: "このチェックは、今の状態を見る入口です。もっと深く自分の Life-State を見たい場合は、120問ライフステート診断へ進めます。"
  },

  paid_teaser_config: {
    report_name_jp: "今のわたし深掘りレポート",
    promise_jp: "今のあなたの状態、内側の温度、人との距離、動き出しやすい条件、戻りやすい方法を整理します。",
    forbidden_copy: [
      "今すぐ見ないと悪化します",
      "あなたは危険な状態です",
      "この結果は専門的な心理診断です",
      "この通りに行動してください",
      "これで人生が変わります",
      "あなたの本当の性格が分かります"
    ]
  },

  share_card_config: {
    versions: {
      type_focus: {
        card_title_jp: "今のわたしチェック",
        visible_fields: ["type_label", "safe_one_line", "qr_or_link"],
        forbidden_fields: ["private_answers", "emotional_vulnerability", "reassurance_need", "relationship_friction", "paid_report_content"]
      },
      soft_score_focus: {
        card_title_jp: "今の状態参考スコア",
        visible_fields: ["score", "type_label", "one_safe_strength"],
        forbidden_fields: ["diagnosis_implication", "weakness", "clinical_labels", "anxiety_language"]
      },
      core_bridge_focus: {
        card_title_jp: "今のわたしから、深い自分へ",
        visible_fields: ["type", "core_bridge_line", "cta"],
        forbidden_fields: ["pressure", "urgency", "fake_authority", "paid_only_framing"]
      }
    }
  },

  consent_copy: {
    boundary_jp: "このチェックは医療・心理診断ではありません。今の状態を整理するための参考です。",
    save_copy_jp: "結果を保存する場合は、保存範囲を確認してください。",
    reminder_opt_in_jp: "リマインドは希望した場合のみ受け取れます。"
  },

  recommendation_mapping: [
    { recommendation_type: "120問ライフステート診断", trigger_condition: "core_depth_intent high or C02_H assigned", reason_copy_jp: "今の状態を、もっと深い Life-State として見てみませんか。", commercial_status: "free / core / later report bridge", disclosure_needed: false },
    { recommendation_type: "R01 ふたり恋愛相性診断", trigger_condition: "relationship_focus high", reason_copy_jp: "今の状態に大切な人との距離が関係していそうなら、ふたりのリズムも見られます。", commercial_status: "free / paid report bridge", disclosure_needed: false },
    { recommendation_type: "F01 向いている働き方診断", trigger_condition: "work_focus high", reason_copy_jp: "仕事や役割が今の状態に影響していそうなら、働き方のリズムも見てみませんか。", commercial_status: "free / paid report bridge", disclosure_needed: false },
    { recommendation_type: "S01 今日のおみくじ", trigger_condition: "lightness_need or oracle_return_intent high", reason_copy_jp: "深く考えすぎず、今日の小さなヒントを見てみるのも合いそうです。", commercial_status: "free / recurring", disclosure_needed: false },
    { recommendation_type: "今のわたし深掘りレポート", trigger_condition: "paid report CTA click", reason_copy_jp: "今の状態を、もう少し丁寧に整理できます。", commercial_status: "paid report", disclosure_needed: true }
  ],

  line_web_return_path: {
    save_after_completion: {
      copy_jp: "結果を保存する",
      rule: "Do not claim account/cloud save unless actually available."
    },
    three_day_follow_up: {
      opt_in_required: true,
      copy_jp: "この前の「今のわたし」から、少し変わった感じはありますか？"
    },
    seven_day_follow_up: {
      opt_in_required: true,
      copy_jp: "今週のあなたは、整える・動く・話す・休むのどれが近そうですか？"
    },
    thirty_day_follow_up: {
      opt_in_required: true,
      copy_jp: "前回の状態から少し時間が経ちました。今のわたしをもう一度見てみますか？"
    },
    disturbance_prevention: [
      "Default reminders off.",
      "Separate opt-in required.",
      "No crisis language.",
      "No fake urgency."
    ]
  },

  ux_notes: {
    mobile_first_flow: "One question per screen or compact stacked cards.",
    progress_behavior: "Show section title and 1/36 progress.",
    section_break_behavior: "Show section break copy after every 9 questions.",
    result_reveal_behavior: "Show type first, then two tendencies, one friction, one small question.",
    paid_report_preview: "Explain concrete additions without fear or diagnosis.",
    share_behavior: "Only share public-safe type and one-line description.",
    retake_behavior: "Recommend 2-4 week retake or when state changes.",
    core_bridge: "Always include 120問 Life-State CTA.",
    recommendation_rule: "Show only one additional test recommendation based on strongest signal.",
    anti_supermarket_rule: "Never show all categories at once from C02 result page."
  },

  risk_notes: [
    "No medical or psychological diagnosis.",
    "No symptom screening.",
    "No treatment advice.",
    "No crisis implication.",
    "No deterministic identity label.",
    "No future prediction.",
    "No relationship outcome judgment.",
    "No career decision advice.",
    "No private vulnerability in share cards.",
    "No fake urgency, scarcity, authority, or accuracy claim.",
    "LINE/Web reminders require separate opt-in."
  ]
};
