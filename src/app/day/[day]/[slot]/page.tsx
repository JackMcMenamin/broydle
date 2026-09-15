import { notFound } from "next/navigation";
import TaskView from "@/components/TaskView";
import { DAYS } from "@/puzzles/days";

export const dynamicParams = false;

export function generateStaticParams() {
  return DAYS.flatMap((d) => d.tasks.map((_, i) => ({ day: String(d.day), slot: String(i + 1) })));
}

export default async function TaskPage({ params }: { params: Promise<{ day: string; slot: string }> }) {
  const { day, slot } = await params;
  const n = Number(day);
  const s = Number(slot);
  if (!DAYS.some((d) => d.day === n) || s < 1 || s > 4) notFound();
  return <TaskView day={n} slot={s} />;
}
