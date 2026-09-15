import type { TemplateMeta } from "@/core/base";
import type { RevealVariant } from "./types";

export const REVEAL_META: Record<RevealVariant, TemplateMeta> = {
  pixelate: {
    name: "Reveal",
    how: "Five pictures, each pixelated. Type what it is. A wrong guess sharpens the picture. Guess wrong on the sharpest stage and you lose a heart. Use the strip at the top to jump between pictures whenever you like.",
    example: "A yellow curved blob... Banana!",
  },
  zoom: {
    name: "Reveal",
    how: "Five pictures, each zoomed way in. Type what it is. A wrong guess zooms out a step. Guess wrong on the widest stage and you lose a heart. Use the strip at the top to jump between pictures.",
    example: "Orange with black lines and tiny bumps... Basketball!",
  },
  silhouette: {
    name: "Reveal",
    how: "Five outlines. Type the country. A wrong guess adds a hint. Guess wrong with every hint showing and you lose a heart. Use the strip at the top to jump between outlines.",
    example: "A boot-shaped outline... Italy!",
  },
};
