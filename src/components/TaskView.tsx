"use client";
import Link from "next/link";
import { useMounted } from "@/lib/engine";
import { todayKey } from "@/lib/dates";
import { getDay } from "@/puzzles/days";
import Reveal from "@/templates/reveal/Reveal";
import PinDrop from "@/templates/pindrop/PinDrop";
import Ballpark from "@/templates/ballpark/Ballpark";
import ThisOrThat from "@/templates/thisorthat/ThisOrThat";
import PairUp from "@/templates/pairup/PairUp";
import FillGap from "@/templates/fillgap/FillGap";

export default function TaskView({ day, slot }: { day: string; slot: number }) {
  const mounted = useMounted();
  const d = getDay(day);
  const task = d?.tasks[slot - 1];
  if (!d || !task) return <main className="p-4">No such task.</main>;
  if (!mounted) return <main className="h-dvh bg-paper" />;
  if (day > todayKey())
    return (
      <main className="flex h-dvh flex-col items-center justify-center gap-2 bg-paper text-muted">
        <p className="text-lg">Not yet. Come back on the day.</p>
        <Link href="/" className="underline underline-offset-4 hover:text-ink">
          Today&rsquo;s puzzles
        </Link>
      </main>
    );
  const props = { day, slot };
  switch (task.type) {
    case "reveal":
      return <Reveal task={task} {...props} />;
    case "pindrop":
      return <PinDrop task={task} {...props} />;
    case "ballpark":
      return <Ballpark task={task} {...props} />;
    case "thisorthat":
      return <ThisOrThat task={task} {...props} />;
    case "pairup":
      return <PairUp task={task} {...props} />;
    case "fillgap":
      return <FillGap task={task} {...props} />;
  }
}
