import Image from "next/image";
import Link from "next/link";
import MotionReveal from "./components/MotionReveal";
import InsightsPreview from "./components/InsightsPreview";

const concerns = [
  "予約型の送迎を使う前に、家族で確認したいことがある",
  "電話・LINE・アプリのどれで頼むか迷っている",
  "乗り降り、付き添い、待ち合わせの整理が必要",
];

const journeySteps = [
  {
    label: "1. 困りごとの入口",
    title: "通院、買い物、外出の不安を、まず状況として受け取ります。",
    problem: "何に困っているのかがまだ曖昧なままでも、移動の負担や暮らしの不安をそのまま話せます。",
    action: "ひなたが整理すること",
    detail: "最初の相談窓口として、ご本人、ご家族、生活導線、通院頻度などを静かに整理します。",
    outcome: "次に何を考えるべきかが見え始めます。",
  },
  {
    label: "2. 状況整理",
    title: "いま必要なのが相談なのか、比較なのか、地域導入なのかを分けていきます。",
    problem: "製品を探す前に、生活のどこで困るのか、家族がどこで支えるのかが整理されていないことが多くあります。",
    action: "ひなたが進めること",
    detail: "相談内容を、支援内容、読みもの、導入・実証、継続相談のどこへつなぐべきか見極めます。",
    outcome: "情報が増えすぎず、その人に合う入口だけを選べます。",
  },
  {
    label: "3. 合う支え方の提案",
    title: "移動手段だけでなく、続けやすさまで含めて考えます。",
    problem: "比較表だけでは、毎日の動線やご家族の負担に本当に合うかが分かりません。",
    action: "ひなたが伝えること",
    detail: "支援内容や読みものを通じて、使い方、安全性、費用感、地域で続く運用を見ながら提案します。",
    outcome: "選択肢が『使えそうか』ではなく『続けられそうか』で見えてきます。",
  },
  {
    label: "4. 家族と共有",
    title: "ご本人だけでなく、ご家族も安心できる形へつなげます。",
    problem: "本人は使いたい、ご家族は不安、というすれ違いが起きやすい領域です。",
    action: "ひなたが整えること",
    detail: "相談の続きはLINEやアカウントで受け取れ、あとから家族と共有しながら見返せます。",
    outcome: "その場の会話で終わらず、家族も同じ理解で動きやすくなります。",
  },
  {
    label: "5. 継続支援",
    title: "一度の相談で終わらず、導入やその後の支え方まで続けられます。",
    problem: "移動支援は、始めるより続けるほうが難しいことがあります。",
    action: "ひなたがつなぐこと",
    detail: "必要に応じて、支援内容の比較、導入・実証の相談、読みもの、継続相談へ落ち着いてつなぎます。",
    outcome: "Yorisouが、単発の相談ではなく長く寄り添う支援基盤として機能します。",
  },
];

const entryLanes = [
  {
    title: "予約型移動の相談をする",
    text: "予約前の不安や確認事項を、家族目線で整理できます。",
    href: "/reservation-mobility-support",
    cta: "相談ページへ",
  },
  {
    title: "導入・実証を相談する",
    text: "自治体、施設、事業者の小さなパイロット相談につながります。",
    href: "/reservation-mobility-support#pilot-inquiry",
    cta: "導入相談へ",
  },
  {
    title: "実証・相談から始める",
    text: "気になる製品やサービスを、相談や実証の入口につなげられます。",
    href: "/insights/validate",
    cta: "実証・相談へ",
  },
  {
    title: "連絡して確かめる",
    text: "詳しい案内や次の相談先が必要なときは、連絡窓口へ進めます。",
    href: "/contact",
    cta: "連絡窓口へ",
  },
];

