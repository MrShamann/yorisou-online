"use client";

type FamilyKey = "dawn" | "motion" | "recovery" | "boundary" | string;

type Props = {
  familyKey: FamilyKey;
  variant?: "result" | "share";
};

const FAMILY_STYLES: Record<
  string,
  {
    glow: string;
    figure: string;
    shade: string;
    pose: {
      bodyWidth: string;
      bodyHeight: string;
      bodyTop: string;
      shoulderWidth: string;
      shoulderHeight: string;
      shoulderBottom: string;
      leftArm: string;
      rightArm: string;
      torsoRadius: string;
      standWidth: string;
      standBottom: string;
    };
  }
> = {
  dawn: {
    glow: "from-[rgba(252,243,224,0.95)] via-[rgba(246,224,182,0.44)] to-[rgba(176,144,114,0.14)]",
    figure: "from-[rgba(248,243,235,0.98)] via-[rgba(223,198,171,0.94)] to-[rgba(123,96,79,0.92)]",
    shade: "bg-[rgba(96,73,58,0.2)]",
    pose: {
      bodyWidth: "w-[42%]",
      bodyHeight: "h-[61%]",
      bodyTop: "top-[16%]",
      shoulderWidth: "w-[62%]",
      shoulderHeight: "h-[22%]",
      shoulderBottom: "bottom-[13%]",
      leftArm: "left-[18%] top-[30%] h-[31%] w-[14%] rotate-[11deg]",
      rightArm: "right-[20%] top-[34%] h-[28%] w-[12%] -rotate-[17deg]",
      torsoRadius: "rounded-[46%_46%_26%_26%/20%_20%_58%_58%]",
      standWidth: "w-[44%]",
      standBottom: "bottom-[8%]",
    },
  },
  motion: {
    glow: "from-[rgba(250,238,218,0.95)] via-[rgba(243,202,149,0.48)] to-[rgba(190,140,96,0.16)]",
    figure: "from-[rgba(247,238,225,0.98)] via-[rgba(226,183,126,0.94)] to-[rgba(112,81,63,0.9)]",
    shade: "bg-[rgba(86,62,47,0.22)]",
    pose: {
      bodyWidth: "w-[40%]",
      bodyHeight: "h-[62%]",
      bodyTop: "top-[15%]",
      shoulderWidth: "w-[64%]",
      shoulderHeight: "h-[21%]",
      shoulderBottom: "bottom-[12%]",
      leftArm: "left-[16%] top-[32%] h-[34%] w-[13%] rotate-[22deg]",
      rightArm: "right-[14%] top-[28%] h-[38%] w-[14%] -rotate-[28deg]",
      torsoRadius: "rounded-[45%_45%_24%_24%/18%_18%_58%_58%]",
      standWidth: "w-[48%]",
      standBottom: "bottom-[7%]",
    },
  },
  recovery: {
    glow: "from-[rgba(241,245,236,0.96)] via-[rgba(209,225,207,0.42)] to-[rgba(140,164,140,0.14)]",
    figure: "from-[rgba(246,246,240,0.98)] via-[rgba(198,213,192,0.92)] to-[rgba(90,101,88,0.9)]",
    shade: "bg-[rgba(72,78,70,0.2)]",
    pose: {
      bodyWidth: "w-[44%]",
      bodyHeight: "h-[60%]",
      bodyTop: "top-[17%]",
      shoulderWidth: "w-[66%]",
      shoulderHeight: "h-[23%]",
      shoulderBottom: "bottom-[13%]",
      leftArm: "left-[20%] top-[36%] h-[28%] w-[12%] rotate-[8deg]",
      rightArm: "right-[21%] top-[35%] h-[28%] w-[12%] -rotate-[9deg]",
      torsoRadius: "rounded-[48%_48%_28%_28%/22%_22%_58%_58%]",
      standWidth: "w-[43%]",
      standBottom: "bottom-[8%]",
    },
  },
  boundary: {
    glow: "from-[rgba(245,240,235,0.95)] via-[rgba(224,212,205,0.42)] to-[rgba(166,150,142,0.14)]",
    figure: "from-[rgba(245,241,236,0.98)] via-[rgba(204,191,181,0.92)] to-[rgba(90,82,76,0.9)]",
    shade: "bg-[rgba(74,66,61,0.22)]",
    pose: {
      bodyWidth: "w-[41%]",
      bodyHeight: "h-[61%]",
      bodyTop: "top-[16%]",
      shoulderWidth: "w-[68%]",
      shoulderHeight: "h-[22%]",
      shoulderBottom: "bottom-[12%]",
      leftArm: "left-[15%] top-[31%] h-[32%] w-[13%] rotate-[3deg]",
      rightArm: "right-[15%] top-[31%] h-[32%] w-[13%] -rotate-[3deg]",
      torsoRadius: "rounded-[44%_44%_24%_24%/18%_18%_56%_56%]",
      standWidth: "w-[47%]",
      standBottom: "bottom-[8%]",
    },
  },
};

