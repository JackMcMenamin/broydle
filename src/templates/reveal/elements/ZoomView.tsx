"use client";

/** Shows an image zoomed in around a focal point; scale 1 shows the whole image. */
export default function ZoomView({
  src,
  scale,
  focus = [0.5, 0.5],
}: {
  src: string;
  scale: number;
  focus?: [number, number];
}) {
  return (
    <div className="relative aspect-[4/3] max-h-full w-full overflow-hidden rounded-lg border border-faint bg-raise">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        draggable={false}
        className="h-full w-full select-none object-cover"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: `${focus[0] * 100}% ${focus[1] * 100}%`,
          transition: "transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      />
    </div>
  );
}
