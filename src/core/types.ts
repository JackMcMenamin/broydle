import type { RevealTask } from "@/templates/reveal/types";
import type { PinDropTask } from "@/templates/pindrop/types";
import type { BallparkTask } from "@/templates/ballpark/types";
import type { ThisOrThatTask } from "@/templates/thisorthat/types";
import type { PairUpTask } from "@/templates/pairup/types";
import type { FillGapTask } from "@/templates/fillgap/types";

export type Task = RevealTask | PinDropTask | BallparkTask | ThisOrThatTask | PairUpTask | FillGapTask;
export type TaskType = Task["type"];

export interface Day {
  /** Local calendar date, YYYY-MM-DD. */
  date: string;
  tasks: [Task, Task, Task, Task];
}
