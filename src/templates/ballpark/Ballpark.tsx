"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useTask } from "@/lib/engine";
import { taskSig } from "@/core/registry";
import TaskShell from "@/components/TaskShell";
import { Btn } from "@/components/ui";
import type { BallparkQuestion, BallparkTask } from "./types";

interface State {
  round: number;
  guesses: (number | null)[];
}

function fmt(v: number, q: BallparkQuestion) {
  const step = q.step ?? 1;
  if (step < 1) return v.toFixed(1);
  return q.plain ? String(Math.round(v)) : Math.round(v).toLocaleString();
}

const isHit = (g: number, q: BallparkQuestion) => Math.abs(g - q.answer) <= q.within;

export default function Ballpark({ task, day, slot }: { task: BallparkTask; day: number; slot: number }) {
  const n = task.questions.length;
  const engine = useTask<State>(day, slot, n, taskSig(task), { round: 0, guesses: Array(n).fill(null) });
  const { p, setState, setCorrect, wrong, finish } = engine;
  const r = Math.min(p.state.round, n - 1);
  const q = task.questions[r];
  const guess = p.state.guesses[r];
  const done = p.done;
  const [slider, setSlider] = useState<{ r: number; v: number } | null>(null);
  const val = slider && slider.r === r ? slider.v : (q.min + q.max) / 2;

  const lockIn = () => {
    if (guess !== null) return;
    const guesses = [...p.state.guesses];
    guesses[r] = val;
    setState((s) => ({ ...s, guesses }));
    if (isHit(val, q)) setCorrect(guesses.filter((g, k) => g !== null && isHit(g, task.questions[k])).length);
    else wrong();
  };
  const next = () => {
    if (r + 1 >= n) finish();
    else setState((s) => ({ ...s, round: r + 1 }));
  };

  const pct = (v: number) => ((v - q.min) / (q.max - q.min)) * 100;
  const hasImage = task.questions.some((x) => x.image);

  const actions = !done ? (
    guess === null ? (
      <Btn primary onClick={lockIn}>
        Lock it in
      </Btn>
    ) : (
      <Btn primary onClick={next}>
        {r + 1 >= n ? "Finish" : "Next →"}
      </Btn>
    )
  ) : null;

  const panel = (
    <div className="flex h-full flex-col justify-center">
      <div className="text-xs uppercase tracking-wider text-muted">Question {r + 1} of {n}</div>
      <AnimatePresence mode="wait">
        <motion.p
          key={r}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="mt-1 text-2xl font-bold"
        >
          {q.q}
        </motion.p>
      </AnimatePresence>
      <p className="mt-1 text-sm text-muted">Within {q.withinText ?? `${fmt(q.within, q)}${q.unit ? " " + q.unit : ""}`} counts.</p>

      <div className="mt-6">
        <div className="text-center text-5xl font-bold tabular-nums">
          {fmt(guess ?? val, q)}
          {q.unit && <span className="ml-2 text-lg font-normal text-muted">{q.unit}</span>}
        </div>
        <div className="relative mt-5 h-8">
          {guess !== null && (
            <>
              <div
                className="absolute top-3 h-2 rounded bg-faint"
                style={{
                  left: `${Math.max(0, pct(q.answer - q.within))}%`,
                  width: `${Math.min(100, pct(q.answer + q.within)) - Math.max(0, pct(q.answer - q.within))}%`,
                }}
              />
              <motion.div
                className="absolute top-0 h-8 w-1 bg-ink"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                style={{ left: `${pct(q.answer)}%` }}
              />
            </>
          )}
          <input
            type="range"
            min={q.min}
            max={q.max}
            step={q.step ?? 1}
            value={guess ?? val}
            disabled={guess !== null}
            onChange={(e) => setSlider({ r, v: Number(e.target.value) })}
            className="absolute top-2 w-full"
          />
        </div>
        <div className="flex justify-between text-xs text-muted">
          <span>{fmt(q.min, q)}</span>
          <span>{fmt(q.max, q)}</span>
        </div>
      </div>

      <AnimatePresence>
        {guess !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-5 rounded-lg border border-ink p-4 ${isHit(guess, q) ? "bg-(--accent) text-paper" : "bg-raise"}`}
          >
            <div className="text-xs uppercase tracking-wider opacity-70">{isHit(guess, q) ? "Close enough" : "Too far off"}</div>
            <div className="text-xl font-bold">
              Answer: {fmt(q.answer, q)}
              {q.unit ? ` ${q.unit}` : ""}
            </div>
            {q.note && <div className="mt-1 text-xs opacity-70">{q.note}</div>}
            {q.credit && <div className="mt-1 text-[11px] opacity-60">{q.credit}</div>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (done) {
    return (
      <TaskShell day={day} slot={slot} task={task} engine={engine} statusLabel="Finished">
        <div className={`grid h-full gap-3 ${hasImage ? "grid-cols-5" : "grid-cols-1 content-center"}`}>
          {task.questions.map((qq, k) => {
            const g = p.state.guesses[k];
            const hit = g !== null && isHit(g, qq);
            return (
              <div key={k} className={`flex min-h-0 flex-col rounded-lg border border-ink p-3 ${hit ? "bg-(--accent) text-paper" : ""}`}>
                {qq.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qq.image} alt="" className="mb-2 min-h-0 flex-1 rounded object-cover" />
                )}
                <div className="text-sm font-medium">{qq.q}</div>
                <div className="text-sm opacity-80">
                  {fmt(qq.answer, qq)}
                  {qq.unit ? ` ${qq.unit}` : ""} · you: {g === null ? "—" : fmt(g, qq)} {g === null ? "" : hit ? "✓" : "✗"}
                </div>
              </div>
            );
          })}
        </div>
      </TaskShell>
    );
  }

  return (
    <TaskShell day={day} slot={slot} task={task} engine={engine} statusLabel={`Question ${r + 1} of ${n}`} actions={actions}>
      {q.image ? (
        <div className="grid h-full grid-cols-[1fr_400px] gap-8">
          <div className="flex min-h-0 items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.img
                key={q.image}
                src={q.image}
                alt=""
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="max-h-full max-w-full rounded-lg border border-ink object-contain"
              />
            </AnimatePresence>
          </div>
          {panel}
        </div>
      ) : (
        <div className="mx-auto h-full max-w-2xl">{panel}</div>
      )}
    </TaskShell>
  );
}
