import type { TemplateMeta } from "./base";
import type { Task } from "./types";
import { REVEAL_META } from "@/templates/reveal/meta";
import { PINDROP_META } from "@/templates/pindrop/meta";
import { BALLPARK_META } from "@/templates/ballpark/meta";
import { THISORTHAT_META } from "@/templates/thisorthat/meta";
import { PAIRUP_META } from "@/templates/pairup/meta";
import { FILLGAP_META } from "@/templates/fillgap/meta";

/** Template metadata (default how-to text) for a task. */
export function taskMeta(task: Task): TemplateMeta {
  switch (task.type) {
    case "reveal":
      return REVEAL_META[task.variant];
    case "pindrop":
      return PINDROP_META;
    case "ballpark":
      return BALLPARK_META;
    case "thisorthat":
      return THISORTHAT_META;
    case "pairup":
      return PAIRUP_META;
    case "fillgap":
      return FILLGAP_META;
  }
}

/** How many units a task has, for star scoring. */
export function taskTotal(task: Task): number {
  switch (task.type) {
    case "reveal":
      return task.items.length;
    case "pindrop":
      return task.places.length;
    case "ballpark":
      return task.questions.length;
    case "thisorthat":
      return task.items.length;
    case "pairup":
      return task.pairs.length;
    case "fillgap":
      return task.gaps.length;
  }
}

/** Identifies a task's content so saved progress from a different task is never reused. */
export function taskSig(task: Task): string {
  return `${task.type}/${task.series}/${task.edition}/${taskTotal(task)}`;
}
