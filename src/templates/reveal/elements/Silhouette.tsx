"use client";
import { motion } from "motion/react";
import { useMemo } from "react";
import { geoAzimuthalEqualArea, geoCentroid, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import countriesTopo from "world-atlas/countries-50m.json";

const SIZE = 420;

type CountryProps = { name: string };

function countryFeature(name: string) {
  const topo = countriesTopo as unknown as Topology<{ countries: GeometryCollection<CountryProps> }>;
  const fc = feature(topo, topo.objects.countries);
  return fc.features.find((f) => f.properties?.name === name) ?? null;
}

/** Renders one country's outline, centred and scaled to fit, with no neighbours. */
export default function Silhouette({ country }: { country: string }) {
  const d = useMemo(() => {
    const f = countryFeature(country);
    if (!f) return "";
    const [cx, cy] = geoCentroid(f);
    const projection = geoAzimuthalEqualArea()
      .rotate([-cx, -cy])
      .fitExtent(
        [
          [24, 24],
          [SIZE - 24, SIZE - 24],
        ],
        f,
      );
    return geoPath(projection)(f) ?? "";
  }, [country]);

  return (
    <motion.svg
      key={country}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="h-full w-auto max-w-full rounded-lg border border-faint bg-paper"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {d ? <path d={d} fill="var(--accent)" /> : <text x={SIZE / 2} y={SIZE / 2} textAnchor="middle">outline missing: {country}</text>}
    </motion.svg>
  );
}
