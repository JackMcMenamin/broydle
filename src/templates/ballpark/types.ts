import type { TaskBase } from "@/core/base";

export interface BallparkQuestion {
  q: string;
  answer: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  /** Absolute tolerance in the answer's units that still counts as correct. */
  within: number;
  /** How to describe the tolerance, e.g. "5 years". Defaults to the number plus unit. */
  withinText?: string;
  /** Render without thousands separators (years). */
  plain?: boolean;
  /** Optional picture shown with the question (Date the Photo). */
  image?: string;
  credit?: string;
  note?: string;
}

export interface BallparkTask extends TaskBase {
  type: "ballpark";
  questions: BallparkQuestion[];
}