export default function PersonaHeroPortrait({
  familyKey,
  variant = "result",
}: Props) {
  const style = FAMILY_STYLES[familyKey] || FAMILY_STYLES.recovery;
  const scale = variant === "share" ? "inset-x-[10%] top-[8%] bottom-[14%]" : "inset-x-[8%] top-[7%] bottom-[11%]";

  return (
    <div className={`pointer-events-none absolute ${scale}`}>
      <div className={`absolute inset-x-[8%] top-[4%] bottom-[8%] rounded-[48%] bg-gradient-to-b ${style.glow} blur-[22px]`} />
      <div className={`absolute left-1/2 top-[3%] h-[17%] w-[15%] -translate-x-1/2 rounded-full bg-[rgba(255,247,239,0.94)] shadow-[0_10px_22px_rgba(47,35,33,0.16)]`} />
      <div className="absolute left-1/2 top-[1.5%] h-[11%] w-[19%] -translate-x-1/2 rounded-[54%_54%_34%_34%/72%_72%_28%_28%] bg-[rgba(91,73,61,0.7)]" />
      <div className="absolute left-1/2 top-[14%] h-[8%] w-[7%] -translate-x-1/2 rounded-[999px] bg-[linear-gradient(180deg,rgba(228,217,204,0.84)_0%,rgba(195,182,165,0.28)_100%)]" />
      <div
        className={`absolute left-1/2 ${style.pose.bodyTop} ${style.pose.bodyHeight} ${style.pose.bodyWidth} -translate-x-1/2 ${style.pose.torsoRadius} bg-gradient-to-b ${style.figure} shadow-[0_28px_56px_rgba(47,35,33,0.22)]`}
      />
      <div className={`absolute left-1/2 ${style.pose.bodyTop} ${style.pose.bodyHeight} ${style.pose.bodyWidth} -translate-x-1/2 rounded-[44%] border border-white/12`} />
      <div className={`absolute ${style.pose.leftArm} rounded-[999px] bg-[linear-gradient(180deg,rgba(255,244,235,0.58)_0%,rgba(118,100,88,0.42)_100%)]`} />
      <div className={`absolute ${style.pose.rightArm} rounded-[999px] bg-[linear-gradient(180deg,rgba(255,244,235,0.54)_0%,rgba(118,100,88,0.42)_100%)]`} />
      <div className={`absolute left-1/2 ${style.pose.shoulderBottom} ${style.pose.shoulderHeight} ${style.pose.shoulderWidth} -translate-x-1/2 rounded-[999px] bg-[radial-gradient(circle,rgba(255,250,244,0.42)_0%,rgba(255,250,244,0.08)_60%,transparent_82%)] blur-[8px]`} />
      <div className="absolute left-[31%] bottom-[12%] h-[17%] w-[12%] rounded-[999px] bg-[linear-gradient(180deg,rgba(104,88,77,0.88)_0%,rgba(74,60,52,0.64)_100%)]" />
      <div className="absolute right-[31%] bottom-[12%] h-[17%] w-[12%] rounded-[999px] bg-[linear-gradient(180deg,rgba(104,88,77,0.88)_0%,rgba(74,60,52,0.64)_100%)]" />
      <div className={`absolute left-1/2 ${style.pose.standBottom} h-[10%] ${style.pose.standWidth} -translate-x-1/2 rounded-[999px] ${style.shade} blur-[10px]`} />
    </div>
  );
}
