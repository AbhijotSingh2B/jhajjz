import { cities } from "@/lib/site";
import { cityPoints, indiaMap, indiaOutline } from "@/lib/india-map";

// The head office is in Mohali, next to Chandigarh; at this scale they share one dot.
const headOffice = "Chandigarh";

/** Fine-line outline of India with a dot for each city in `cities` and a heavier one for the head office. */
export function IndiaMap({ className }: { className?: string }) {
  return (
    <figure className={className}>
      <svg
        viewBox={`0 0 ${indiaMap.width} ${indiaMap.height}`}
        role="img"
        aria-label={`Map of India marking ${cities.join(", ")}, with the head office in Mohali, near Chandigarh`}
        className="h-auto w-full"
      >
        <path
          d={indiaOutline}
          className="fill-paper stroke-ink/55"
          strokeWidth={1}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {cities
          .filter((c) => c !== headOffice && cityPoints[c])
          .map((c) => {
            const [x, y] = cityPoints[c];
            return <circle key={c} cx={x} cy={y} r={5.5} className="fill-gold-deep" />;
          })}
        {cityPoints[headOffice] && (
          <g>
            <circle cx={cityPoints[headOffice][0]} cy={cityPoints[headOffice][1]} r={11} className="fill-none stroke-ink" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
            <circle cx={cityPoints[headOffice][0]} cy={cityPoints[headOffice][1]} r={6.5} className="fill-ink" />
          </g>
        )}
      </svg>
      <figcaption className="mt-3 flex items-center gap-2.5 text-[14px] text-muted">
        <span aria-hidden="true" className="relative inline-flex size-[13px] items-center justify-center rounded-full border border-ink">
          <span className="size-[7px] rounded-full bg-ink" />
        </span>
        Head office, Mohali
      </figcaption>
    </figure>
  );
}
