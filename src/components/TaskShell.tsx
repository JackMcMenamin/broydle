"use client";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Engine } from "@/lib/engine";
import { accentFor, roman } from "@/core/base";
import { formatKey } from "@/lib/dates";
import type { Task } from "@/core/types";
import { taskMeta } from "@/core/registry";
import AppFrame from "./AppFrame";
import { Badge, Btn, CopyButton, Hearts, Stars } from "./ui";

export function shareLine(day: string, slot: number, task: Task, stars: number, hearts: number) {
  return `${formatKey(day)} · ${slot}. ${task.series} ${roman(task.edition)} · ${"★".repeat(stars)}${"☆".repeat(3 - stars)} ${"♥".repeat(hearts)}${"♡".repeat(3 - hearts)}`;
}

export default function TaskShell<S>({
  day,
  slot,
  task,
  engine,
  children,
  actions,
  wide,
}: {
  day: string;
  slot: number;
  task: Task;
  engine: Engine<S>;
  children: React.ReactNode;
  /** Text shown next to hearts, e.g. "Round 2 of 5". */
  statusLabel?: string;
  /** Task-specific buttons for the centre of the action bar. */
  actions?: React.ReactNode;
  wide?: boolean;
}) {
  const meta = taskMeta(task);
  const [help, setHelp] = useState(false);
  const [confirmReveal, setConfirmReveal] = useState(false);
  const { p, stars } = engine;

  const banner = p.revealed ? "Revealed" : p.done ? "Done" : p.locked ? "Out of hearts, no more points" : null;

  const top = (
    <div className="flex items-center gap-4">
      <Link
        href={`/day/${day}/`}
        aria-label="Back to today"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-faint text-lg hover:bg-raise"
      >
        &larr;
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h1 className="truncate text-2xl font-semibold leading-tight">{task.title}</h1>
          <button
            onClick={() => setHelp(true)}
            title={task.how ?? meta.how}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-muted text-xs text-muted hover:border-ink hover:text-ink"
            aria-label="How to play"
          >
            ?
          </button>
        </div>
        <p className="truncate text-muted">{task.blurb}</p>
      </div>
      <AnimatePresence>
        {banner && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`rounded-md px-3 py-1.5 text-sm ${p.done && !p.locked && !p.revealed ? "bg-(--accent) text-paper" : "border border-ink bg-raise"}`}
          >
            {banner}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <Stars n={stars} size={22} />
        <Hearts n={p.hearts} size={22} />
      </div>
    </div>
  );

  const bottom = (
    <>
      <Link href={`/day/${day}/`} className="rounded-lg border border-ink px-4 py-2 font-medium hover:bg-raise">
        Back
      </Link>
      <div className="flex flex-1 items-center justify-center gap-3">{actions}</div>
      {!p.done && !confirmReveal && (
        <Btn small onClick={() => setConfirmReveal(true)}>
          Reveal answers
        </Btn>
      )}
      {confirmReveal && !p.done && (
        <span className="flex items-center gap-2 text-sm">
          Give up?
          <Btn small primary onClick={() => engine.reveal()}>
            Yes
          </Btn>
          <Btn small onClick={() => setConfirmReveal(false)}>
            No
          </Btn>
        </span>
      )}
      {p.done && <CopyButton text={shareLine(day, slot, task, stars, p.hearts)} primary />}
      <button onClick={() => engine.reset()} className="text-xs text-faint underline">
        reset
      </button>
    </>
  );

  return (
    <AppFrame top={top} bottom={bottom} wide={wide} accent={accentFor(slot)}>
      {children}
      <AnimatePresence>
        {help && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="w-full max-w-md rounded-xl border border-ink bg-paper p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-2 flex items-center gap-2">
                <Badge>{task.series}</Badge>
                <span className="text-xs text-muted">
                  edition {roman(task.edition)} · task {slot} of 4
                </span>
              </div>
              <h2 className="text-lg font-bold">{task.title}</h2>
              <p className="mt-1 text-sm text-muted">{task.blurb}</p>
              <p className="mt-3 text-sm">{task.how ?? meta.how}</p>
              {task.note && <p className="mt-2 text-sm text-muted">{task.note}</p>}
              <div className="mt-3 rounded-md border border-dashed border-ink p-3 text-sm text-muted">
                <span className="font-semibold">Example:</span> {meta.example}
              </div>
              <p className="mt-3 text-xs text-muted">
                3 hearts per task. Dots for progress. Out of hearts? Keep playing, you just stop earning dots.
              </p>
              {task.sources && <p className="mt-2 text-xs text-muted">{task.sources}</p>}
              <Btn primary className="mt-4 w-full" onClick={() => setHelp(false)}>
                Got it
              </Btn>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppFrame>
  );
}
