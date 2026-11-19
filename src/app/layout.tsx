import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Providers from "@/components/Providers";
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
  title: "Oodle Learn — Play today. Ready for life tomorrow.",
  description:
    "Oodle Learn turns important life skills — money, problem-solving, feelings and entrepreneurship — into card games children aged 4–10 love to play.",
  icons: {
    icon: [{ url: "/brand/logo.svg", type: "image/svg+xml" }],
    apple: "/logos/png/1. Oodle Learn Logo (Colored).png",
  },
  openGraph: {
    title: "Oodle Learn — Big lessons. Little play.",
    description:
      "Card games that help children explore money, feelings, problem-solving and big ideas. Made in India.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#e4e1cf",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${kidsMagic.variable} ${poppins.variable} antialiased`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
