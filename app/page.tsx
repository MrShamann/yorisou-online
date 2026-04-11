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
    label: "1. 相談の入口",
    title: "予約前の不安を、まず家族の状況として受け取ります。",
    problem: "まだ言葉になっていなくても、外出や送迎の困りごとをそのまま話せます。",
    action: "ひなたが整理すること",
    detail: "本人、家族、移動条件を短く整理し、最初の入口を見つけます。",
    outcome: "次に進む先が見えます。",
  },
  {
    label: "2. 家族で共有",
    title: "確認したいことを、あとで見直しやすい形にまとめます。",
    problem: "予約の前に、家族でそろえておきたい確認が残りやすい領域です。",
    action: "ひなたが返すこと",
    detail: "電話、LINE、アプリのどこから入っても、家族の確認に戻せる形にします。",
    outcome: "説明のやり直しが減ります。",
  },
  {
    label: "3. 必要な先へ",
    title: "相談で終わらず、必要な入口へ静かにつなぎます。",
    problem: "家庭向けの相談と、導入・実証の相談は、最初に分けて考えるほうが落ち着きます。",
    action: "ひなたが案内すること",
    detail: "家族向け相談と、運営側の小さな導入相談を分けて案内します。",
    outcome: "今の段階に合う次の一歩だけが残ります。",
  },
];

const entryLanes = [
  {
    title: "家族・利用者の相談",
    text: "予約前の不安や確認事項を、家族目線で整理できます。",
    href: "/reservation-mobility-support",
    cta: "相談ページへ",
  },
  {
    title: "導入・実証の相談",
    text: "自治体、施設、事業者の小さなパイロット相談につながります。",
    href: "/reservation-mobility-support#pilot-inquiry",
    cta: "導入相談へ",
  },
];

const platformPillars = [
  {
    title: "予約前の確認",
    text: "乗り降りや付き添いの不安を、相談前に整理できます。",
  },
  {
    title: "家族の共有",
    text: "家族が確認したい点を、あとで見直しやすくまとめます。",
  },
  {
    title: "小さな導入相談",
    text: "自治体や施設の入口だけを、静かに確かめられます。",
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
              既存の電話、LINE、アプリ予約を置き換えるのではなく、その前に何を確認すればよいかをひなたと一緒に整えられます。
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
              <Link href="/pilot" className="soft-link">
                導入・実証
              </Link>
              <Link href="/insights" className="soft-link">
                読みもの
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
              <p className="mt-4 page-copy">予約前の確認から家族共有までを、ひと続きの相談として受け取れます。</p>
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
            <div className="service-kicker">予約前の流れ</div>
            <h2 className="display-serif mt-4 max-w-[13.5em] text-[1.76rem] leading-[1.62] md:text-[2.16rem]">
              <span className="block md:whitespace-nowrap">確認を整え、</span>
              <span className="block md:whitespace-nowrap">必要な先へ静かにつなぎます。</span>
            </h2>
            <p className="mt-4 page-copy">長い説明は置かず、今の段階で必要な流れだけを示します。</p>
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
                相談と導入の入口だけを、まず見える場所に置いています。
              </h2>
              <p className="mt-4 page-copy">家族向け相談と、導入・実証相談を、最小限の選択肢で案内します。</p>
          </MotionReveal>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
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

      <section className="section-wash bg-[rgba(255,255,255,0.22)] px-6 py-10 md:px-10 md:py-12">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1.06fr_0.94fr]">
          <MotionReveal delay={30}>
            <div className="motion-card rounded-[1.8rem] border border-[color:var(--line-soft)] bg-[var(--surface)] px-6 py-6">
            <div className="service-kicker">ご本人とご家族のその先</div>
            <h2 className="display-serif mt-4 max-w-[14.5em] text-[1.7rem] leading-[1.64] md:text-[2.04rem]">
              まずは予約前の相談に必要なことだけを、静かに整えられます。
            </h2>
            <div className="mt-5 page-copy">
              <p>すぐに決めなくても大丈夫です。必要な確認をまとめ、ご家族と見返しながら、次の一歩を進められます。</p>
              <p className="mt-3">自治体や施設、地域事業者の方にも、導入や実証の入口として同じ流れを使えます。</p>
            </div>
          </div>
          </MotionReveal>

          <MotionReveal delay={120} distance={18}>
            <div className="motion-card panel-sage rounded-[1.8rem] px-6 py-5">
            <div className="service-kicker text-[var(--accent-sage-text)]">そのあとで使える入口</div>
            <p className="mt-3 text-sm leading-8 md:text-base">
              LINE、アカウント、Web は、必要な人だけが続きとして使えます。
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm">
              <Link href="/line/next?locale=ja&line_intent=register&returnTo=/support" className="soft-link">
                LINE
              </Link>
              <Link href="/login" className="soft-link">
                アカウント
              </Link>
              <Link href="/support" className="soft-link">
                Web
              </Link>
            </div>
          </div>
          </MotionReveal>
        </div>
      </section>
    </main>
  );
}
