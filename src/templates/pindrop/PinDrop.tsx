"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useTask } from "@/lib/engine";
import { taskSig } from "@/core/registry";
import { haversineKm } from "@/lib/geo";
import TaskShell from "@/components/TaskShell";
import { Btn } from "@/components/ui";
import type { PinDropTask } from "./types";
import WorldMap, { useProjection } from "./elements/WorldMap";

interface Guess {
  lat: number;
  lng: number;
  km: number;
}
interface State {
  round: number;
  guesses: (Guess | null)[];
}

export default function PinDrop({ task, day, slot }: { task: PinDropTask; day: string; slot: number }) {
  const n = task.places.length;
  const engine = useTask<State>(day, slot, n, taskSig(task), { round: 0, guesses: Array(n).fill(null) });
  const { p, setState, setCorrect, wrong, finish } = engine;
  const { projection } = useProjection();
  const r = Math.min(p.state.round, n - 1);
  const place = task.places[r];
  const guess = p.state.guesses[r];
  const done = p.done;
  const [pending, setPending] = useState<{ lat: number; lng: number } | null>(null);

  const project = (lat: number, lng: number) => projection([lng, lat]) ?? [0, 0];

  const confirm = () => {
    if (!pending || guess) return;
    const km = Math.round(haversineKm(pending.lat, pending.lng, place.lat, place.lng));
    const guesses = [...p.state.guesses];
    guesses[r] = { ...pending, km };
    setState((s) => ({ ...s, guesses }));
    setPending(null);
    if (km <= task.tolerance) setCorrect(guesses.filter((g) => g && g.km <= task.tolerance).length);
    else wrong();
  };

  const next = () => {
    if (r + 1 >= n) finish();
    else setState((s) => ({ ...s, round: r + 1 }));
  };

  const shown = done ? task.places.map((_, k) => k) : [r];

  const actions = !done ? (
    guess ? (
      <Btn primary onClick={next}>
        {r + 1 >= n ? "Finish" : "Next place →"}
      </Btn>
    ) : (
      <Btn primary onClick={confirm} disabled={!pending}>
        Confirm pin
      </Btn>
    )
  ) : null;

  return (
    <TaskShell
      day={day}
      slot={slot}
      task={task}
      engine={engine}
      statusLabel={`Place ${r + 1} of ${n}`}
      actions={actions}
      wide
    >
      <div className="flex h-full flex-col gap-3">
        <div className="flex shrink-0 items-baseline gap-4">
          <span className="text-xs uppercase tracking-wider text-muted">{task.theme}</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={done ? "done" : r}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="text-2xl font-bold"
            >
              {done ? "All places" : place.name}
            </motion.span>
          </AnimatePresence>
          {!done && place.hint && <span className="text-sm text-muted">({place.hint})</span>}
          <span className="ml-auto text-sm text-muted">
            {done
              ? ""
              : guess
                ? `${guess.km.toLocaleString()} km off · ${guess.km <= task.tolerance ? "counts!" : `over ${task.tolerance.toLocaleString()} km, that costs a heart`}`
                : pending
                  ? "Click again to move the pin, then confirm"
                  : "Click the map to drop a pin"}
          </span>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center">
          <WorldMap interactive={!done && !guess} onPick={(lat, lng) => setPending({ lat, lng })}>
            {/* pending pin */}
            {pending && !guess && (
              <motion.g
                key={`${pending.lat}-${pending.lng}`}
                initial={{ y: -14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              >
                <circle cx={project(pending.lat, pending.lng)[0]} cy={project(pending.lat, pending.lng)[1]} r={7} fill="var(--paper)" stroke="var(--accent)" strokeWidth={3} />
              </motion.g>
            )}
            {shown.map((k) => {
              const pl = task.places[k];
              const g = p.state.guesses[k];
              const [tx, ty] = project(pl.lat, pl.lng);
              if (!g && !done) return null;
              return (
                <g key={k}>
                  {g && (
                    <>
                      <motion.line
                        x1={project(g.lat, g.lng)[0]}
                        y1={project(g.lat, g.lng)[1]}
                        x2={tx}
                        y2={ty}
                        stroke="var(--ink)"
                        strokeDasharray="5 4"
                        strokeWidth={1.4}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.6 }}
                      />
                      <circle cx={project(g.lat, g.lng)[0]} cy={project(g.lat, g.lng)[1]} r={6} fill="var(--paper)" stroke="var(--ink)" strokeWidth={2} />
                    </>
                  )}
                  <motion.circle
                    cx={tx}
                    cy={ty}
                    r={6}
                    fill="var(--accent)"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 16 }}
                    style={{ transformOrigin: `${tx}px ${ty}px` }}
                  />
                  {(done || g) && (
                    <text x={tx + 10} y={ty + 4} fontSize={13} fill="var(--ink)" fontWeight={600}>
                      {pl.name}
                      {g ? ` · ${g.km.toLocaleString()} km ${g.km <= task.tolerance ? "✓" : "✗"}` : ""}
                    </text>
                  )}
                </g>
              );
            })}
          </WorldMap>
        </div>
        <p className="shrink-0 text-xs text-muted">Hollow pin = yours. Solid = the real spot.</p>
      </div>
    </TaskShell>
  );
}
