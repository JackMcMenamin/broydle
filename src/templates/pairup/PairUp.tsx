"use client";
import { motion, type PanInfo } from "motion/react";
import { useMemo, useState } from "react";
import { useTask } from "@/lib/engine";
import { taskSig } from "@/core/registry";
import { seededShuffle } from "@/lib/answers";
import { dateSeed } from "@/lib/dates";
import TaskShell from "@/components/TaskShell";
import type { PairUpTask } from "./types";

interface State {
  matched: number[];
  misses: [number, number][];
}

export default function PairUp({ task, day, slot }: { task: PairUpTask; day: string; slot: number }) {
  const n = task.pairs.length;
  const engine = useTask<State>(day, slot, n, taskSig(task), { matched: [], misses: [] });
  const { p, setState, setCorrect, wrong, finish } = engine;
  const [sel, setSel] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [shakeR, setShakeR] = useState<{ j: number; k: number } | null>(null);
  const done = p.done;

  const rightOrder = useMemo(
    () =>
      seededShuffle(
        Array.from({ length: n }, (_, i) => i),
        dateSeed(day) + slot * 7 + 3,
      ),
    [n, day, slot],
  );

  const isMatched = (i: number) => p.state.matched.includes(i);

  const attempt = (i: number, j: number) => {
    if (done || isMatched(i) || isMatched(j)) return;
    if (i === j) {
      const matched = [...p.state.matched, j];
      setState((s) => ({ ...s, matched }));
      setCorrect(matched.length);
      if (matched.length === n) finish();
    } else {
      setState((s) => ({ ...s, misses: [...s.misses, [i, j]] }));
      setShakeR((k) => ({ j, k: (k?.k ?? 0) + 1 }));
      wrong();
    }
    setSel(null);
  };

  const rightUnderPointer = (info: PanInfo): number | null => {
    const el = document.elementFromPoint(info.point.x - window.scrollX, info.point.y - window.scrollY);
    const tile = el?.closest<HTMLElement>("[data-right]");
    if (!tile) return null;
    const j = Number(tile.dataset.right);
    return isMatched(j) ? null : j;
  };

  const tile = (active: boolean, matched: boolean, extra = "") =>
    `w-full rounded-lg border border-faint px-4 py-2.5 text-left font-medium select-none
     ${matched ? "bg-(--accent) text-paper opacity-90" : active ? "bg-(--accent) text-paper" : "bg-paper hover:bg-raise"} ${extra}`;

  return (
    <TaskShell day={day} slot={slot} task={task} engine={engine} statusLabel={`${p.state.matched.length} of ${n} matched`}>
      <div className="flex h-full flex-col">
        <div className="mb-2 grid grid-cols-[1fr_120px_1fr] text-xs uppercase tracking-wider text-muted">
          <span>{task.leftLabel}</span>
          <span className="text-center">{task.verb}</span>
          <span>{task.rightLabel}</span>
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-[1fr_120px_1fr] gap-x-0 gap-y-2">
          {task.pairs.map((pr, i) => {
            const m = isMatched(i);
            const j = rightOrder[i];
            const mj = isMatched(j);
            return (
              <div key={i} className="contents">
                <motion.div
                  drag={!m && !done ? true : false}
                  dragSnapToOrigin
                  dragElastic={0.6}
                  whileDrag={{ scale: 1.04, zIndex: 50, boxShadow: "0 10px 24px rgba(0,0,0,0.25)" }}
                  onDragStart={() => {
                    setDragging(i);
                    setSel(i);
                  }}
                  onDrag={(_, info) => setOver(rightUnderPointer(info))}
                  onDragEnd={(_, info) => {
                    const j2 = rightUnderPointer(info);
                    setDragging(null);
                    setOver(null);
                    if (j2 !== null) attempt(i, j2);
                  }}
                  onClick={() => {
                    if (m || done) return;
                    setSel(sel === i ? null : i);
                  }}
                  className={tile(sel === i && dragging === null, m, m || done ? "" : "cursor-grab active:cursor-grabbing")}
                  style={{ position: "relative" }}
                >
                  {pr.left}
                  {m && <span className="float-right text-sm opacity-70">✓</span>}
                </motion.div>
                <div className="flex items-center justify-center text-faint">
                  {m ? <span className="text-ink">→</span> : "·"}
                </div>
                <motion.button
                  data-right={j}
                  key={`r-${j}-${shakeR?.j === j ? shakeR.k : 0}`}
                  animate={shakeR?.j === j ? { x: [0, -8, 8, -5, 5, 0] } : { scale: over === j ? 1.04 : 1 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => {
                    if (sel === null || mj || done) return;
                    attempt(sel, j);
                  }}
                  disabled={mj || done}
                  className={tile(over === j, mj, sel !== null && !mj ? "cursor-pointer" : "")}
                >
                  {task.pairs[j].right}
                </motion.button>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex h-6 shrink-0 items-center gap-4 text-xs text-muted">
          <span>
            {done
              ? "All pairs shown."
              : sel === null
                ? `Drag a ${task.leftLabel.toLowerCase()} onto its ${task.rightLabel.toLowerCase()}, or click one then the other.`
                : `Now pick the ${task.rightLabel.toLowerCase()} for “${task.pairs[sel].left}”.`}
          </span>
          {p.state.misses.length > 0 && (
            <span className="ml-auto truncate">
              Missed:{" "}
              {p.state.misses.map(([l, r], k) => (
                <span key={k} className="mr-2 line-through">
                  {task.pairs[l].left} / {task.pairs[r].right}
                </span>
              ))}
            </span>
          )}
        </div>
        {done && p.state.matched.length < n && (
          <div className="mt-1 shrink-0 text-xs text-muted">
            Answers: {task.pairs.map((pr) => `${pr.left} → ${pr.right}`).join(" · ")}
          </div>
        )}
      </div>
    </TaskShell>
  );
}
