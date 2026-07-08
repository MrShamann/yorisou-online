export const r01FutariRenaiAishoShindanV13 = {
  "test_id": "R01",
  "version": "v1.3",
  "codex_ready": false,
  "review_status": "review_required",
  "test_name_jp": "ふたり恋愛相性診断",
  "slug": "futari-renai-aisho-shindan",
  "category": "relationship_compatibility",
  "route": "/tests/r01",
  "language": "ja-JP",
  "market": "Japan first / mobile first",
  "question_count_total": 60,
  "question_count_per_person": 30,
  "answer_format": "two_choice_per_question",
  "dimensions": [
    {
      "id": "pace",
      "label": "関係ペース",
      "description": "距離を縮める速度、返事の速さ、会う頻度の心地よさ"
    },
    {
      "id": "expression",
      "label": "愛情表現",
      "description": "言葉・行動・接触・気配りなど、好意の伝え方"
    },
    {
      "id": "autonomy",
      "label": "自分時間",
      "description": "ひとり時間、予定の自由度、干渉されなさの必要度"
    },
    {
      "id": "conflict",
      "label": "すれ違い対応",
      "description": "違和感・不満・沈黙・話し合いへの向き合い方"
    },
    {
      "id": "stability",
      "label": "安心設計",
      "description": "約束、将来感、生活リズム、信頼の積み上げ方"
    },
    {
      "id": "stimulation",
      "label": "刺激と遊び心",
      "description": "新しさ、外出、変化、イベント、楽しさへの欲求"
    },
    {
      "id": "care",
      "label": "気遣い密度",
      "description": "相手の変化に気づく力、支える/支えられる感覚"
    },
    {
      "id": "decision",
      "label": "決め方",
      "description": "予定・お金・暮らし・次の一歩の決め方"
    }
  ],
  "questions": [
    {
      "id": "R01_Q01_A",
      "person": "A",
      "prompt": "連絡の頻度でいちばん落ち着くのは？",
      "options": [
        {
          "label": "A",
          "text": "毎日少しでもつながっていたい",
          "score": {
            "pace": 2,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "必要なときに自然に話せればいい",
          "score": {
            "autonomy": 2,
            "pace": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q02_A",
      "person": "A",
      "prompt": "会う予定を決めるとき、近い感覚は？",
      "options": [
        {
          "label": "A",
          "text": "早めに決めて安心したい",
          "score": {
            "stability": 2,
            "decision": 1
          }
        },
        {
          "label": "B",
          "text": "その時の流れで決めたい",
          "score": {
            "stimulation": 1,
            "autonomy": 1,
            "stability": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q03_A",
      "person": "A",
      "prompt": "好きな人への愛情表現は？",
      "options": [
        {
          "label": "A",
          "text": "言葉やメッセージでちゃんと伝えたい",
          "score": {
            "expression": 2,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "行動や態度で伝わればいい",
          "score": {
            "stability": 1,
            "expression": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q04_A",
      "person": "A",
      "prompt": "相手が少し元気なさそうなときは？",
      "options": [
        {
          "label": "A",
          "text": "すぐ気づいて声をかけたい",
          "score": {
            "care": 2,
            "expression": 1
          }
        },
        {
          "label": "B",
          "text": "少し様子を見て、必要なら支えたい",
          "score": {
            "autonomy": 1,
            "conflict": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q05_A",
      "person": "A",
      "prompt": "デートで心地いいのは？",
      "options": [
        {
          "label": "A",
          "text": "落ち着いた場所でゆっくり話す",
          "score": {
            "stability": 1,
            "care": 1,
            "stimulation": -1
          }
        },
        {
          "label": "B",
          "text": "新しい場所や体験を一緒に楽しむ",
          "score": {
            "stimulation": 2,
            "pace": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q06_A",
      "person": "A",
      "prompt": "ひとり時間について近いのは？",
      "options": [
        {
          "label": "A",
          "text": "恋人がいてもかなり大事にしたい",
          "score": {
            "autonomy": 2,
            "pace": -1
          }
        },
        {
          "label": "B",
          "text": "できれば一緒に過ごす時間を多めにしたい",
          "score": {
            "pace": 1,
            "care": 1,
            "autonomy": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q07_A",
      "person": "A",
      "prompt": "小さな違和感があるときは？",
      "options": [
        {
          "label": "A",
          "text": "早めに言葉にして整えたい",
          "score": {
            "conflict": 2,
            "decision": 1
          }
        },
        {
          "label": "B",
          "text": "自分の中で整理してから話したい",
          "score": {
            "autonomy": 1,
            "conflict": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q08_A",
      "person": "A",
      "prompt": "恋愛で安心するのは？",
      "options": [
        {
          "label": "A",
          "text": "約束や態度が安定していること",
          "score": {
            "stability": 2,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "楽しく自然体でいられること",
          "score": {
            "stimulation": 1,
            "autonomy": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q09_A",
      "person": "A",
      "prompt": "返信が遅い相手に対しては？",
      "options": [
        {
          "label": "A",
          "text": "少し不安になりやすい",
          "score": {
            "pace": 1,
            "care": 1,
            "stability": 1
          }
        },
        {
          "label": "B",
          "text": "理由があればあまり気にしない",
          "score": {
            "autonomy": 2,
            "stability": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q10_A",
      "person": "A",
      "prompt": "相手との距離が近づくタイミングは？",
      "options": [
        {
          "label": "A",
          "text": "早い段階で深く知りたい",
          "score": {
            "pace": 2,
            "expression": 1
          }
        },
        {
          "label": "B",
          "text": "時間をかけて自然に近づきたい",
          "score": {
            "stability": 1,
            "autonomy": 1,
            "pace": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q11_A",
      "person": "A",
      "prompt": "恋人との予定が急に変わったら？",
      "options": [
        {
          "label": "A",
          "text": "少し乱れるので説明がほしい",
          "score": {
            "stability": 2,
            "conflict": 1
          }
        },
        {
          "label": "B",
          "text": "大きな理由がなければ柔軟に合わせる",
          "score": {
            "autonomy": 1,
            "stimulation": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q12_A",
      "person": "A",
      "prompt": "記念日や節目については？",
      "options": [
        {
          "label": "A",
          "text": "大切にすると関係が深まると思う",
          "score": {
            "expression": 1,
            "stability": 2
          }
        },
        {
          "label": "B",
          "text": "自然で無理がなければ十分だと思う",
          "score": {
            "autonomy": 1,
            "stimulation": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q13_A",
      "person": "A",
      "prompt": "恋人に頼ることについては？",
      "options": [
        {
          "label": "A",
          "text": "困ったときはちゃんと頼り合いたい",
          "score": {
            "care": 2,
            "stability": 1
          }
        },
        {
          "label": "B",
          "text": "まず自分で整えてから相談したい",
          "score": {
            "autonomy": 2,
            "care": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q14_A",
      "person": "A",
      "prompt": "相手の交友関係については？",
      "options": [
        {
          "label": "A",
          "text": "ある程度知っていると安心する",
          "score": {
            "stability": 1,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "信頼して、それぞれ自由でいたい",
          "score": {
            "autonomy": 2,
            "stability": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q15_A",
      "person": "A",
      "prompt": "話し合いで大事だと思うのは？",
      "options": [
        {
          "label": "A",
          "text": "曖昧にせず、言葉で確認すること",
          "score": {
            "conflict": 2,
            "decision": 1
          }
        },
        {
          "label": "B",
          "text": "責めずに空気を悪くしすぎないこと",
          "score": {
            "care": 1,
            "conflict": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q16_A",
      "person": "A",
      "prompt": "恋愛の楽しさはどこにある？",
      "options": [
        {
          "label": "A",
          "text": "日常の中で安心が増えること",
          "score": {
            "stability": 2,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "新しい自分や世界が広がること",
          "score": {
            "stimulation": 2,
            "pace": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q17_A",
      "person": "A",
      "prompt": "相手にしてもらうと嬉しいのは？",
      "options": [
        {
          "label": "A",
          "text": "気持ちを言葉で伝えてくれる",
          "score": {
            "expression": 2,
            "pace": 1
          }
        },
        {
          "label": "B",
          "text": "具体的に助けたり動いてくれる",
          "score": {
            "care": 1,
            "stability": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q18_A",
      "person": "A",
      "prompt": "忙しい時期の関係で近いのは？",
      "options": [
        {
          "label": "A",
          "text": "短くても連絡を保ちたい",
          "score": {
            "pace": 2,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "忙しい時期はお互い集中したい",
          "score": {
            "autonomy": 2,
            "pace": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q19_A",
      "person": "A",
      "prompt": "将来の話をするタイミングは？",
      "options": [
        {
          "label": "A",
          "text": "ある程度早めに方向感を知りたい",
          "score": {
            "stability": 2,
            "decision": 1
          }
        },
        {
          "label": "B",
          "text": "関係が育ってから自然に話したい",
          "score": {
            "pace": -1,
            "autonomy": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q20_A",
      "person": "A",
      "prompt": "相手と意見が違うときは？",
      "options": [
        {
          "label": "A",
          "text": "違いを整理して着地点を探したい",
          "score": {
            "conflict": 2,
            "decision": 2
          }
        },
        {
          "label": "B",
          "text": "無理に結論を急がず、少し置きたい",
          "score": {
            "autonomy": 1,
            "conflict": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q21_A",
      "person": "A",
      "prompt": "恋愛で苦手なのは？",
      "options": [
        {
          "label": "A",
          "text": "距離が読めず不安になること",
          "score": {
            "pace": 1,
            "stability": 1,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "期待されすぎて自由が減ること",
          "score": {
            "autonomy": 2,
            "pace": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q22_A",
      "person": "A",
      "prompt": "一緒にいる時間で重視するのは？",
      "options": [
        {
          "label": "A",
          "text": "深く話せること",
          "score": {
            "care": 1,
            "expression": 1,
            "stability": 1
          }
        },
        {
          "label": "B",
          "text": "気楽に笑えること",
          "score": {
            "stimulation": 1,
            "autonomy": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q23_A",
      "person": "A",
      "prompt": "相手への小さな不満は？",
      "options": [
        {
          "label": "A",
          "text": "溜めずに少しずつ伝える",
          "score": {
            "conflict": 2,
            "expression": 1
          }
        },
        {
          "label": "B",
          "text": "自分で消化できるものは流す",
          "score": {
            "autonomy": 1,
            "care": 1,
            "conflict": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q24_A",
      "person": "A",
      "prompt": "旅行や遠出の計画は？",
      "options": [
        {
          "label": "A",
          "text": "細かく決めると楽しめる",
          "score": {
            "stability": 1,
            "decision": 2
          }
        },
        {
          "label": "B",
          "text": "余白があるほうが楽しい",
          "score": {
            "stimulation": 2,
            "autonomy": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q25_A",
      "person": "A",
      "prompt": "恋人に期待する距離感は？",
      "options": [
        {
          "label": "A",
          "text": "近くにいてくれる安心感",
          "score": {
            "pace": 1,
            "care": 2
          }
        },
        {
          "label": "B",
          "text": "近すぎず信頼できる自由さ",
          "score": {
            "autonomy": 2,
            "stability": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q26_A",
      "person": "A",
      "prompt": "感情が揺れたときは？",
      "options": [
        {
          "label": "A",
          "text": "その場で共有したくなる",
          "score": {
            "expression": 2,
            "pace": 1
          }
        },
        {
          "label": "B",
          "text": "落ち着いてから伝えたい",
          "score": {
            "autonomy": 1,
            "conflict": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q27_A",
      "person": "A",
      "prompt": "相手が新しい提案をしてきたら？",
      "options": [
        {
          "label": "A",
          "text": "面白そうなら乗ってみたい",
          "score": {
            "stimulation": 2,
            "pace": 1
          }
        },
        {
          "label": "B",
          "text": "無理がないか確認してから決めたい",
          "score": {
            "stability": 1,
            "decision": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q28_A",
      "person": "A",
      "prompt": "関係が長く続く鍵は？",
      "options": [
        {
          "label": "A",
          "text": "安心できる習慣を積み上げること",
          "score": {
            "stability": 2,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "変化を楽しみながら飽きさせないこと",
          "score": {
            "stimulation": 2,
            "expression": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q29_A",
      "person": "A",
      "prompt": "相手にわかってほしいことは？",
      "options": [
        {
          "label": "A",
          "text": "気持ちは言葉にしないと伝わりにくい",
          "score": {
            "expression": 2,
            "conflict": 1
          }
        },
        {
          "label": "B",
          "text": "言葉より空気や行動で伝わる部分もある",
          "score": {
            "care": 1,
            "stability": 1,
            "expression": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q30_A",
      "person": "A",
      "prompt": "理想の恋愛の温度感は？",
      "options": [
        {
          "label": "A",
          "text": "近くてあたたかい関係",
          "score": {
            "pace": 2,
            "care": 2
          }
        },
        {
          "label": "B",
          "text": "近いけれど余白もある関係",
          "score": {
            "autonomy": 2,
            "stability": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q01_B",
      "person": "B",
      "prompt": "連絡の頻度でいちばん落ち着くのは？",
      "options": [
        {
          "label": "A",
          "text": "毎日少しでもつながっていたい",
          "score": {
            "pace": 2,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "必要なときに自然に話せればいい",
          "score": {
            "autonomy": 2,
            "pace": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q02_B",
      "person": "B",
      "prompt": "会う予定を決めるとき、近い感覚は？",
      "options": [
        {
          "label": "A",
          "text": "早めに決めて安心したい",
          "score": {
            "stability": 2,
            "decision": 1
          }
        },
        {
          "label": "B",
          "text": "その時の流れで決めたい",
          "score": {
            "stimulation": 1,
            "autonomy": 1,
            "stability": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q03_B",
      "person": "B",
      "prompt": "好きな人への愛情表現は？",
      "options": [
        {
          "label": "A",
          "text": "言葉やメッセージでちゃんと伝えたい",
          "score": {
            "expression": 2,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "行動や態度で伝わればいい",
          "score": {
            "stability": 1,
            "expression": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q04_B",
      "person": "B",
      "prompt": "相手が少し元気なさそうなときは？",
      "options": [
        {
          "label": "A",
          "text": "すぐ気づいて声をかけたい",
          "score": {
            "care": 2,
            "expression": 1
          }
        },
        {
          "label": "B",
          "text": "少し様子を見て、必要なら支えたい",
          "score": {
            "autonomy": 1,
            "conflict": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q05_B",
      "person": "B",
      "prompt": "デートで心地いいのは？",
      "options": [
        {
          "label": "A",
          "text": "落ち着いた場所でゆっくり話す",
          "score": {
            "stability": 1,
            "care": 1,
            "stimulation": -1
          }
        },
        {
          "label": "B",
          "text": "新しい場所や体験を一緒に楽しむ",
          "score": {
            "stimulation": 2,
            "pace": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q06_B",
      "person": "B",
      "prompt": "ひとり時間について近いのは？",
      "options": [
        {
          "label": "A",
          "text": "恋人がいてもかなり大事にしたい",
          "score": {
            "autonomy": 2,
            "pace": -1
          }
        },
        {
          "label": "B",
          "text": "できれば一緒に過ごす時間を多めにしたい",
          "score": {
            "pace": 1,
            "care": 1,
            "autonomy": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q07_B",
      "person": "B",
      "prompt": "小さな違和感があるときは？",
      "options": [
        {
          "label": "A",
          "text": "早めに言葉にして整えたい",
          "score": {
            "conflict": 2,
            "decision": 1
          }
        },
        {
          "label": "B",
          "text": "自分の中で整理してから話したい",
          "score": {
            "autonomy": 1,
            "conflict": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q08_B",
      "person": "B",
      "prompt": "恋愛で安心するのは？",
      "options": [
        {
          "label": "A",
          "text": "約束や態度が安定していること",
          "score": {
            "stability": 2,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "楽しく自然体でいられること",
          "score": {
            "stimulation": 1,
            "autonomy": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q09_B",
      "person": "B",
      "prompt": "返信が遅い相手に対しては？",
      "options": [
        {
          "label": "A",
          "text": "少し不安になりやすい",
          "score": {
            "pace": 1,
            "care": 1,
            "stability": 1
          }
        },
        {
          "label": "B",
          "text": "理由があればあまり気にしない",
          "score": {
            "autonomy": 2,
            "stability": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q10_B",
      "person": "B",
      "prompt": "相手との距離が近づくタイミングは？",
      "options": [
        {
          "label": "A",
          "text": "早い段階で深く知りたい",
          "score": {
            "pace": 2,
            "expression": 1
          }
        },
        {
          "label": "B",
          "text": "時間をかけて自然に近づきたい",
          "score": {
            "stability": 1,
            "autonomy": 1,
            "pace": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q11_B",
      "person": "B",
      "prompt": "恋人との予定が急に変わったら？",
      "options": [
        {
          "label": "A",
          "text": "少し乱れるので説明がほしい",
          "score": {
            "stability": 2,
            "conflict": 1
          }
        },
        {
          "label": "B",
          "text": "大きな理由がなければ柔軟に合わせる",
          "score": {
            "autonomy": 1,
            "stimulation": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q12_B",
      "person": "B",
      "prompt": "記念日や節目については？",
      "options": [
        {
          "label": "A",
          "text": "大切にすると関係が深まると思う",
          "score": {
            "expression": 1,
            "stability": 2
          }
        },
        {
          "label": "B",
          "text": "自然で無理がなければ十分だと思う",
          "score": {
            "autonomy": 1,
            "stimulation": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q13_B",
      "person": "B",
      "prompt": "恋人に頼ることについては？",
      "options": [
        {
          "label": "A",
          "text": "困ったときはちゃんと頼り合いたい",
          "score": {
            "care": 2,
            "stability": 1
          }
        },
        {
          "label": "B",
          "text": "まず自分で整えてから相談したい",
          "score": {
            "autonomy": 2,
            "care": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q14_B",
      "person": "B",
      "prompt": "相手の交友関係については？",
      "options": [
        {
          "label": "A",
          "text": "ある程度知っていると安心する",
          "score": {
            "stability": 1,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "信頼して、それぞれ自由でいたい",
          "score": {
            "autonomy": 2,
            "stability": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q15_B",
      "person": "B",
      "prompt": "話し合いで大事だと思うのは？",
      "options": [
        {
          "label": "A",
          "text": "曖昧にせず、言葉で確認すること",
          "score": {
            "conflict": 2,
            "decision": 1
          }
        },
        {
          "label": "B",
          "text": "責めずに空気を悪くしすぎないこと",
          "score": {
            "care": 1,
            "conflict": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q16_B",
      "person": "B",
      "prompt": "恋愛の楽しさはどこにある？",
      "options": [
        {
          "label": "A",
          "text": "日常の中で安心が増えること",
          "score": {
            "stability": 2,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "新しい自分や世界が広がること",
          "score": {
            "stimulation": 2,
            "pace": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q17_B",
      "person": "B",
      "prompt": "相手にしてもらうと嬉しいのは？",
      "options": [
        {
          "label": "A",
          "text": "気持ちを言葉で伝えてくれる",
          "score": {
            "expression": 2,
            "pace": 1
          }
        },
        {
          "label": "B",
          "text": "具体的に助けたり動いてくれる",
          "score": {
            "care": 1,
            "stability": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q18_B",
      "person": "B",
      "prompt": "忙しい時期の関係で近いのは？",
      "options": [
        {
          "label": "A",
          "text": "短くても連絡を保ちたい",
          "score": {
            "pace": 2,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "忙しい時期はお互い集中したい",
          "score": {
            "autonomy": 2,
            "pace": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q19_B",
      "person": "B",
      "prompt": "将来の話をするタイミングは？",
      "options": [
        {
          "label": "A",
          "text": "ある程度早めに方向感を知りたい",
          "score": {
            "stability": 2,
            "decision": 1
          }
        },
        {
          "label": "B",
          "text": "関係が育ってから自然に話したい",
          "score": {
            "pace": -1,
            "autonomy": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q20_B",
      "person": "B",
      "prompt": "相手と意見が違うときは？",
      "options": [
        {
          "label": "A",
          "text": "違いを整理して着地点を探したい",
          "score": {
            "conflict": 2,
            "decision": 2
          }
        },
        {
          "label": "B",
          "text": "無理に結論を急がず、少し置きたい",
          "score": {
            "autonomy": 1,
            "conflict": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q21_B",
      "person": "B",
      "prompt": "恋愛で苦手なのは？",
      "options": [
        {
          "label": "A",
          "text": "距離が読めず不安になること",
          "score": {
            "pace": 1,
            "stability": 1,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "期待されすぎて自由が減ること",
          "score": {
            "autonomy": 2,
            "pace": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q22_B",
      "person": "B",
      "prompt": "一緒にいる時間で重視するのは？",
      "options": [
        {
          "label": "A",
          "text": "深く話せること",
          "score": {
            "care": 1,
            "expression": 1,
            "stability": 1
          }
        },
        {
          "label": "B",
          "text": "気楽に笑えること",
          "score": {
            "stimulation": 1,
            "autonomy": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q23_B",
      "person": "B",
      "prompt": "相手への小さな不満は？",
      "options": [
        {
          "label": "A",
          "text": "溜めずに少しずつ伝える",
          "score": {
            "conflict": 2,
            "expression": 1
          }
        },
        {
          "label": "B",
          "text": "自分で消化できるものは流す",
          "score": {
            "autonomy": 1,
            "care": 1,
            "conflict": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q24_B",
      "person": "B",
      "prompt": "旅行や遠出の計画は？",
      "options": [
        {
          "label": "A",
          "text": "細かく決めると楽しめる",
          "score": {
            "stability": 1,
            "decision": 2
          }
        },
        {
          "label": "B",
          "text": "余白があるほうが楽しい",
          "score": {
            "stimulation": 2,
            "autonomy": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q25_B",
      "person": "B",
      "prompt": "恋人に期待する距離感は？",
      "options": [
        {
          "label": "A",
          "text": "近くにいてくれる安心感",
          "score": {
            "pace": 1,
            "care": 2
          }
        },
        {
          "label": "B",
          "text": "近すぎず信頼できる自由さ",
          "score": {
            "autonomy": 2,
            "stability": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q26_B",
      "person": "B",
      "prompt": "感情が揺れたときは？",
      "options": [
        {
          "label": "A",
          "text": "その場で共有したくなる",
          "score": {
            "expression": 2,
            "pace": 1
          }
        },
        {
          "label": "B",
          "text": "落ち着いてから伝えたい",
          "score": {
            "autonomy": 1,
            "conflict": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q27_B",
      "person": "B",
      "prompt": "相手が新しい提案をしてきたら？",
      "options": [
        {
          "label": "A",
          "text": "面白そうなら乗ってみたい",
          "score": {
            "stimulation": 2,
            "pace": 1
          }
        },
        {
          "label": "B",
          "text": "無理がないか確認してから決めたい",
          "score": {
            "stability": 1,
            "decision": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q28_B",
      "person": "B",
      "prompt": "関係が長く続く鍵は？",
      "options": [
        {
          "label": "A",
          "text": "安心できる習慣を積み上げること",
          "score": {
            "stability": 2,
            "care": 1
          }
        },
        {
          "label": "B",
          "text": "変化を楽しみながら飽きさせないこと",
          "score": {
            "stimulation": 2,
            "expression": 1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q29_B",
      "person": "B",
      "prompt": "相手にわかってほしいことは？",
      "options": [
        {
          "label": "A",
          "text": "気持ちは言葉にしないと伝わりにくい",
          "score": {
            "expression": 2,
            "conflict": 1
          }
        },
        {
          "label": "B",
          "text": "言葉より空気や行動で伝わる部分もある",
          "score": {
            "care": 1,
            "stability": 1,
            "expression": -1
          }
        }
      ],
      "sensitivity": "low"
    },
    {
      "id": "R01_Q30_B",
      "person": "B",
      "prompt": "理想の恋愛の温度感は？",
      "options": [
        {
          "label": "A",
          "text": "近くてあたたかい関係",
          "score": {
            "pace": 2,
            "care": 2
          }
        },
        {
          "label": "B",
          "text": "近いけれど余白もある関係",
          "score": {
            "autonomy": 2,
            "stability": 1
          }
        }
      ],
      "sensitivity": "low"
    }
  ],
  "result_types": [
    {
      "id": "R01_RES_STABLE_HOME",
      "name": "安心を育てるふたり",
      "summary": "派手さよりも、日々の信頼を少しずつ積み上げる相性。",
      "dims": [
        "stability",
        "care"
      ],
      "bullets": [
        "約束や態度の安定が関係の土台になりやすい",
        "急な変化より、予測できるやさしさが効きやすい",
        "小さな確認を重ねるほど安心が深まる"
      ],
      "private": "ふたりの関係は、刺激よりも「ちゃんと戻れる場所」を作ることで強くなります。曖昧な不安を放置せず、生活リズムや連絡の温度を早めに合わせると、関係が静かに安定します。",
      "report": "安心の作り方、約束の扱い、すれ違い時の戻り方を中心に深掘り。"
    },
    {
      "id": "R01_RES_SPARK_PAIR",
      "name": "刺激でひらくふたり",
      "summary": "新しい体験や軽い遊び心が、距離を自然に縮める相性。",
      "dims": [
        "stimulation",
        "pace"
      ],
      "bullets": [
        "一緒に新しい場所へ行くと関係が動きやすい",
        "重い確認より、楽しい体験から本音が出やすい",
        "マンネリを避ける工夫が関係の栄養になる"
      ],
      "private": "ふたりは「楽しいから近づく」力が強い組み合わせです。ただし勢いだけで大事な確認を飛ばすと、あとで温度差が出やすい。遊び心の中に小さな約束を混ぜると安定します。",
      "report": "刺激・予定・自由度・安心確認のバランスを分析。"
    },
    {
      "id": "R01_RES_GENTLE_DISTANCE",
      "name": "余白を守るふたり",
      "summary": "近すぎない距離が、むしろ信頼を育てやすい相性。",
      "dims": [
        "autonomy",
        "stability"
      ],
      "bullets": [
        "それぞれの時間を尊重できるほど関係が続きやすい",
        "束縛より信頼のルールが効きやすい",
        "連絡や予定は少なめでも質が大事"
      ],
      "private": "ふたりに必要なのは、常に一緒にいることではなく、離れていても疑わなくてよい設計です。自由を放置に見せないために、最低限の共有ルールを持つと誤解が減ります。",
      "report": "自分時間、連絡頻度、自由と安心の線引きを整理。"
    },
    {
      "id": "R01_RES_DEEP_TALK",
      "name": "言葉で深まるふたり",
      "summary": "気持ちや違和感を言葉にするほど、関係が整いやすい相性。",
      "dims": [
        "expression",
        "conflict"
      ],
      "bullets": [
        "話し合いで距離が縮まりやすい",
        "小さな違和感を早めに言語化すると強い",
        "沈黙より確認が安心につながる"
      ],
      "private": "ふたりは、黙って察するよりも言葉で橋をかけるほうが合っています。ただし正しさの確認に寄りすぎると疲れやすい。話す時間と、ただ一緒にいる時間の両方が必要です。",
      "report": "言葉の温度、話し合いの順序、確認しすぎを防ぐ設計を深掘り。"
    },
    {
      "id": "R01_RES_CARE_MIRROR",
      "name": "気づき合うふたり",
      "summary": "相手の小さな変化に気づき、支え合うことで育つ相性。",
      "dims": [
        "care",
        "expression"
      ],
      "bullets": [
        "細かな気遣いが信頼に変わりやすい",
        "相手の調子を読む力が関係の強みになる",
        "支えすぎ・察しすぎには注意が必要"
      ],
      "private": "ふたりは、言葉にならない変化を拾う力があります。一方で、察する側が疲れたり、察してもらう前提になったりするとズレます。やさしさを言葉で確認する習慣が必要です。",
      "report": "気遣いの偏り、支え方、頼り方、疲れのサインを分析。"
    },
    {
      "id": "R01_RES_DECISION_TEAM",
      "name": "一緒に決めるふたり",
      "summary": "予定や選択を一緒に整理するほど、安心と納得が増える相性。",
      "dims": [
        "decision",
        "conflict"
      ],
      "bullets": [
        "結論までのプロセスを共有すると強い",
        "曖昧なまま進めるより、選択肢を並べるほうが合う",
        "決め方の癖を知ると衝突が減る"
      ],
      "private": "ふたりは、感情だけでなく「どう決めるか」を共有すると関係が安定します。どちらかが主導しすぎるより、選択肢・期限・譲れる点を見える化するのが有効です。",
      "report": "予定、将来感、お金、暮らしの決め方を中心に整理。"
    },
    {
      "id": "R01_RES_WARM_PACE",
      "name": "温度を合わせるふたり",
      "summary": "近づきたい気持ちと安心確認のバランスが鍵になる相性。",
      "dims": [
        "pace",
        "expression"
      ],
      "bullets": [
        "連絡や会う頻度の温度合わせが重要",
        "好意を隠しすぎないほど安心しやすい",
        "急ぎすぎると片方が息切れする可能性"
      ],
      "private": "ふたりは好意の温度が見えるほど安心します。ただし、近づく速度がずれると不安や重さに変わりやすい。関係の初期ほど「どのくらいが心地いいか」を軽く確認するとよいです。",
      "report": "連絡頻度、愛情表現、初期の温度差、近づき方を深掘り。"
    },
    {
      "id": "R01_RES_BALANCE_BLEND",
      "name": "違いを活かすふたり",
      "summary": "似ている部分と違う部分を、対立ではなく役割に変えられる相性。",
      "dims": [
        "balanced"
      ],
      "bullets": [
        "完全一致より、補い合いで安定しやすい",
        "違いを早めに言葉にすると強みに変わる",
        "一方に合わせすぎない設計が大事"
      ],
      "private": "ふたりは、全てが同じだから合うというより、違いを扱えると強くなる組み合わせです。大事なのは勝ち負けにしないこと。役割分担と確認の仕方を決めるほど、関係の余白が整います。",
      "report": "相違点、補完関係、摩擦ポイント、関係ルールを整理。"
    }
  ],
  "assignment_rules": {
    "method": "score both participants separately, compute pair averaged dimension score and gap score, then select strongest matching result type",
    "primary_score": "highest pair_average among result trigger dimensions",
    "gap_penalty": "if trigger dimension gap is large, reduce confidence and prefer R01_RES_BALANCE_BLEND when multiple gaps are high",
    "tie_break_order": [
      "R01_RES_BALANCE_BLEND",
      "R01_RES_STABLE_HOME",
      "R01_RES_WARM_PACE",
      "R01_RES_DEEP_TALK",
      "R01_RES_CARE_MIRROR",
      "R01_RES_DECISION_TEAM",
      "R01_RES_GENTLE_DISTANCE",
      "R01_RES_SPARK_PAIR"
    ],
    "fallback_result": "R01_RES_BALANCE_BLEND",
    "confidence_labels": [
      "low",
      "medium",
      "high"
    ]
  },
  "trust_boundaries": [
    "This is not fortune-telling or destiny prediction.",
    "This does not decide whether two people should date, marry, break up, or reunite.",
    "This does not expose one participant private answers as blame material.",
    "This is a reflective compatibility check for communication rhythm and relationship distance."
  ]
} as const;
