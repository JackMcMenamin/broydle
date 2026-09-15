import type { Day } from "@/core/types";
import { pixelReveal1, zoomedIn1, flagFrag1, shapeUp1 } from "@/templates/reveal/content";
import { pinDropLandmarks, pinDropNature } from "@/templates/pindrop/content";
import { ballpark1, ballpark2, datePhoto1, datePhoto2 } from "@/templates/ballpark/content";
import { thisOrThat1, thisOrThat2 } from "@/templates/thisorthat/content";
import { pairUp1, pairUp2 } from "@/templates/pairup/content";
import { fillGap1, fillGap2 } from "@/templates/fillgap/content";

/** The schedule: which editions appear on which demo day. */
export const DAYS: Day[] = [
  { day: 1, tasks: [pixelReveal1, pinDropLandmarks, thisOrThat1, ballpark1] },
  { day: 2, tasks: [shapeUp1, pairUp1, datePhoto1, fillGap1] },
  { day: 3, tasks: [flagFrag1, pinDropNature, thisOrThat2, ballpark2] },
  { day: 4, tasks: [zoomedIn1, pairUp2, datePhoto2, fillGap2] },
];

export function getDay(n: number): Day | undefined {
  return DAYS.find((d) => d.day === n);
}
