import { faq, gameDetails } from "@/content/site";
import { INSTAGRAM, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

/** JSON-LD for the home page: Organization, WebSite, WebPage, the three games (Products), and the FAQs. */
export default function StructuredData() {
  const org = `${SITE_URL}/#organization`;
  const site = `${SITE_URL}/#website`;
  const games = Object.values(gameDetails);

  const graph = [
    {
      "@type": "Organization",
      "@id": org,
      name: SITE_NAME,
      url: SITE_URL,
      // Google requires a raster logo (≥112×112) — not SVG.
      logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/logo.png`, width: 512, height: 512 },
      image: `${SITE_URL}/opengraph-image.png`,
      description: SITE_DESCRIPTION,
      slogan: "Play today. Ready for life tomorrow.",
      foundingDate: "2025",
      foundingLocation: { "@type": "Place", name: "Mumbai, India" },
      founder: { "@type": "Person", name: "Olinda" },
      sameAs: [INSTAGRAM],
      areaServed: { "@type": "Country", name: "India" },
      knowsAbout: ["Financial literacy for children", "Emotional intelligence", "Problem-solving", "Entrepreneurship for kids", "Educational card games"],
    },
    {
      "@type": "WebSite",
      "@id": site,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en-IN",
      publisher: { "@id": org },
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: "Oodle Learn — Life-skills card games for kids aged 4–10",
      description: SITE_DESCRIPTION,
      inLanguage: "en-IN",
      isPartOf: { "@id": site },
      about: { "@id": org },
      primaryImageOfPage: { "@type": "ImageObject", url: `${SITE_URL}/opengraph-image.png` },
      mainEntity: games.map((g) => ({ "@id": `${SITE_URL}/#${g.world}` })),
    },
    ...games.map((g) => ({
      "@type": "Product",
      "@id": `${SITE_URL}/#${g.world}`,
      name: g.name,
      description: `${g.tagline} ${g.hook}`,
      category: "Educational card game",
      brand: { "@type": "Brand", name: SITE_NAME },
      manufacturer: { "@id": org },
      image: `${SITE_URL}/opengraph-image.png`,
      audience: { "@type": "PeopleAudience", suggestedMinAge: 4, suggestedMaxAge: 10 },
      // Price & Amazon URL to be added when the client supplies them.
      offers: {
        "@type": "Offer",
        url: g.buyHref || `${SITE_URL}/#games`,
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        areaServed: { "@type": "Country", name: "India" },
        seller: { "@id": org },
      },
    })),
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: faq.items.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c") }}
    />
  );
}
