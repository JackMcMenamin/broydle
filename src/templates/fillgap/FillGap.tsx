"use client";
import { motion } from "motion/react";
import { useState } from "react";
import { useTask } from "@/lib/engine";
import { taskSig } from "@/core/registry";
import { matches } from "@/lib/answers";
import TaskShell from "@/components/TaskShell";
import type { FillGapTask } from "./types";

interface State {
  solved: boolean[];
  attempts: string[][];
}

export default function FillGap({ task, day, slot }: { task: FillGapTask; day: number; slot: number }) {
  const n = task.gaps.length;
  const engine = useTask<State>(day, slot, n, taskSig(task), { solved: Array(n).fill(false), attempts: task.gaps.map(() => []) });
  const { p, setState, setCorrect, wrong, finish } = engine;
  const [text, setText] = useState<string[]>(Array(n).fill(""));
  const [shake, setShake] = useState<{ i: number; k: number } | null>(null);
  const done = p.done;

  const submit = (i: number) => {
    const guess = text[i].trim();
    if (!guess || done || p.state.solved[i]) return;
    const g = task.gaps[i];
    if (matches(guess, g.answer, g.aliases)) {
      const solved = [...p.state.solved];
      solved[i] = true;
      setState((s) => ({ ...s, solved }));
      setCorrect(solved.filter(Boolean).length);
      if (solved.every(Boolean)) finish();
      // move focus to the next empty gap
      const nextIdx = solved.findIndex((v, k) => !v && k > i);
      const target = nextIdx >= 0 ? nextIdx : solved.findIndex((v) => !v);
      if (target >= 0) setTimeout(() => document.getElementById(`gap-${target}`)?.focus(), 50);
    } else {
      setState((s) => ({ ...s, attempts: s.attempts.map((a, k) => (k === i ? [...a, guess] : a)) }));
      setShake((s) => ({ i, k: (s?.k ?? 0) + 1 }));
      wrong();
    }
    setText((t) => t.map((v, k) => (k === i ? "" : v)));
  };

  const solvedCount = p.state.solved.filter(Boolean).length;

  return (
    <TaskShell day={day} slot={slot} task={task} engine={engine} statusLabel={`${solvedCount} of ${n} filled`}>
      <ol className="flex h-full flex-col justify-center gap-3">
        {task.gaps.map((g, i) => {
          const solved = p.state.solved[i];
          const show = solved || done;
          return (
            <motion.li
              key={`${i}-${shake?.i === i ? shake.k : 0}`}
              animate={shake?.i === i ? { x: [0, -8, 8, -5, 5, 0] } : {}}
              transition={{ duration: 0.3 }}
              className={`rounded-xl border border-faint px-5 py-3 ${solved ? "bg-raise" : ""}`}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submit(i);
                }}
                className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xl"
              >
                {g.before.map((w, k) => (
                  <span key={k}>{w},</span>
                ))}
                {show ? (
                  <motion.span
                    initial={{ scale: 0.7 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 16 }}
                    className={`rounded-md px-3 py-0.5 font-bold ${solved ? "bg-(--accent) text-paper" : "border-2 border-dashed border-ink"}`}
                  >
                    {g.answer}
                  </motion.span>
                ) : (
                  <input
                    id={`gap-${i}`}
                    value={text[i]}
                    onChange={(e) => setText((t) => t.map((v, k) => (k === i ? e.target.value : v)))}
                    placeholder="?"
                    autoFocus={i === p.state.solved.findIndex((v) => !v)}
                    autoComplete="off"
                    className="w-40 rounded-md border border-faint px-3 py-0.5 text-xl outline-none focus:ring-2 focus:ring-(--accent)/40"
                    aria-label={`Gap ${i + 1}`}
                  />
                )}
                {g.after.map((w, k) => (
                  <span key={k}>, {w}</span>
                ))}
                <span className="ml-auto text-xs text-muted">
                  {show && g.note ? g.note + " " : ""}
                  {p.state.attempts[i].length > 0 && <span className="line-through">{p.state.attempts[i].join(", ")}</span>}
                </span>
              </form>
            </motion.li>
          );
        })}
      </ol>
    </TaskShell>
  );
}
