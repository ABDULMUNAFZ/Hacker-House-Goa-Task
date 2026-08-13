import React from "react";
import ScrambledText from "./ScrambledText";

export function HowItWorks() {
  const steps = [
    {
      n: "01",
      t: "DROP YOUR PHOTO",
      d: "Selfie, camera roll or HEIC straight off an iPhone.",
      posClass: "left-[4.8%] top-[17.5%] w-[22.2%] h-[22%]",
      titleColor: "text-[#004d2c]",
      descColor: "text-[#004d2c]/90"
    },
    {
      n: "02",
      t: "ADD YOUR INFO",
      d: "Name, stack and a vibe. We'll hand you a title.",
      posClass: "left-[4.8%] top-[52.5%] w-[22.2%] h-[22%]",
      titleColor: "text-white",
      descColor: "text-white/90"
    },
    {
      n: "03",
      t: "GET YOUR HH GOA CARD",
      d: "A poster-grade PFP frame or Builder ID card.",
      posClass: "right-[4.8%] top-[17.5%] w-[22.2%] h-[22%]",
      titleColor: "text-white",
      descColor: "text-white/90"
    },
    {
      n: "04",
      t: "SHARE YOUR IDENTITY",
      d: "Save the PNG, then take it to X with #FrameInGoa.",
      posClass: "right-[4.8%] top-[52.5%] w-[22.2%] h-[22%]",
      titleColor: "text-[#004d2c]",
      descColor: "text-[#004d2c]/90"
    }
  ];

  return (
    <section id="how" className="grain border-y-4 border-goa-yellow/30 bg-goa-green py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-8 text-center">
        {/* Scrambled title to show off the effect */}
        <div className="mb-4 flex justify-center">
          <ScrambledText
            radius={150}
            duration={1.5}
            speed={0.6}
            scrambleChars="HHGOA"
            className="m-0 max-w-full text-5xl sm:text-7xl text-goa-yellow font-cond font-bold uppercase tracking-wide text-center"
          >
            HOW IT WORKS
          </ScrambledText>
        </div>
      </div>

      {/* Desktop/Tablet visual image board - full width page bg */}
      <div className="hidden md:block relative w-full aspect-[1024/620] bg-[#002b18] border-y-2 border-goa-yellow/20">
        <img
          src="/how-it-works-bg.jpg"
          alt="How it works background board"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Overlay steps aligned with the inner white boxes of the image */}
        {steps.map((s) => (
          <div
            key={s.n}
            className={`absolute ${s.posClass} flex flex-col justify-center items-center text-center p-2 lg:p-4 select-none overflow-hidden`}
          >
            <h3 className={`font-mono text-[clamp(10px,1.2vw,17px)] font-extrabold uppercase tracking-wider ${s.titleColor}`}>
              STEP {s.n} - {s.t}
            </h3>
            <p className={`font-mono text-[clamp(8px,0.85vw,11px)] mt-1.5 lg:mt-3 leading-relaxed uppercase font-semibold ${s.descColor}`}>
              {s.d}
            </p>
          </div>
        ))}
      </div>

      {/* Mobile stacked view (standard cards) */}
      <div className="grid gap-4 px-4 sm:px-6 sm:grid-cols-2 md:hidden">
        {steps.map((s) => (
          <div
            key={s.n}
            className="group relative overflow-hidden rounded-xl border-2 border-goa-yellow/35 bg-[#00361c] p-5 transition-transform duration-200"
          >
            <span className="display-xl block text-5xl text-goa-pink font-extrabold">{s.n}</span>
            <h3 className="label-cond mt-3 text-sm text-goa-yellow font-black uppercase">{s.t}</h3>
            <p className="mt-2 font-body text-xs text-goa-cream/85 leading-relaxed">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
