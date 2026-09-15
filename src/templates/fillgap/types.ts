import type { TaskBase } from "@/core/base";

export interface FillGapTask extends TaskBase {
  type: "fillgap";
  gaps: { before: string[]; after: string[]; answer: string; aliases?: string[]; note?: string }[];
}
