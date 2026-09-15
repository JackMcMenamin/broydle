"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { useMemo, useState, type CSSProperties } from "react";
import { readProgress, starsFor, useMounted, type Progress } from "@/lib/engine";
import { formatKey, todayKey } from "@/lib/dates";
import { APP_NAME, accentFor } from "@/core/base";
import { taskSig } from "@/core/registry";
import { DAYS, getDay } from "@/puzzles/days";
import AppFrame from "./AppFrame";
import { CopyButton, Hearts, Stars, Wordmark } from "./ui";
import { shareLine } from "./TaskShell";

export default function Hub({ date }: { date: string }) {
  const d = getDay(date);
  const mounted = useMounted();
  const [version, setVersion] = useState(0);
  const today = mounted ? todayKey() : date;
  const prog = useMemo<(Progress | null)[]>(
    () => (mounted && d ? d.tasks.map((t, i) => readProgress(date, i + 1, taskSig(t))) : []),
    // version forces a re-read after a reset
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mounted, d, date, version],
  );

  const idx = DAYS.findIndex((x) => x.date === date);
  const prev = idx > 0 ? DAYS[idx - 1] : undefined;
  const next = idx >= 0 && idx < DAYS.length - 1 && DAYS[idx + 1].date <= today ? DAYS[idx + 1] : undefined;

  const nav = "text-sm text-muted hover:text-ink";
  const navOff = "text-sm text-faint";
  const accentStyle = (i: number) => ({ "--accent": accentFor(i + 1) }) as CSSProperties;
  const starsEach = d ? d.tasks.map((_, i) => (prog[i] ? starsFor(prog[i]!.correct, prog[i]!.total) : 0)) : [];

  const top = (
    <div className="flex flex-col items-center gap-1">
      <h1 className="text-3xl font-extrabold tracking-tight">
        <Wordmark />
      </h1>
      <div className="flex items-center gap-4">
        {prev ? (
          <Link href={`/day/${prev.date}/`} className={nav}>
            &lsaquo; Prev
          </Link>
        ) : (
          <span className={navOff}>&lsaquo; Prev</span>
        )}
        <span className="text-sm text-muted">{mounted ? formatKey(date) : " "}</span>
        {next ? (
          <Link href={`/day/${next.date}/`} className={nav}>
            Next &rsaquo;
          </Link>
        ) : (
          <span className={navOff}>Next &rsaquo;</span>
        )}
      </div>
      {d && (
        <div className="mt-1 flex items-center gap-3">
          {d.tasks.map((_, i) => (
            <span key={i} style={accentStyle(i)} className="inline-flex">
              <Stars n={starsEach[i]} size={18} />
            </span>
          ))}
        </div>
      )}
    </div>
  );

  // Future days are scheduled but not playable yet.
  if (!d || (mounted && date > today)) {
    return (
      <AppFrame top={top} scroll>
        <div className="flex flex-col items-center justify-center gap-2 py-24 text-center text-muted">
          <p className="text-lg">{!d ? "Nothing scheduled for this day." : "Not yet. Come back on the day."}</p>
          <Link href="/" className="underline underline-offset-4 hover:text-ink">
            Today&rsquo;s puzzles
          </Link>
        </div>
      </AppFrame>
    );
  }

  const dayStars = starsEach.reduce((a, b) => a + b, 0);
  const shareText = [
    `${APP_NAME} · ${formatKey(date)} · ${dayStars}/12`,
    ...d.tasks.map((t, i) => shareLine(date, i + 1, t, starsEach[i], prog[i]?.hearts ?? 3)),
  ].join("\n");
  const resetDay = () => {
    d.tasks.forEach((_, i) => localStorage.removeItem(`broydle:${date}:s${i + 1}`));
    setVersion((v) => v + 1);
  };

  return (
    <AppFrame top={top} scroll>
      {/* First screen: cards and share only. Everything below is off-screen until you scroll. */}
      <div className="flex h-full flex-col justify-center gap-6">
        <div className="grid grid-cols-2 gap-5">
        {d.tasks.map((t, i) => {
          const p = prog[i];
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
                href={`/day/${date}/${i + 1}/`}
                className="flex min-h-[190px] flex-col overflow-hidden rounded-2xl border border-faint bg-raise transition-colors hover:border-(--accent)"
              >
                <div className="h-1.5 w-full" style={{ background: "var(--accent)" }} />
                <div className="flex flex-1 flex-col p-5">
                  <div className="text-2xl font-semibold" style={{ color: "var(--accent)" }}>
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
        <div className="flex justify-center">
          <CopyButton text={shareText} label="Share today's results" />
        </div>
      </div>

      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 pb-10 pt-10 text-center">
        <section className="w-full rounded-2xl border border-faint p-6 text-left text-sm text-muted">
          <h2 className="mb-2 font-semibold text-ink">How it works</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Four tasks a day, each a different type. Play the ones you like.</li>
            <li>Every task starts with 3 hearts. A wrong answer costs a heart. Lose all 3 and the task locks.</li>
            <li>Earn up to 3 dots per task for progress. You keep them even if you get locked out.</li>
            <li>Progress saves in your browser. Leave and come back any time.</li>
            <li>Use Prev to replay earlier days.</li>
          </ul>
        </section>
        <button onClick={resetDay} className="text-xs text-faint underline">
          reset this day
        </button>
      </div>
    </AppFrame>
  );
}
