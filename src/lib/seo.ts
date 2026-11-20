/**
 * Site-wide SEO constants. Set NEXT_PUBLIC_SITE_URL in the deployment environment
 * (e.g. https://www.oodlelearn.com) — the fallback is only a placeholder.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://www.oodlelearn.com")
).replace(/\/$/, "");

export const SITE_NAME = "Oodle Learn";
export const SITE_TITLE = "Oodle Learn — Life-skills card games for kids aged 4–10";
export const SITE_DESCRIPTION =
  "Card games that help children aged 4–10 learn money, problem-solving, feelings and entrepreneurship through play. Master Money, Master Solutions & Master Biz.";
export const INSTAGRAM = "https://www.instagram.com/oodlelearn/";
