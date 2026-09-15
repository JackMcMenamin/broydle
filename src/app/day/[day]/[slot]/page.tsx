import { notFound } from "next/navigation";
import TaskView from "@/components/TaskView";
import { DAYS } from "@/puzzles/days";

export const dynamicParams = false;

export function generateStaticParams() {
  return DAYS.flatMap((d) => d.tasks.map((_, i) => ({ day: d.date, slot: String(i + 1) })));
}

export default async function TaskPage({ params }: { params: Promise<{ day: string; slot: string }> }) {
  const { day, slot } = await params;
  const s = Number(slot);
  if (!DAYS.some((d) => d.date === day) || s < 1 || s > 4) notFound();
  return <TaskView day={day} slot={s} />;
}
