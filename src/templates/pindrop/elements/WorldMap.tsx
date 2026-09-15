"use client";
import { useMemo, useRef } from "react";
import { geoEquirectangular, geoGraticule10, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import landTopo from "world-atlas/land-110m.json";

export const MAP_W = 960;
export const MAP_H = 480;

export function useProjection() {
  return useMemo(() => {
    const projection = geoEquirectangular()
      .scale(MAP_W / (2 * Math.PI))
      .translate([MAP_W / 2, MAP_H / 2]);
    const path = geoPath(projection);
    const topo = landTopo as unknown as Topology<{ land: GeometryCollection }>;
    const land = feature(topo, topo.objects.land);
    return { projection, landPath: path(land) ?? "", gratPath: path(geoGraticule10()) ?? "" };
  }, []);
}

/**
 * Equirectangular world map. Calls onPick with [lat, lng] when clicked.
 * Children are rendered on top in map coordinates.
 */
export default function WorldMap({
  onPick,
  interactive,
  children,
}: {
  onPick?: (lat: number, lng: number) => void;
  interactive: boolean;
  children?: React.ReactNode;
}) {
  const { projection, landPath, gratPath } = useProjection();
  const ref = useRef<SVGSVGElement>(null);

  const handle = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!interactive || !onPick) return;
    const svg = ref.current;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const { x, y } = pt.matrixTransform(ctm.inverse());
    const inv = projection.invert?.([x, y]);
    if (!inv) return;
    onPick(inv[1], inv[0]);
  };

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      onClick={handle}
      className={`max-h-full max-w-full rounded-lg border border-faint bg-paper ${interactive ? "cursor-crosshair" : ""}`}
    >
      <path d={gratPath} fill="none" stroke="var(--raise)" strokeWidth={0.8} />
      <path d={landPath} fill="var(--faint)" stroke="var(--muted)" strokeWidth={0.5} />
      {children}
    </svg>
  );
}
