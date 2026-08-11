export function HowItWorks() {
  const steps = [
    { n: "01", t: "DROP YOUR PHOTO", d: "Selfie, camera roll or HEIC straight off an iPhone." },
    { n: "02", t: "ADD YOUR BUILDER INFO", d: "Name, stack and a vibe. We'll hand you a title." },
    { n: "03", t: "GET YOUR HH GOA CARD", d: "A poster-grade PFP frame or Builder ID card." },
    { n: "04", t: "SHARE YOUR GOA IDENTITY", d: "Save the PNG, then take it to X with #FrameInGoa." },
  ];

  return (
    <section id="how" className="grain border-y-4 border-goa-yellow/30 bg-goa-deep py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="display-xl text-5xl text-goa-yellow sm:text-7xl">HOW IT WORKS</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="group relative overflow-hidden rounded-xl border-2 border-goa-yellow/35 bg-goa-green p-5 transition-transform duration-200 hover:-translate-y-1"
              style={{ transitionDelay: `${i * 20}ms` }}
            >
              <span className="display-xl block text-6xl text-goa-pink">{s.n}</span>
              <h3 className="label-cond mt-3 text-[0.68rem] text-goa-yellow">{s.t}</h3>
              <p className="mt-2 font-body text-sm text-goa-cream/85">{s.d}</p>
              <span
                aria-hidden="true"
                className="absolute -right-6 -top-6 h-16 w-16 rounded-full border-4 border-goa-yellow/25"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
