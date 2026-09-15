import { notFound } from "next/navigation";
import Hub from "@/components/Hub";
import { DAYS } from "@/puzzles/days";

export const dynamicParams = false;

export function generateStaticParams() {
  return DAYS.map((d) => ({ day: d.date }));
}

export default async function DayPage({ params }: { params: Promise<{ day: string }> }) {
  const { day } = await params;
  if (!DAYS.some((d) => d.date === day)) notFound();
  return <Hub date={day} />;
}
