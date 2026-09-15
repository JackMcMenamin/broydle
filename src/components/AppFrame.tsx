"use client";
import type { CSSProperties } from "react";

/**
 * Fixed, non-scrolling page frame: accent bar, header, play area, action bar.
 * Everything a task needs must fit inside the play area.
 */
export default function AppFrame({
  top,
  bottom,
  children,
  wide,
  accent,
  scroll,
}: {
  top: React.ReactNode;
  bottom?: React.ReactNode;
  children: React.ReactNode;
  wide?: boolean;
  /** Per-task accent colour; exposed to children as the --accent CSS variable. */
  accent?: string;
  /** Let the play area scroll (used by the hub). Task pages stay fixed. */
  scroll?: boolean;
}) {
  const w = wide ? "max-w-6xl" : "max-w-5xl";
  const style = accent ? ({ "--accent": accent } as CSSProperties) : undefined;
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-paper text-ink" style={style}>
      {accent && <div className="h-1 shrink-0" style={{ background: accent }} />}
      <header className="shrink-0 border-b border-faint">
        <div className={`mx-auto w-full ${w} px-6 py-3`}>{top}</div>
      </header>
      <main className={`min-h-0 flex-1 ${scroll ? "overflow-y-auto" : "overflow-hidden"}`}>
        <div className={`mx-auto h-full w-full ${w} px-6 py-4`}>{children}</div>
      </main>
      {bottom && (
        <footer className="shrink-0 border-t border-faint">
          <div className={`mx-auto flex h-16 w-full ${w} items-center gap-3 px-6`}>{bottom}</div>
        </footer>
      )}
    </div>
  );
}
