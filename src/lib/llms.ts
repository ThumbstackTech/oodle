import { difference, faq, freebies, gameDetails, story } from "@/content/site";
import { INSTAGRAM, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

/** Plain-text responses for /llms.txt and /llms-full.txt (llmstxt.org format), built from site content. */
export function llmsResponse(body: string) {
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}

const games = Object.values(gameDetails);
const fact = (g: (typeof games)[number], label: string) => g.facts.find((f) => f.label === label)?.value ?? "";

function header() {
  return [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "Oodle Learn is an Indian brand that turns important life skills — financial literacy, problem-solving, emotional intelligence and entrepreneurial thinking — into card games children aged 4–10 love to play. Tagline: \"Play today. Ready for life tomorrow.\" Brand thought: \"Big lessons. Little play.\"",
    "",
    "- Games are sold through Amazon India and delivered within India only.",
    `- Founded in 2025 in Mumbai by Olinda, a working mother, with her son Orai (then 7) as first playtester and co-creator.`,
    "",
  ];
}

export function llmsTxt(): string {
  const lines = [
    ...header(),
    "## Games",
    "",
    ...games.map(
      (g) =>
        `- [${g.name}](${SITE_URL}/#games): ${g.tagline} Ages ${fact(g, "Recommended age")}, ${fact(g, "Players")}. Skills: ${fact(g, "Skills explored")}.`,
    ),
    "",
    "## Free resources (Freebie Factory)",
    "",
    "Free printable activities; a quick registration (name, contact number, email) is required before downloading.",
    "",
    ...freebies.items.map((f) => `- [${f.title}](${SITE_URL}/#freebies): ${f.blurb} (${f.tag})`),
    "",
    "## FAQs",
    "",
    ...faq.items.flatMap((f) => [`- **${f.q}** ${f.a}`]),
    "",
    "## Links",
    "",
    `- [Home](${SITE_URL}/)`,
    `- [Our games](${SITE_URL}/#games)`,
    `- [The Oodle difference](${SITE_URL}/#difference)`,
    `- [Behind the Oodle — our story](${SITE_URL}/#story)`,
    `- [Freebie Factory](${SITE_URL}/#freebies)`,
    `- [FAQs](${SITE_URL}/#faq)`,
    `- [Instagram @oodlelearn](${INSTAGRAM})`,
    `- [Full text for LLMs](${SITE_URL}/llms-full.txt)`,
    "",
  ];
  return lines.join("\n");
}

export function llmsFullTxt(): string {
  const lines = [
    ...header(),
    "## Our story",
    "",
    story.headline,
    "",
    ...story.body,
    "",
    "## The Oodle difference",
    "",
    difference.headline.join(" "),
    "",
    difference.intro,
    "",
    difference.wantIntro,
    ...difference.traits.map((t) => `- Be ${t.trait} enough ${t.rest}`),
    "",
    `${difference.closing.lead} ${difference.closing.tail}`,
    "",
  ];

  for (const g of games) {
    lines.push(
      `## ${g.name}`,
      "",
      `*${g.tagline}*`,
      "",
      g.hook,
      "",
      ...g.about,
      "",
      "### Quick facts",
      ...g.facts.map((f) => `- ${f.label}: ${f.value}`),
      "",
      `### ${g.feature.title}`,
      ...g.feature.items.map((it) => `- ${it.name}: ${it.body}`),
      "",
      `### How to play — ${g.howTo.headline}`,
      ...g.howTo.body,
      "",
      "### What's inside the box",
      ...g.inBox.map((x) => `- ${x}`),
      "",
      `### ${g.practiseTitle}`,
      ...g.practise.map((x) => `- ${x}`),
      "",
      "### For the grown-ups",
      ...g.grownUps,
      "",
    );
  }

  lines.push("## FAQs", "", ...faq.items.flatMap((f) => [`### ${f.q}`, f.a, ""]));
  return lines.join("\n");
}
