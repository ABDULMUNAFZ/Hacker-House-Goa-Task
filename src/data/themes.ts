export type ThemeId = "sunset" | "beachclub" | "tropical";

export type CardTheme = {
  id: ThemeId;
  label: string;
  bg: string;
  bgDeep: string;
  ink: string;
  accent: string;
  cream: string;
  sun: string;
  sea: string;
};

export const THEMES: Record<ThemeId, CardTheme> = {
  sunset: {
    id: "sunset",
    label: "SUNSET GOA",
    bg: "#006B3C",
    bgDeep: "#004F32",
    ink: "#FFD400",
    accent: "#FF168C",
    cream: "#fffbe8",
    sun: "#FFD400",
    sea: "#00593B",
  },
  beachclub: {
    id: "beachclub",
    label: "BEACH CLUB",
    bg: "#004F32",
    bgDeep: "#00341F",
    ink: "#fffbe8",
    accent: "#FF168C",
    cream: "#FFD400",
    sun: "#FF168C",
    sea: "#006B3C",
  },
  tropical: {
    id: "tropical",
    label: "TROPICAL BUILDER",
    bg: "#FFD400",
    bgDeep: "#F2B900",
    ink: "#004F32",
    accent: "#FF168C",
    cream: "#fffbe8",
    sun: "#FF168C",
    sea: "#006B3C",
  },
};

export const THEME_LIST = [THEMES.sunset, THEMES.beachclub, THEMES.tropical];
