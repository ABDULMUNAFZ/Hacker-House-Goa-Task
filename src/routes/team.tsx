import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import ScrambledText from "@/components/ScrambledText";

const TITLE = "HH Goa 2026 — Meet the Tech Mavericks";
const DESC = "Meet the developers behind the HH Goa 2026 Builder Card and Frame Creator: Kowshika S, Abdul Munaf Z, and Prathiksha J.";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TeamPage,
});

function SpeechBubble({
  name,
  linkedin,
  posClass,
  tailType,
}: {
  name: string;
  linkedin: string;
  posClass: string;
  tailType: "left" | "right";
}) {
  return (
    <a
      href={linkedin}
      target="_blank"
      rel="noopener noreferrer"
      className={`absolute ${posClass} z-20 flex flex-col items-center group cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-1`}
    >
      <div className="relative bg-[#ebd29d] border-[3px] border-black rounded-[22px] px-4 py-2 sm:px-5 sm:py-2.5 shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:shadow-[7px_7px_0px_rgba(0,0,0,1)] transition-all duration-300 flex items-center gap-2 sm:gap-3">
        {/* Name in green font matching mockup, wrapped in ScrambledText */}
        <ScrambledText
          radius={70}
          duration={0.6}
          speed={1.0}
          scrambleChars="X"
          className="font-sans font-black text-[11px] sm:text-[14px] text-[#004d2c] tracking-wide uppercase select-none"
        >
          {name}
        </ScrambledText>

        {/* LinkedIn Logo (standard blue brand square) */}
        <div className="w-5 h-5 sm:w-7 sm:h-7 bg-[#0077b5] rounded-md flex items-center justify-center text-white font-sans font-black text-[11px] sm:text-[15px] shadow-[1px_1px_0px_rgba(0,0,0,1)] border border-black">
          in
        </div>

        {/* Curved Cartoon Tail */}
        {tailType === "left" ? (
          <svg className="absolute -bottom-[13px] left-[25%] w-7 h-4 filter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]" viewBox="0 0 30 16" fill="none">
            <path d="M 0 0 Q 8 8, 4 16 Q 16 8, 20 0" fill="#ebd29d" stroke="black" strokeWidth="3" />
          </svg>
        ) : (
          <svg className="absolute -bottom-[13px] right-[25%] w-7 h-4 filter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]" viewBox="0 0 30 16" fill="none">
            <path d="M 30 0 Q 22 8, 26 16 Q 14 8, 10 0" fill="#ebd29d" stroke="black" strokeWidth="3" />
          </svg>
        )}
      </div>
    </a>
  );
}

function TeamPage() {
  const members = [
    {
      name: "Kowshika S",
      linkedin: "https://www.linkedin.com/in/kowshika-selvakumar/",
      posClass: "left-[6.5%] top-[43.5%]",
      tailType: "right" as const,
    },
    {
      name: "Abdul Munaf Z",
      linkedin: "https://www.linkedin.com/in/abdul-munaf-z-6380a8251/",
      posClass: "left-[36%] top-[40.5%]",
      tailType: "right" as const, // tail points down-right (on the right side of the bubble)
    },
    {
      name: "Prathiksh J",
      linkedin: "https://www.linkedin.com/in/prathiksha-j-169715354/",
      posClass: "right-[8.5%] top-[43.5%]",
      tailType: "left" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-goa-green flex flex-col justify-between select-none">
      <Navbar />

      <main className="flex-grow flex flex-col items-center justify-center py-10 relative overflow-hidden bg-goa-green">
        {/* Decorative background flares */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,107,60,0.15),transparent)] pointer-events-none" />
        
        <div className="w-full z-10 text-center space-y-6">
          <div className="space-y-2 px-4 sm:px-6">
            <span className="label-cond text-xs text-goa-yellow tracking-widest font-semibold uppercase block">
              DONE BY TEAM
            </span>
            <h1 className="display-xl text-5xl sm:text-7xl text-goa-cream uppercase tracking-tight">
              <ScrambledText radius={180} duration={1.5} scrambleChars="MAVERICKS">
                TECH MAVERICKS
              </ScrambledText>
            </h1>
            <p className="max-w-xl mx-auto font-body text-xs sm:text-sm text-goa-cream/70">
              The creative crew who engineered the 3D physics simulator and frame generator.
            </p>
          </div>

          {/* Desktop/Tablet visual image board - full width page bg, contained to prevent crop */}
          <div className="hidden md:block relative w-full aspect-[1000/618] bg-goa-green border-y-2 border-goa-yellow/20">
            <img
              src="/team-bg.jpg"
              alt="Tech Mavericks Team Photo"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />

            {/* Dynamic Speech Bubbles Overlayed on the clean photo */}
            {members.map((m) => (
              <SpeechBubble
                key={m.name}
                name={m.name}
                linkedin={m.linkedin}
                posClass={m.posClass}
                tailType={m.tailType}
              />
            ))}
          </div>

          {/* Mobile fallback visual */}
          <div className="md:hidden px-4 sm:px-6">
            <div className="relative w-full aspect-[1000/618] rounded-xl overflow-hidden border-2 border-goa-yellow/30 bg-goa-green">
              <img
                src="/team-bg.jpg"
                alt="Tech Mavericks Team Photo"
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
              {members.map((m) => (
                <SpeechBubble
                  key={m.name}
                  name={m.name}
                  linkedin={m.linkedin}
                  posClass={m.posClass}
                  tailType={m.tailType}
                />
              ))}
            </div>
          </div>

          <div className="pt-2 text-center px-4">
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-goa-yellow/50 bg-goa-yellow text-goa-deep font-bold hover:bg-goa-cream hover:border-goa-cream transition-all duration-300 shadow-lg hover:shadow-goa-yellow/20"
            >
              Back to Generator
            </a>
          </div>
        </div>
      </main>

      {/* Customized Footer for Team Page */}
      <footer className="border-t-2 border-goa-yellow/30 bg-[#00190e] py-8 text-center relative overflow-hidden z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-4 flex flex-col items-center">
          <div className="flex items-center gap-3">
            <img src="/247pm-studio-logo.png" alt="247PM Studio" className="h-7 w-auto object-contain opacity-80" />
            <span className="text-goa-yellow/45 text-sm">|</span>
            <img src="/goa-logo.png" alt="HH Goa 2026" className="h-7 w-auto object-contain opacity-80" />
          </div>
          <p className="font-mono text-xs text-goa-cream/50 tracking-wider">
            CREATED FOR HH GOA 2026 BY TEAM <span className="text-goa-yellow font-bold">TECH MAVERICKS</span>
          </p>
          <div className="text-[10px] text-goa-cream/35 font-body">
            &copy; 2026 Tech Mavericks &amp; 24:7PM Studio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
