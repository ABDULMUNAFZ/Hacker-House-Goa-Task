import { useEffect, useState } from "react";
import LineSidebar from "./LineSidebar";

const SECTION_IDS = ["top", "create", "how", "team"];

export function Navbar() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -45% 0px",
      threshold: 0.05,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = SECTION_IDS.indexOf(entry.target.id);
          if (index !== -1) {
            setActiveIndex(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleItemClick = (index: number) => {
    const targets = ["#top", "#create", "#how", "#team"];
    const targetId = targets[index];
    if (targetId) {
      const el = document.querySelector(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    setActiveIndex(index);
  };

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent pointer-events-none">
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 md:px-8"
        >
          <a href="#top" className="group flex items-center gap-2 pointer-events-auto">
            <img
              src="/247pm-studio-logo.png"
              alt="2:47PM STUDIO"
              className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </a>
        </nav>
      </header>

      {/* Floating Right-Side Corner Middle Navigation — scroll-aware */}
      <LineSidebar
        items={["Home", "Create", "How it works", "Mavericks"]}
        accentColor="#fee101"
        textColor="#ebd29d"
        markerColor="#0b6839"
        showIndex
        showMarker
        proximityRadius={100}
        maxShift={20}
        falloff="smooth"
        markerLength={45}
        markerGap={8}
        tickScale={0.4}
        scaleTick
        itemGap={16}
        fontSize={0.88}
        smoothing={120}
        defaultActive={activeIndex}
        onItemClick={handleItemClick}
      />
    </>
  );
}
