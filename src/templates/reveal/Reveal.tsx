"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useTask } from "@/lib/engine";
import { taskSig } from "@/core/registry";
import { matches } from "@/lib/answers";
import TaskShell from "@/components/TaskShell";
import { Btn, TextInput } from "@/components/ui";
import type { RevealTask } from "./types";
import { REVEAL_STAGES } from "./types";
import PixelCanvas from "./elements/PixelCanvas";
import ZoomView from "./elements/ZoomView";
import Silhouette from "./elements/Silhouette";

const PIXEL_CELLS = [6, 10, 16, 28];
const ZOOM_SCALES = [11, 6.5, 3.6, 2];

interface State {
  current: number;
  stage: number[];
  /** true solved, false failed, null pending */
  status: (boolean | null)[];
  guesses: string[][];
}

function HintRow({ label, value, unlocked }: { label: string; value: string; unlocked: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-paper px-3 py-2 text-sm">
      <span className="text-muted">{label}</span>
      <span className={unlocked ? "font-medium" : "text-faint"}>{unlocked ? value : "locked"}</span>
    </div>
  );
}

export default function Reveal({ task, day, slot }: { task: RevealTask; day: string; slot: number }) {
  const n = task.items.length;
  const engine = useTask<State>(day, slot, n, taskSig(task), {
    current: 0,
    stage: Array(n).fill(0),
    status: Array(n).fill(null),
    guesses: task.items.map(() => []),
  });
  const { p, setState, setCorrect, wrong, finish } = engine;
  const i = Math.min(p.state.current, n - 1);
  const item = task.items[i];
  const status = p.state.status[i];
  const stage = p.state.stage[i];
  const done = p.done;
  const revealed = status !== null || done;
  const [text, setText] = useState("");
  const [shake, setShake] = useState(0);

  const goTo = (k: number) => setState((s) => ({ ...s, current: k }));
  const nextPending = (from: number) => {
    for (let k = 1; k <= n; k++) {
      const idx = (from + k) % n;
      if (p.state.status[idx] === null) return idx;
    }
    return -1;
  };

  const submit = () => {
    const guess = text.trim();
    if (!guess || revealed) return;
    setText("");
    const record = (s: State) => ({ ...s, guesses: s.guesses.map((g, k) => (k === i ? [...g, guess] : g)) });
    if (matches(guess, item.answer, item.aliases)) {
      const st = [...p.state.status];
      st[i] = true;
      setState((s) => ({ ...record(s), status: st }));
      setCorrect(st.filter((x) => x === true).length);
      if (st.every((x) => x !== null)) finish();
      return;
    }
    setShake((k) => k + 1);
    if (stage < REVEAL_STAGES - 1) {
      setState((s) => ({ ...record(s), stage: s.stage.map((v, k) => (k === i ? v + 1 : v)) }));
    } else {
      const st = [...p.state.status];
      st[i] = false;
      setState((s) => ({ ...record(s), status: st }));
      wrong();
      if (st.every((x) => x !== null)) finish();
    }
  };

  const stepsLeft = REVEAL_STAGES - 1 - stage;
  const letters = item.answer.replace(/[^a-z]/gi, "").length;

  /** Spend a free reveal step without guessing. */
  const revealMore = () => {
    if (revealed || stepsLeft <= 0) return;
    setState((s) => ({ ...s, stage: s.stage.map((v, k) => (k === i ? v + 1 : v)) }));
  };

  const visual =
    task.variant === "pixelate" ? (
      <PixelCanvas src={item.src!} cells={revealed ? null : PIXEL_CELLS[stage]} />
    ) : task.variant === "zoom" ? (
      <ZoomView src={item.src!} scale={revealed ? 1 : ZOOM_SCALES[stage]} focus={item.focus} />
    ) : (
      <Silhouette country={item.country!} />
    );

  const nextIdx = nextPending(i);
  const noun = task.variant === "silhouette" ? "Outline" : "Picture";

  return (
    <TaskShell
      day={day}
      slot={slot}
      task={task}
      engine={engine}
      wide
      actions={
        !done &&
        nextIdx !== -1 &&
        nextIdx !== i && (
          <Btn primary onClick={() => goTo(nextIdx)}>
            Next unsolved &rarr;
          </Btn>
        )
      }
    >
      <div className="grid h-full grid-cols-[minmax(0,1fr)_380px] gap-8">
        {/* Left: catalog tabs + visual, left-aligned */}
        <div className="flex min-h-0 flex-col gap-4">
          <div className="flex shrink-0 gap-2">
            {task.items.map((_, k) => {
              const s = p.state.status[k];
              const active = k === i;
              const cls = active
                ? "border-(--accent) bg-(--accent) text-paper"
                : s === true
                  ? "border-faint bg-faint text-ink"
                  : s === false
                    ? "border-dashed border-faint bg-transparent text-muted"
                    : "border-faint bg-raise text-ink hover:border-(--accent)";
              return (
                <motion.button
                  key={k}
                  onClick={() => goTo(k)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex h-11 w-16 items-center justify-center gap-1 rounded-xl border text-sm font-semibold transition-colors ${cls}`}
                  aria-label={`${noun} ${k + 1}`}
                >
                  {k + 1}
                  {s !== null && <span className="text-xs">{s ? "✓" : "✗"}</span>}
                </motion.button>
              );
            })}
          </div>
          <div className="relative min-h-0 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {visual}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right: guessing panel */}
        <aside className="flex min-h-0 flex-col rounded-2xl border border-faint bg-raise p-5">
          <div className="flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-wider text-muted">
              {noun} {i + 1} of {n}
            </span>
            <span className="text-xs text-muted">
              {revealed ? "revealed" : stepsLeft > 0 ? `${stepsLeft} free step${stepsLeft === 1 ? "" : "s"} left` : "last chance"}
            </span>
          </div>
          <div className="mt-2 flex gap-1">
            {Array.from({ length: REVEAL_STAGES }, (_, k) => (
              <motion.span
                key={k}
                animate={{ opacity: k <= stage || revealed ? 1 : 0.25 }}
                className="h-1.5 flex-1 rounded-full"
                style={{ background: "var(--accent)" }}
              />
            ))}
          </div>
          <div className="mt-4 space-y-1.5">
            <HintRow label="Hint" value={item.hint ?? ""} unlocked={revealed || stage >= 2} />
            <HintRow label="Letters" value={String(letters)} unlocked={revealed || stage >= 3} />
          </div>

          <AnimatePresence mode="wait">
            {!revealed ? (
              <motion.form
                key="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
                className="mt-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div key={shake} animate={shake ? { x: [0, -8, 8, -5, 5, 0] } : {}} transition={{ duration: 0.35 }}>
                  <TextInput
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="What is it?"
                    autoFocus
                    autoComplete="off"
                    className="bg-paper"
                  />
                </motion.div>
                <Btn primary type="submit" className="mt-2 w-full">
                  Guess
                </Btn>
                <Btn className="mt-2 w-full" onClick={revealMore} disabled={stepsLeft <= 0}>
                  {stepsLeft > 0 ? "Reveal more" : "Nothing left to reveal"}
                </Btn>
              </motion.form>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-5 rounded-xl p-4 ${status ? "bg-(--accent) text-paper" : "border border-dashed border-faint bg-paper"}`}
              >
                <div className="text-xs uppercase tracking-wider opacity-70">
                  {status === true ? "Correct" : status === false ? "Missed" : "Answer"}
                </div>
                <div className="text-2xl font-bold">{item.answer}</div>
                {item.credit && <div className="mt-2 text-[11px] opacity-60">{item.credit}</div>}
              </motion.div>
            )}
          </AnimatePresence>

          {p.state.guesses[i].length > 0 && (
            <div className="mt-auto pt-3 text-xs text-muted">
              Guessed: <span className="line-through">{p.state.guesses[i].join(", ")}</span>
            </div>
          )}
        </aside>
      </div>
    </TaskShell>
  );
}