const platformPillars = [
  {
    title: "相談の入口",
    text: "予約前の不安を、曖昧なままでも相談から始められます。",
  },
  {
    title: "支援の比較",
    text: "電話、LINE、アプリのどれで入るかを落ち着いて整えられます。",
  },
  {
    title: "家族との継続",
    text: "ひなたとのやりとりを、あとから家族と共有しながら続けられます。",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <section className="section-wash border-b border-[color:var(--line-soft)] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.98),_rgba(247,244,238,0.99)_60%)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:px-10 md:py-16 lg:grid-cols-[1.18fr_0.82fr] lg:items-center lg:gap-12">
          <MotionReveal className="order-2 lg:order-1" delay={40} distance={28}>
            <div className="service-kicker">予約前の相談入口</div>
            <h1 className="display-serif mt-5 max-w-[9.6em] text-[2.18rem] leading-[1.24] md:text-[3.02rem] lg:text-[3.36rem]">
              <span className="block md:whitespace-nowrap">予約型移動の前に、</span>
              <span className="block text-[#79685f] md:whitespace-nowrap">家族の不安をひとつずつ整える。</span>
            </h1>
            <p className="mt-6 max-w-[34rem] text-base leading-9 text-[var(--muted)] md:text-lg">
              Yorisouは、予約型の移動サービスを使う前に、家族の不安や確認事項を静かに整理する入口です。
              電話、LINE、アプリ予約の前に、何を確認すればよいかをひなたと一緒に整えられます。
            </p>
            <p className="mt-4 max-w-[33rem] text-sm leading-8 text-[var(--muted)] md:text-base">
              ひなたは、長い説明を求めません。ご家族の心配や、運営側が確認したい点を1つ伝えるだけで、次の一歩を落ち着いて返します。
            </p>
            <div className="mt-6 rounded-[1.4rem] border border-[color:var(--line-sage)] bg-[rgba(255,253,249,0.88)] px-5 py-5 text-sm leading-7 text-[var(--accent-sage-text)]">
              <div className="service-kicker text-[var(--accent-sage-text)]">最初の入口</div>
              <p className="mt-2">
                まずは、予約前の相談から始められます。ご家族向けの確認整理も、運営側の小さな導入相談も、同じ入口で受け取ります。
              </p>
            </div>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link href="/reservation-mobility-support" className="btn btn-primary">
                予約型移動の相談へ
              </Link>
              <Link href="/reservation-mobility-support#pilot-inquiry" className="btn btn-secondary">
                導入・実証を相談する
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-sm text-[var(--muted)]">
              {concerns.map((item) => (
                <span key={item} className="rounded-full border border-[color:var(--line-soft)] bg-[rgba(255,255,255,0.72)] px-3 py-1.5">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm">
              <Link href="/reservation-mobility-support" className="soft-link">
                予約型移動相談
              </Link>
              <Link href="/about" className="soft-link">
                Yorisouについて
              </Link>
              <Link href="/pilot" className="soft-link">
                導入・実証
              </Link>
              <Link href="/insights" className="soft-link">
                読みもの
              </Link>
              <Link href="/register" className="soft-link">
                はじめて使う方へ
              </Link>
            </div>
          </MotionReveal>

          <MotionReveal className="order-1 lg:order-2" delay={160} distance={22} scale={0.99}>
            <div className="hero-portrait-frame mx-auto max-w-[21rem] overflow-hidden rounded-[2rem] border border-[color:var(--line-soft)] bg-[var(--surface)] p-2 shadow-[0_14px_28px_rgba(47,35,33,0.05)] lg:mr-8">
              <div className="overflow-hidden rounded-[1.7rem] bg-[var(--surface-soft-strong)]">
                <Image
                  src="/images/hinata-portrait.png"
                  alt="AI相談員 ひなた"
                  width={1200}
                  height={1500}
                  priority
                  className="h-auto w-full object-cover object-top"
                />
              </div>
            </div>
          </MotionReveal>
        </div>
      </section>

      <section className="section-wash border-b border-[color:var(--line-soft)] bg-[rgba(255,255,255,0.52)] px-6 py-10 md:px-10 md:py-12">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[0.94fr_1.06fr] lg:items-stretch">
          <MotionReveal delay={40} distance={18}>
            <article className="motion-card rounded-[1.8rem] border border-[color:var(--line-soft)] bg-[var(--surface)] px-6 py-6 shadow-[0_10px_24px_rgba(47,35,33,0.04)]">
              <div className="service-kicker">予約前の相談を起点に</div>
              <h2 className="display-serif mt-4 max-w-[14em] text-[1.66rem] leading-[1.62] md:text-[2rem]">
                予約前の相談から、家族共有までを
                <span className="block md:whitespace-nowrap">静かにつなぐ入口です。</span>
              </h2>
              <p className="mt-4 page-copy">
                まず相談し、必要な支援を見極め、ご家族とも共有しながら続ける。その流れを分断せずに支えます。
              </p>
              <div className="mt-6 grid gap-3">
                {platformPillars.map((pillar, index) => (
                  <MotionReveal key={pillar.title} delay={100 + index * 60} distance={16}>
                    <div className="platform-pill rounded-[1.2rem] border border-[color:var(--line-soft)] bg-[rgba(247,244,238,0.88)] px-4 py-4">
                      <div className="platform-pill-title">{pillar.title}</div>
                      <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{pillar.text}</p>
                    </div>
                  </MotionReveal>
                ))}
              </div>
            </article>
          </MotionReveal>

          <MotionReveal delay={120} distance={20} scale={0.99}>
            <article className="motion-card rounded-[1.8rem] border border-[color:var(--line-sage)] px-6 py-6">
              <div className="service-kicker text-[var(--accent-sage-text)]">予約前に確認したいこと</div>
              <h2 className="display-serif mt-4 max-w-[13em] text-[1.58rem] leading-[1.62] md:text-[1.92rem]">
                ご本人、ご家族、地域の支援者が、
                <span className="block md:whitespace-nowrap">次の一歩を無理なく見つけられるようにしています。</span>
              </h2>
              <p className="mt-4 page-copy text-[var(--accent-sage-text)]">予約前の確認を先に整えることで、家族も運営側も落ち着いて次へ進めます。</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.25rem] bg-[rgba(255,255,255,0.6)] px-4 py-4">
                  <div className="text-xs tracking-[0.18em] text-[var(--accent-sage-text)]">ご本人</div>
                  <p className="mt-2 text-sm leading-7 text-[var(--accent-sage-text)]">歩く負担や外出の不安を、そのまま相談できます。</p>
                </div>
                <div className="rounded-[1.25rem] bg-[rgba(255,255,255,0.6)] px-4 py-4">
                  <div className="text-xs tracking-[0.18em] text-[var(--accent-sage-text)]">ご家族</div>
                  <p className="mt-2 text-sm leading-7 text-[var(--accent-sage-text)]">比較の視点や次の判断を、家族で共有しやすくなります。</p>
                </div>
                <div className="rounded-[1.25rem] bg-[rgba(255,255,255,0.6)] px-4 py-4">
                  <div className="text-xs tracking-[0.18em] text-[var(--accent-sage-text)]">地域の方</div>
                  <p className="mt-2 text-sm leading-7 text-[var(--accent-sage-text)]">実証や導入の入口を、落ち着いて確かめられます。</p>
                </div>
              </div>
            </article>
          </MotionReveal>
        </div>
      </section>

      <InsightsPreview locale="ja" />

      <section className="section-wash border-b border-[color:var(--line-soft)] bg-[var(--surface-soft)] px-6 py-12 md:px-10 md:py-14">
        <div className="mx-auto max-w-6xl">
          <MotionReveal className="max-w-[40rem]" delay={30}>
            <div className="service-kicker">予約前から始まる流れ</div>
            <h2 className="display-serif mt-4 max-w-[13.5em] text-[1.76rem] leading-[1.62] md:text-[2.16rem]">
              <span className="block md:whitespace-nowrap">まず予約前の確認を整え、</span>
              <span className="block md:whitespace-nowrap">必要な先へ静かにつなぎます。</span>
            </h2>
            <p className="mt-4 page-copy">
              何に困っていて、どの入口に進むかを、短い流れの中で自然に理解できる構成にしています。
            </p>
          </MotionReveal>
          <div className="mt-8 space-y-4">
            {journeySteps.map((step, index) => (
              <MotionReveal key={step.label} delay={80 + index * 65} distance={20}>
                <article className="journey-step motion-card rounded-[1.7rem] border border-[color:var(--line-soft)] bg-[rgba(255,253,249,0.82)] px-6 py-6">
                  <div className="journey-grid">
                    <div>
                      <div className="service-kicker text-[var(--accent-sage-text)]">{step.label}</div>
                      <h3 className="display-serif mt-3 text-[1.34rem] leading-[1.62] text-[var(--text)] md:text-[1.56rem]">
                        {step.title}
                      </h3>
                    </div>
                    <div className="journey-copy">
                      <div className="journey-block">
                        <div className="journey-block-label">いま起きがちなこと</div>
                        <p>{step.problem}</p>
                      </div>
                      <div className="journey-block">
                        <div className="journey-block-label">{step.action}</div>
                        <p>{step.detail}</p>
                      </div>
                      <div className="journey-block journey-outcome">
                        <div className="journey-block-label">つぎに見えること</div>
                        <p>{step.outcome}</p>
                      </div>
                    </div>
                  </div>
                </article>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-wash border-b border-[color:var(--line-soft)] bg-[rgba(255,255,255,0.46)] px-6 py-12 md:px-10 md:py-14">
        <div className="mx-auto max-w-6xl">
          <MotionReveal className="max-w-[42rem]" delay={30}>
              <div className="service-kicker">今の入口</div>
              <h2 className="display-serif mt-4 max-w-[15em] text-[1.72rem] leading-[1.6] md:text-[2.08rem]">
                理解が進んだあとに、そのまま次の入口へ進めます。
              </h2>
              <p className="mt-4 page-copy">
              相談から始める方と、導入・実証を見たい方の入口を、同じ流れの中に置いています。
              </p>
          </MotionReveal>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {entryLanes.map((item, index) => (
              <MotionReveal key={item.title} delay={90 + index * 75} distance={18}>
                <article
                key={item.title}
                className="motion-card lane-card rounded-[1.6rem] border border-[color:var(--line-soft)] bg-[var(--surface)] px-5 py-5 shadow-[0_10px_24px_rgba(47,35,33,0.04)]"
              >
                <h3 className="text-base font-medium text-[var(--text)]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.text}</p>
                <div className="mt-4">
                  <Link href={item.href} className="soft-link">
                    {item.cta}
                  </Link>
                </div>
                </article>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-wash bg-[rgba(255,255,255,0.22)] px-6 py-12 md:px-10 md:py-14">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1.06fr_0.94fr]">
          <MotionReveal delay={30}>
            <div className="motion-card rounded-[1.8rem] border border-[color:var(--line-soft)] bg-[var(--surface)] px-6 py-6">
            <div className="service-kicker">ご本人とご家族のその先</div>
            <h2 className="display-serif mt-4 max-w-[14.5em] text-[1.7rem] leading-[1.64] md:text-[2.04rem]">
              Yorisouは、状況整理から家族共有、支援内容の比較までつなげる継続支援です。
            </h2>
            <div className="mt-5 page-copy">
              <p>すぐに何かを決める必要はありません。まず状況を聞き、必要ならご家族と見返しながら、相談の続きを静かに進められます。</p>
              <p className="mt-3">自治体や施設、地域事業者の方には、現場導入や実証の相談基盤としても同じ流れを使えます。</p>
            </div>
          </div>
          </MotionReveal>

          <MotionReveal delay={120} distance={18}>
            <div className="motion-card panel-sage rounded-[1.8rem] px-6 py-6">
            <div className="service-kicker text-[var(--accent-sage-text)]">その先も、無理のない形で</div>
            <p className="mt-4 text-sm leading-8 md:text-base">
              Yorisouは LINE を第一入口にしながら、Web で相談内容の確認や継続を支えます。はじめての方は LINE から、すでに使っている方はアカウントから続けられます。
            </p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm">
              <Link href="/line/next?locale=ja&line_intent=register&returnTo=/support" className="soft-link">
                LINEではじめる
              </Link>
              <Link href="/login" className="soft-link">
                アカウントで続ける
              </Link>
              <Link href="/support" className="soft-link">
                Webで相談を確認する
              </Link>
            </div>
          </div>
          </MotionReveal>
        </div>
      </section>
    </main>
  );
}
