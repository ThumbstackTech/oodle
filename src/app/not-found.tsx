import type { Metadata } from "next";
import Nav from "@/components/Nav";
import NotFoundGame from "@/components/notfound/NotFoundGame";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <Nav />
      <main>
        <NotFoundGame />
      </main>
      <Footer />
    </>
  );
}
