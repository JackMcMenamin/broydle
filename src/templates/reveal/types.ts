import type { TaskBase } from "@/core/base";

export type RevealVariant = "pixelate" | "zoom" | "silhouette";

export interface RevealItem {
  answer: string;
  aliases?: string[];
  /** Short hint shown from stage 2 (category, continent...). */
  hint?: string;
  /** Image source for pixelate / zoom variants. */
  src?: string;
  credit?: string;
  /** Zoom variant: focal point as fractions of width/height. */
  focus?: [number, number];
  /** Silhouette variant: country name as it appears in world-atlas. */
  country?: string;
}

export interface RevealTask extends TaskBase {
  type: "reveal";
  variant: RevealVariant;
  items: RevealItem[];
}

/** Number of free reveal steps before a wrong guess costs a heart. */
export const REVEAL_STAGES = 4;
