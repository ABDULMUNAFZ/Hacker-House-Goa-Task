import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Generator } from "@/components/Generator";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";

const TITLE = "HH Goa 2026 — Frame Your Goa";
const DESC =
  "Create your HH Goa 2026 Builder Card, frame your selfie, and share your Goa identity with #FrameInGoa.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://teammavericks.tech" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "theme-color", content: "#006B3C" },
    ],
    links: [{ rel: "canonical", href: "https://teammavericks.tech" }],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-goa-green">
      <Navbar />
      <main>
        <Hero />
        <Generator />
        <HowItWorks />
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <p className="display-xl text-4xl text-goa-cream sm:text-6xl">
            MAKE SOMETHING
            <br />
            <span className="text-goa-yellow">WORTH SHARING.</span>
          </p>
          <p className="mt-4 max-w-lg font-body text-sm text-goa-cream/80">
            Your photo is processed locally in your browser whenever possible. Nothing is uploaded,
            stored, or analysed — no accounts, no face recognition, no tracking of your image.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
