import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Yorisou | Products",
  description: "A first product gallery for browsing senior mobility options and moving into consultation.",
};

const groups = [
  {
    title: "For nearby daily trips",
    lead: "A first view of products suited to shopping, clinic visits, and short local movement.",
    items: [
      {
        name: "Outdoor electric cart",
        image: "/images/products/electric-cart.svg",
        useCase: "Shopping, clinic visits, neighborhood trips",
        audience: "For users who want to reduce outdoor walking burden",
        difference: "Prioritizes outdoor stability and easier daily distance coverage.",
      },
      {
        name: "Walking-assist model",
        image: "/images/products/walking-aid.svg",
        useCase: "Short trips and facility movement",
        audience: "For users who can still walk but feel strain on distance or slopes",
        difference: "Keeps more natural walking while adding practical support.",
      },
    ],
  },
  {
    title: "For family-supported selection",
    lead: "A first comparison for households thinking about storage, transport, and caregiver usability.",
    items: [
      {
        name: "Folding lightweight type",
        image: "/images/products/folding-type.svg",
        useCase: "Car loading and storage ease",
        audience: "For households concerned about transport and storage space",
        difference: "Emphasizes easier handling when the product is not in use.",
      },
      {
        name: "Shared support model",
        image: "/images/products/shared-support.svg",
        useCase: "User operation plus caregiver support",
        audience: "For cases where family assistance is part of the decision",
        difference: "Balances user comfort with easier family support.",
      },
    ],
  },
];

export default function ProductsPageEn() {
  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <section className="border-b border-[#D6C3A3]/22 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.94),_rgba(245,241,232,0.98)_60%)] px-6 py-16 md:px-10 md:py-22">
        <div className="mx-auto max-w-6xl">
          <div className="shell-card max-w-4xl p-8 md:p-12">
            <h1 className="text-4xl font-light leading-tight md:text-6xl">Browse products before moving into consultation</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#5A4B3E] md:text-lg">
              This page is the beginning of a calmer product database where Yorisou organizes mobility options by use case, user fit, and family practicality.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#FBF7F0] px-6 py-16 md:px-10 md:py-18">
        <div className="mx-auto max-w-6xl space-y-10">
          {groups.map((group) => (
            <div key={group.title} className="rounded-[2.1rem] border border-[#D6C3A3]/28 bg-white/80 p-7 shadow-[0_20px_48px_rgba(59,47,47,0.05)] md:p-10">
              <h2 className="text-3xl font-light leading-tight">{group.title}</h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#5A4B3E] md:text-base">{group.lead}</p>
              <div className="mt-8 grid gap-5 lg:grid-cols-2">
                {group.items.map((item) => (
                  <article key={item.name} className="overflow-hidden rounded-[1.75rem] border border-[#D6C3A3]/24 bg-[#FCFAF6]">
                    <div className="relative h-52 w-full bg-[linear-gradient(135deg,rgba(252,248,240,0.98),rgba(236,227,214,0.82))]">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="p-6">
                      <div className="text-sm text-[#8A7764]">{item.useCase}</div>
                      <h3 className="mt-2 text-2xl font-light leading-tight">{item.name}</h3>
                      <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{item.audience}</p>
                      <p className="mt-4 rounded-[1.2rem] border border-[#D6C3A3]/24 bg-white/78 px-4 py-4 text-sm leading-7 text-[#6B5A4A]">
                        {item.difference}
                      </p>
                      <div className="mt-5">
                        <Link href="/en/ai-advisor" className="btn btn-secondary">
                          Consult with these conditions
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
