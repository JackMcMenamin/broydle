"use client";
import { useMounted } from "@/lib/engine";
import { todayKey } from "@/lib/dates";
import { latestDayUpTo } from "@/puzzles/days";
import Hub from "./Hub";

/** The home page: today's puzzles, or the most recent day if today has none scheduled. */
export default function TodayHub() {
  const mounted = useMounted();
  if (!mounted) return <main className="h-dvh bg-paper" />;
  const today = todayKey();
  const day = latestDayUpTo(today);
  return <Hub date={day?.date ?? today} />;
}
