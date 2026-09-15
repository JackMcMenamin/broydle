"use client";
import { motion } from "motion/react";
import { useState } from "react";
import { MAX_HEARTS } from "@/lib/engine";

const HEART_PATH =
  "M12 20.5c-.4 0-.8-.1-1.1-.4C6.6 16.4 3 13.2 3 9.3 3 6.6 5.1 4.5 7.8 4.5c1.6 0 3.1.8 4.2 2.1 1.1-1.3 2.6-2.1 4.2-2.1C18.9 4.5 21 6.6 21 9.3c0 3.9-3.6 7.1-7.9 10.8-.3.3-.7.4-1.1.4z";

const spring = { type: "spring", stiffness: 420, damping: 18 } as const;

/** Rounded hearts in the current accent colour. */
export function Hearts({ n, size = 20 }: { n: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${n} of ${MAX_HEARTS} hearts`}>
      {Array.from({ length: MAX_HEARTS }, (_, i) => {
        const on = i < n;
        return (
          <motion.svg
            key={`${i}-${on}`}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            transition={spring}
          >
            <path
              d={HEART_PATH}
              fill={on ? "var(--accent)" : "none"}
              stroke="var(--accent)"
              strokeWidth={1.8}
              opacity={on ? 1 : 0.45}
            />
          </motion.svg>
        );
      })}
    </span>
  );
}

/** Score dots in the current accent colour (kept as "Stars" for the engine's naming). */
export function Stars({ n, size = 20 }: { n: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${n} of 3 points`}>
      {Array.from({ length: 3 }, (_, i) => {
        const on = i < n;
        return (
          <motion.svg
            key={`${i}-${on}`}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            initial={{ scale: on ? 1.7 : 1 }}
            animate={{ scale: 1 }}
            transition={spring}
          >
            <circle
              cx={12}
              cy={12}
              r={8.5}
              fill={on ? "var(--accent)" : "none"}
              stroke="var(--accent)"
              strokeWidth={1.8}
              opacity={on ? 1 : 0.45}
            />
          </motion.svg>
        );
      })}
    </span>
  );
}

export function Btn({
  children,
  onClick,
  disabled,
  primary,
  small,
  className = "",
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  primary?: boolean;
  small?: boolean;
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      className={`rounded-full font-medium transition-colors
        ${small ? "px-3 py-1 text-sm" : "px-5 py-2.5"}
        ${primary ? "border border-(--accent) bg-(--accent) text-paper hover:opacity-90" : "border border-faint bg-paper hover:bg-raise"}
        disabled:opacity-30 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </motion.button>
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-paper"
      style={{ background: "var(--accent)" }}
    >
      {children}
    </span>
  );
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function CopyButton({ text, label = "Share result", primary }: { text: string; label?: string; primary?: boolean }) {
  const [state, setState] = useState<"idle" | "ok" | "fail">("idle");
  return (
    <Btn
      primary={primary}
      onClick={async () => {
        const ok = await copyText(text);
        setState(ok ? "ok" : "fail");
        setTimeout(() => setState("idle"), 1800);
      }}
    >
      {state === "ok" ? "Copied!" : state === "fail" ? "Could not copy" : label}
    </Btn>
  );
}

/** Text input styled for the game. */
export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-full border border-faint bg-raise px-4 py-2.5 text-lg outline-none focus:border-(--accent) ${props.className ?? ""}`}
    />
  );
}
