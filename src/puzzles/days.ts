import type { Day } from "@/core/types";
import { pixelReveal1, zoomedIn1, flagFrag1, shapeUp1 } from "@/templates/reveal/content";
import { pinDropLandmarks, pinDropNature } from "@/templates/pindrop/content";
import { ballpark1, ballpark2, datePhoto1, datePhoto2 } from "@/templates/ballpark/content";
import { thisOrThat1, thisOrThat2 } from "@/templates/thisorthat/content";
import { pairUp1, pairUp2 } from "@/templates/pairup/content";
import { fillGap1, fillGap2 } from "@/templates/fillgap/content";

/** The schedule: which editions appear on which demo day. */
const SCHEDULE: Day[] = [
  { date: "2026-09-15", tasks: [pixelReveal1, pinDropLandmarks, thisOrThat1, ballpark1] },
  { date: "2026-09-16", tasks: [shapeUp1, pairUp1, datePhoto1, fillGap1] },
  { date: "2026-09-17", tasks: [flagFrag1, pinDropNature, thisOrThat2, ballpark2] },
  { date: "2026-09-18", tasks: [zoomedIn1, pairUp2, datePhoto2, fillGap2] },
];

/** Scheduled days, oldest first. */
export const DAYS: Day[] = [...SCHEDULE].sort((a, b) => a.date.localeCompare(b.date));

export function getDay(date: string): Day | undefined {
  return DAYS.find((d) => d.date === date);
}

/** The most recent scheduled day on or before the given date, if any. */
export function latestDayUpTo(date: string): Day | undefined {
  return [...DAYS].reverse().find((d) => d.date <= date);
}
