"use client";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";

/** Draws an image pixelated to `cells` blocks across; null draws it sharp. */
export default function PixelCanvas({ src, cells }: { src: string; cells: number | null }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const W = 1000;
      const H = Math.round((W * img.naturalHeight) / img.naturalWidth);
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      if (cells === null) {
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(img, 0, 0, W, H);
        return;
      }
      const sw = cells;
      const sh = Math.max(1, Math.round((cells * H) / W));
      const small = document.createElement("canvas");
      small.width = sw;
      small.height = sh;
      const sctx = small.getContext("2d");
      if (!sctx) return;
      sctx.imageSmoothingEnabled = true;
      sctx.drawImage(img, 0, 0, sw, sh);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(small, 0, 0, sw, sh, 0, 0, W, H);
    };
  }, [src, cells]);
  return (
    <motion.canvas
      key={`${src}-${cells}`}
      ref={ref}
      initial={{ opacity: 0.4, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45 }}
      className="pixelated max-h-full max-w-full rounded-lg border border-faint"
    />
  );
}
