import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getGuidedExperience, SR1_GUIDED_EXPERIENCES } from "@/app/data/sr1/guidedExperiences";
import GuidedExperienceRunner from "./GuidedExperienceRunner";

// Static params from the catalogue — one route per guided experience slug.
export function generateStaticParams(): { slug: string }[] {
  return SR1_GUIDED_EXPERIENCES.map((experience) => ({ slug: experience.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const experience = getGuidedExperience(slug);
  if (!experience) {
    return { title: "ガイド体験 | Yorisou" };
  }
  return {
    title: `${experience.title} | Yorisou`,
    description: experience.purpose,
  };
}

export default async function GuidedExperiencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const experience = getGuidedExperience(slug);
  if (!experience) {
    notFound();
  }
  return <GuidedExperienceRunner experience={experience} />;
}
