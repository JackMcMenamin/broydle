"use client";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

const noop = () => () => {};
/** True once the component is running in the browser after hydration. */
export function useMounted(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

export const MAX_HEARTS = 3;

export interface Progress<S = unknown> {
  /** Signature of the task this progress belongs to; mismatches are discarded. */
  sig?: string;
  hearts: number;
  /** Units answered correctly so far. */
  correct: number;
  /** Total units in the task. */
  total: number;
  /** Task finished (all units resolved), locked, or revealed. */
  done: boolean;
  locked: boolean;
  revealed: boolean;
  /** Component-specific state. */
  state: S;
}

export function starsFor(correct: number, total: number): number {
  if (total <= 0) return 0;
  if (correct >= total) return 3;
  if (correct >= (2 * total) / 3) return 2;
  if (correct >= total / 3) return 1;
  return 0;
}

export const storageKey = (day: string, slot: number) => `broydle:${day}:s${slot}`;

export function readProgress(day: string, slot: number, sig?: string): Progress | null {
  try {
    const raw = localStorage.getItem(storageKey(day, slot));
    if (!raw) return null;
    const stored = JSON.parse(raw) as Progress;
    if (sig !== undefined && stored.sig !== sig) return null;
    return stored;
  } catch {
    return null;
  }
}

export interface Engine<S> {
  p: Progress<S>;
  loaded: boolean;
  stars: number;
  setState: (updater: (s: S) => S) => void;
  setCorrect: (n: number) => void;
  wrong: () => void;
  finish: () => void;
  reveal: () => void;
  reset: () => void;
}

export function useTask<S>(day: string, slot: number, total: number, sig: string, initialState: S): Engine<S> {
  const key = storageKey(day, slot);
  const fresh = useCallback(
    (): Progress<S> => ({
      sig,
      hearts: MAX_HEARTS,
      correct: 0,
      total,
      done: false,
      locked: false,
      revealed: false,
      state: initialState,
    }),
    // initialState is a literal per task; safe to treat as stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [total, sig],
  );
  // Components using this hook are only mounted client-side (see useMounted),
  // so the lazy initialiser can read localStorage directly.
  const [p, setP] = useState<Progress<S>>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const stored = JSON.parse(raw) as Progress<S>;
        if (stored.sig === sig) return stored;
      }
    } catch {}
    return fresh();
  });
  const loaded = true;

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(p));
    } catch {}
  }, [p, key]);

  const setState = useCallback((updater: (s: S) => S) => {
    setP((prev) => ({ ...prev, state: updater(prev.state) }));
  }, []);
  const setCorrect = useCallback((n: number) => {
    setP((prev) => ({ ...prev, correct: Math.max(prev.correct, n) }));
  }, []);
  const wrong = useCallback(() => {
    setP((prev) => {
      const hearts = Math.max(0, prev.hearts - 1);
      const locked = hearts === 0;
      return { ...prev, hearts, locked, done: prev.done || locked };
    });
  }, []);
  const finish = useCallback(() => setP((prev) => ({ ...prev, done: true })), []);
  const reveal = useCallback(() => setP((prev) => ({ ...prev, revealed: true, done: true })), []);
  const reset = useCallback(() => setP(fresh()), [fresh]);

  return {
    p,
    loaded,
    stars: starsFor(p.correct, p.total),
    setState,
    setCorrect,
    wrong,
    finish,
    reveal,
    reset,
  };
}
