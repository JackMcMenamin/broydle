"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { useMemo, useState, type CSSProperties } from "react";
import { readProgress, starsFor, useMounted, type Progress } from "@/lib/engine";
import { APP_NAME, accentFor, roman } from "@/core/base";
import { taskSig } from "@/core/registry";
import { DAYS, getDay } from "@/puzzles/days";
import AppFrame from "./AppFrame";
import { Badge, CopyButton, Hearts, Stars, Wordmark } from "./ui";
import { shareLine } from "./TaskShell";

/** Demo days are labelled with dates counting from today. */
function dateLabel(day: number): string {
  const d = new Date();
  d.setDate(d.getDate() + (day - 1));
  const n = d.getDate();
  const suffix = n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th";
  return `${d.toLocaleDateString("en-GB", { weekday: "long" })}, ${d.toLocaleDateString("en-GB", { month: "long" })} ${n}${suffix}`;
}

export default function Hub({ day }: { day: number }) {
  const d = getDay(day);
  const mounted = useMounted();
  const [version, setVersion] = useState(0);
  const prog = useMemo<(Progress | null)[]>(
    () => (mounted && d ? d.tasks.map((t, i) => readProgress(day, i + 1, taskSig(t))) : []),
    // version forces a re-read after a reset
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mounted, d, day, version],
  );

  if (!d) return <main className="p-4">No such day.</main>;

  const total = DAYS.length;
  const starsEach = d.tasks.map((_, i) => {
    const p = prog[i];
    return p ? starsFor(p.correct, p.total) : 0;
  });
  const dayStars = starsEach.reduce((a, b) => a + b, 0);

  const shareText = [
    `${APP_NAME} · ${dateLabel(day)} · ${dayStars}/12`,
    ...d.tasks.map((t, i) => shareLine(day, i + 1, t, starsEach[i], prog[i]?.hearts ?? 3)),
  ].join("\n");

  const resetDay = () => {
    d.tasks.forEach((_, i) => localStorage.removeItem(`broydle:d${day}:s${i + 1}`));
    setVersion((v) => v + 1);
  };

  const accentStyle = (i: number) => ({ "--accent": accentFor(i + 1) }) as CSSProperties;
  const nav = "text-sm text-muted hover:text-ink";
  const navOff = "text-sm text-faint";

  const top = (
    <div className="flex flex-col items-center gap-1">
      <h1 className="text-3xl font-extrabold tracking-tight">
        <Wordmark />
      </h1>
      <div className="flex items-center gap-4">
        {day > 1 ? (
          <Link href={`/day/${day - 1}/`} className={nav}>
            &lsaquo; Prev
          </Link>
        ) : (
          <span className={navOff}>&lsaquo; Prev</span>
        )}
        <span className="text-sm text-muted">{mounted ? dateLabel(day) : " "}</span>
        {day < total ? (
          <Link href={`/day/${day + 1}/`} className={nav}>
            Next &rsaquo;
          </Link>
        ) : (
          <span className={navOff}>Next &rsaquo;</span>
        )}
      </div>
      <div className="mt-1 flex items-center gap-3">
        {d.tasks.map((_, i) => (
          <span key={i} style={accentStyle(i)} className="inline-flex">
            <Stars n={mounted ? starsEach[i] : 0} size={18} />
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <AppFrame top={top} scroll>
      <div className="grid grid-cols-2 gap-5 pt-2">
        {d.tasks.map((t, i) => {
          const p = prog[i];
          const status = !p
            ? "Not started"
            : p.revealed
              ? "Revealed"
              : p.locked
                ? "Locked"
                : p.done
                  ? "Done"
                  : "In progress";
          return (
            <motion.div
              key={i}
              style={accentStyle(i)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, type: "spring", stiffness: 260, damping: 22 }}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.99 }}
            >
              <Link
                href={`/day/${day}/${i + 1}/`}
                className="flex min-h-[210px] flex-col overflow-hidden rounded-2xl border border-faint bg-raise transition-colors hover:border-(--accent)"
              >
                <div className="h-1.5 w-full" style={{ background: "var(--accent)" }} />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2">
                    <Badge>{t.series}</Badge>
                    <span className="text-xs text-muted">{roman(t.edition)}</span>
                    <span className="ml-auto text-[11px] uppercase tracking-wider text-muted">{status}</span>
                  </div>
                  <div className="mt-3 text-2xl font-bold" style={{ color: "var(--accent)" }}>
                    {t.title}
                  </div>
                  <div className="mt-1 text-muted">{t.blurb}</div>
                  <div className="mt-auto flex items-center gap-4 pt-4">
                    <Stars n={starsEach[i]} />
                    <Hearts n={p?.hearts ?? 3} />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Below the fold: scroll for this */}
      <div className="mx-auto mt-10 flex max-w-xl flex-col items-center gap-6 pb-10 text-center">
        <CopyButton text={shareText} label="Share today's results" />
        <section className="w-full rounded-2xl border border-faint p-6 text-left text-sm text-muted">
          <h2 className="mb-2 font-semibold text-ink">How it works</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Four tasks a day, each a different type. Play the ones you like.</li>
            <li>Every task starts with 3 hearts. A wrong answer costs a heart. Lose all 3 and the task locks.</li>
            <li>Earn up to 3 dots per task for progress. You keep them even if you get locked out.</li>
            <li>Progress saves in your browser. Leave and come back any time.</li>
            <li>Demo: use Prev / Next to hop between the four demo days.</li>
          </ul>
        </section>
        <button onClick={resetDay} className="text-xs text-faint underline">
          reset this day (demo)
        </button>
      </div>
    </AppFrame>
  );
}
