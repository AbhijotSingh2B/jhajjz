import { cities, contact } from "@/lib/site";
import { cityPoints, headOfficePoint, indiaMap, indiaOutline } from "@/lib/india-map";

// The Mohali head office's number (the client gave +91 98036 00001 for it).
const officePhone = contact.phones[0];

/** Fine-line outline of India with a dot for each city in `cities` and a heavier one for the Mohali head office. */
export function IndiaMap({ className }: { className?: string }) {
  const [hx, hy] = headOfficePoint;
  return (
    <figure className={className}>
      <svg
        viewBox={`0 0 ${indiaMap.width} ${indiaMap.height}`}
        role="img"
        aria-label={`Map of India marking ${cities.join(", ")}, and the head office in Mohali`}
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
          .filter((c) => cityPoints[c])
          .map((c) => {
            const [x, y] = cityPoints[c];
            // The paper-coloured outline keeps neighbouring cities (Delhi/Gurgaon, the four Uttarakhand towns)
            // reading as separate dots instead of merging into a smudge.
            return (
              <circle
                key={c}
                cx={x}
                cy={y}
                r={5.5}
                className="fill-gold-deep stroke-paper"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        <circle cx={hx} cy={hy} r={11} className="fill-paper stroke-ink" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
        <circle cx={hx} cy={hy} r={6.5} className="fill-ink" />
      </svg>
      <figcaption className="mt-3 text-[14px] text-muted">
        <span className="flex items-center gap-2.5">
          <span aria-hidden="true" className="inline-flex size-[13px] items-center justify-center rounded-full border border-ink">
            <span className="size-[7px] rounded-full bg-ink" />
          </span>
          Head office, Mohali
        </span>
        <a
          href={officePhone.href}
          className="inline-flex min-h-11 items-center pl-[23px] tabular-nums underline-offset-4 transition-colors hover:text-ink hover:underline"
        >
          {officePhone.label}
        </a>
      </figcaption>
    </figure>
  );
}
