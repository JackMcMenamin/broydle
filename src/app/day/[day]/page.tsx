import { notFound } from "next/navigation";
import Hub from "@/components/Hub";
import { DAYS } from "@/puzzles/days";

export const dynamicParams = false;

export function generateStaticParams() {
  return DAYS.map((d) => ({ day: String(d.day) }));
}

export default async function DayPage({ params }: { params: Promise<{ day: string }> }) {
  const { day } = await params;
  const n = Number(day);
  if (!DAYS.some((d) => d.day === n)) notFound();
  return <Hub day={n} />;
}
