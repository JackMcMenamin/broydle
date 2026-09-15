import type { TaskBase } from "@/core/base";

export interface PinDropTask extends TaskBase {
  type: "pindrop";
  /** Theme label shown in the header, e.g. "Landmarks". */
  theme: string;
  /** Kilometres within which a pin counts as correct. */
  tolerance: number;
  places: { name: string; lat: number; lng: number; hint?: string }[];
}
