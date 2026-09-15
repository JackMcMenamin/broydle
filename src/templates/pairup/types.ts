import type { TaskBase } from "@/core/base";

export interface PairUpTask extends TaskBase {
  type: "pairup";
  leftLabel: string;
  verb: string;
  rightLabel: string;
  pairs: { left: string; right: string }[];
}
