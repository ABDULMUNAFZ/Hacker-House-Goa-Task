import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const shareSearchSchema = z.object({
  image: z.string().optional(),
  video: z.string().optional(),
  caption: z.string().optional(),
});

export const Route = createFileRoute("/share")({
  validateSearch: (search) => shareSearchSchema.parse(search),
  head: ({ search }) => {
    const title = "Hacker House Goa 2026 Card";
    const desc = search.caption || "Check out my custom Hacker House Goa 2026 card!";
    const imageUrl = search.image || "https://hacker-house-goa-task.vercel.app/goa-logo.png";
    const videoUrl = search.video;

    const metaTags: any[] = [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
    ];

    if (videoUrl) {
      metaTags.push(
        { property: "og:type", content: "video.other" },
        { property: "og:video", content: videoUrl },
        { property: "og:video:type", content: "video/mp4" },
        { property: "og:video:width", content: "1080" },
        { property: "og:video:height", content: "1080" },
        { name: "twitter:card", content: "player" },
        { name: "twitter:player", content: videoUrl },
        { name: "twitter:player:width", content: "1080" },
        { name: "twitter:player:height", content: "1080" },
        { property: "og:image", content: imageUrl }
      );
    } else {
      metaTags.push(
        { property: "og:type", content: "website" },
        { property: "og:image", content: imageUrl },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: imageUrl }
      );
    }

    return {
      meta: metaTags,
    };
  },
  component: SharePage,
});

function SharePage() {
  const { image, video, caption } = Route.useSearch();

  return (
    <div className="min-h-screen bg-goa-deep flex flex-col items-center justify-between text-goa-cream relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 bg-[url('/goa-bg.jpg')] bg-cover bg-center mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-b from-goa-deep/80 via-goa-deep to-goa-deep z-0" />

      <Navbar />

      <main className="relative z-10 w-full max-w-4xl px-4 py-16 flex flex-col items-center text-center flex-grow justify-center gap-8">
        <h1 className="display-xl text-5xl sm:text-6xl text-goa-yellow leading-none uppercase">
          HACKER HOUSE GOA
          <br />
          <span className="text-goa-cream">2026 CARD</span>
        </h1>

        {/* Media Preview Frame */}
        <div className="w-full max-w-md aspect-square rounded-2xl border-4 border-goa-yellow bg-black/60 shadow-[0_0_50px_rgba(235,210,157,0.15)] overflow-hidden flex items-center justify-center relative group">
          {video ? (
            <video
              src={video}
              autoPlay
              loop
              muted
              playsInline
              controls
              className="w-full h-full object-cover"
            />
          ) : image ? (
            <img
              src={image}
              alt="Hacker House Goa Card"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-goa-cream/50 p-8 font-body">No preview available</div>
          )}
        </div>

        {/* Caption display */}
        {caption && (
          <div className="max-w-lg grain rounded-xl border-2 border-goa-yellow/30 bg-goa-deep/80 px-6 py-4 font-body text-base text-goa-cream italic shadow-inner">
            "{caption}"
          </div>
        )}

        {/* Call to Action */}
        <a
          href="/"
          className="hh-btn hh-btn-pink text-lg px-8 py-4 uppercase animate-pulse shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:scale-105 transition-all duration-300"
        >
          <span className="relative z-10 font-bold tracking-wider">
            Create Your Goa Card
          </span>
        </a>
      </main>

      <Footer />
    </div>
  );
}
