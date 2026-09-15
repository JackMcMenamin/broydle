"use client";
import { AnimatePresence, motion, useMotionValue, useTransform, type PanInfo } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { seededShuffle } from "@/lib/answers";
import { dateSeed } from "@/lib/dates";
import { useTask } from "@/lib/engine";
import { taskSig } from "@/core/registry";
import { INK, PAPER, accentFor } from "@/core/base";
import TaskShell from "@/components/TaskShell";
import type { ThisOrThatTask } from "./types";

interface State {
  /** What the player picked per item, or null. */
  picks: (0 | 1 | null)[];
}

const THRESHOLD = 110;

interface BinItem {
  key: number;
  label: string;
  right: boolean;
  unattempted: boolean;
  actual: string;
  note?: string;
}

function Bin({
  side,
  label,
  remaining,
  items,
  highlighted,
  disabled,
  onClick,
  accent,
}: {
  side: 0 | 1;
  accent: string;
  label: string;
  remaining: number;
  items: BinItem[];
  highlighted: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      animate={{ backgroundColor: highlighted ? accent : PAPER, color: highlighted ? PAPER : INK }}
      className="flex h-full min-h-0 flex-col rounded-xl border-2 border-faint p-4 text-left"
      disabled={disabled}
    >
      <div className="flex items-baseline justify-between">
        <span className="text-xl font-bold">{label}</span>
        {!disabled && <span className="text-sm opacity-60">{remaining} left</span>}
      </div>
      <ul className="mt-3 min-h-0 flex-1 space-y-1 overflow-hidden text-sm">
        <AnimatePresence>
          {items.map((it) => (
            <motion.li
              key={it.key}
              layout
              initial={{ opacity: 0, x: side === 0 ? 30 : -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <span
                className={`rounded-md px-2 py-0.5 font-medium ${it.right ? "text-paper" : "border border-dashed border-muted text-muted"}`}
                style={it.right ? { background: accent } : undefined}
              >
                {it.label}
              </span>
              <span className="truncate text-xs text-muted">
                {!it.right && !it.unattempted ? `actually ${it.actual}. ` : ""}
                {it.note ?? ""}
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </motion.button>
  );
}

export default function ThisOrThat({ task, day, slot }: { task: ThisOrThatTask; day: string; slot: number }) {
  const n = task.items.length;
  const engine = useTask<State>(day, slot, n, taskSig(task), { picks: Array(n).fill(null) });
  const { p, setState, setCorrect, wrong, finish } = engine;
  const done = p.done;
  // Presentation order is shuffled per day so the two groups never simply alternate.
  const order = useMemo(
    () =>
      seededShuffle(
        Array.from({ length: n }, (_, i) => i),
        dateSeed(day) + slot * 7 + n,
      ),
    [n, day, slot],
  );
  const position = order.findIndex((i) => p.state.picks[i] === null);
  const current = position >= 0 ? order[position] : -1;
  const item = current >= 0 ? task.items[current] : null;
  const [hover, setHover] = useState<0 | 1 | null>(null);
  const [flyTo, setFlyTo] = useState<0 | 1 | null>(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-8, 8]);

  const remaining = (b: 0 | 1) => task.items.filter((it, i) => it.bucket === b && p.state.picks[i] === null).length;

  const pick = (b: 0 | 1) => {
    if (done || current < 0 || flyTo !== null) return;
    setFlyTo(b);
    const picks = [...p.state.picks];
    picks[current] = b;
    // Let the card fly off before committing the state.
    setTimeout(() => {
      setState((s) => ({ ...s, picks }));
      const right = task.items.filter((it, k) => picks[k] === it.bucket).length;
      if (b === task.items[current].bucket) setCorrect(right);
      else wrong();
      if (picks.every((v) => v !== null)) finish();
      setFlyTo(null);
      setHover(null);
      x.set(0);
    }, 180);
  };

  const onDrag = (_: unknown, info: PanInfo) => {
    setHover(info.offset.x < -THRESHOLD / 2 ? 0 : info.offset.x > THRESHOLD / 2 ? 1 : null);
  };
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -THRESHOLD) pick(0);
    else if (info.offset.x > THRESHOLD) pick(1);
    else setHover(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") pick(0);
      if (e.key === "ArrowRight") pick(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const binItems = (b: 0 | 1): BinItem[] =>
    order
      .map((i) => ({ it: task.items[i], i, picked: p.state.picks[i] }))
      .filter(({ it, picked }) => (done ? it.bucket === b : picked === b))
      .map(({ it, i, picked }) => ({
        key: i,
        label: it.label,
        right: picked === it.bucket,
        unattempted: picked === null,
        actual: task.buckets[it.bucket],
        note: it.note,
      }));

  const resolved = p.state.picks.filter((v) => v !== null).length;

  return (
    <TaskShell day={day} slot={slot} task={task} engine={engine} statusLabel={`${resolved} of ${n} sorted`}>
      <div className="grid h-full grid-cols-[1fr_320px_1fr] gap-6">
        <Bin side={0} label={task.buckets[0]} remaining={remaining(0)} items={binItems(0)} highlighted={hover === 0} disabled={done} onClick={() => pick(0)} accent={accentFor(slot)} />
        <div className="relative flex flex-col items-center justify-center">
          {!done && item && (
            <>
              {position + 1 < n && (
                <div className="absolute h-40 w-64 rounded-xl border border-faint bg-paper" style={{ transform: "translateY(12px) scale(0.94)" }} />
              )}
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={current}
                  drag="x"
                  dragSnapToOrigin
                  dragElastic={0.9}
                  onDrag={onDrag}
                  onDragEnd={onDragEnd}
                  style={{ x, rotate }}
                  initial={{ scale: 0.9, opacity: 0, y: 10 }}
                  animate={
                    flyTo === null
                      ? { scale: 1, opacity: 1, y: 0, x: 0 }
                      : { x: flyTo === 0 ? -420 : 420, opacity: 0, rotate: flyTo === 0 ? -12 : 12 }
                  }
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className="relative z-10 flex h-40 w-64 cursor-grab select-none items-center justify-center rounded-xl border border-faint bg-paper text-3xl font-bold shadow-[0_8px_0_var(--accent)] active:cursor-grabbing"
                >
                  {item.label}
                </motion.div>
              </AnimatePresence>
              <p className="mt-8 text-center text-xs text-muted">
                Drag left or right, click a group, or use the arrow keys.
                <br />
                {n - resolved} card{n - resolved === 1 ? "" : "s"} left.
              </p>
            </>
          )}
          {done && <p className="text-center text-sm text-muted">All sorted.</p>}
        </div>
        <Bin side={1} label={task.buckets[1]} remaining={remaining(1)} items={binItems(1)} highlighted={hover === 1} disabled={done} onClick={() => pick(1)} accent={accentFor(slot)} />
      </div>
    </TaskShell>
  );
}
