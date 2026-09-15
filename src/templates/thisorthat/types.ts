import type { TaskBase } from "@/core/base";

export interface ThisOrThatTask extends TaskBase {
  type: "thisorthat";
  buckets: [string, string];
  items: { label: string; bucket: 0 | 1; note?: string }[];
}
