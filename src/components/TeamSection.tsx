import React from "react";
import ScrambledText from "./ScrambledText";

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

export function TeamSection() {
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
    <section id="team" className="grain bg-goa-green py-16 relative overflow-hidden">
      {/* Decorative background flares */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,107,60,0.15),transparent)] pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-8 relative z-10 text-center space-y-2">
        <span className="label-cond text-xs text-goa-yellow tracking-widest font-semibold uppercase block">
          DONE BY TEAM
        </span>
        <h2 className="display-xl text-5xl sm:text-7xl text-goa-cream uppercase tracking-tight">
          <ScrambledText radius={180} duration={1.5} scrambleChars="MAVERICKS">
            TECH MAVERICKS
          </ScrambledText>
        </h2>
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
    </section>
  );
}
