import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Providers from "@/components/Providers";
import StructuredData from "@/components/StructuredData";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/seo";
import "./globals.css";

const kidsMagic = localFont({
  src: "../fonts/KidsMagic.otf",
  variable: "--font-kids-magic",
  display: "swap",
});

const poppins = localFont({
  src: [
    { path: "../fonts/Poppins-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/Poppins-Medium.ttf", weight: "500", style: "normal" },
    { path: "../fonts/Poppins-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../fonts/Poppins-Bold.ttf", weight: "700", style: "normal" },
    { path: "../fonts/Poppins-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "life skills games for kids",
    "financial literacy card game",
    "money game for kids India",
    "emotional intelligence game",
    "entrepreneurship game for kids",
    "educational card games",
    "growth mindset",
    "Master Money",
    "Master Solutions",
    "Master Biz",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    locale: "en_IN",
    title: "Oodle Learn — Big lessons. Little play.",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Oodle Learn — Big lessons. Little play.",
    description: SITE_DESCRIPTION,
  },
  category: "education",
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#e4e1cf",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${kidsMagic.variable} ${poppins.variable} antialiased`}>
      <body>
        <StructuredData />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
