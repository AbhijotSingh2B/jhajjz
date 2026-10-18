import Image from "next/image";
import Link from "next/link";
import { IllustrativeTag } from "@/components/illustrative-tag";
import { cn } from "@/lib/utils";
import { carName, carYears, type Car } from "@/lib/site";

/** A small photo-and-name card (`frame`: background behind studio cut-outs, to stand off the section colour) linking to a car page ("Looking at other cars?", other model years). */
export function CarPreview({ car, frame = "bg-sand", className }: { car: Car; frame?: string; className?: string }) {
  const photo = car.photos[0];
  const years = carYears(car);
  return (
    <Link href={`/fleet/${car.slug}`} className={cn("group block", className)}>
      <div className={cn("relative aspect-[3/2] overflow-hidden", photo?.cutout ? frame : "bg-stone")}>
        {photo && (
          // The multiply sits on this wrapper: a scaled (zoomed) element is its own stacking context.
          <div
            className={cn("absolute inset-0", photo.cutout && "mix-blend-multiply")}
            style={{ transform: photo.zoom ? `scale(${photo.zoom})` : undefined }}
          >
            <Image
              src={photo.src}
              alt=""
              fill
              sizes="240px"
              className={cn(
                "transition-transform duration-700 ease-out group-hover:scale-[1.03]",
                photo.cutout ? "object-contain p-3" : photo.portrait ? "object-contain" : "object-cover",
              )}
              style={{ objectPosition: photo.position }}
            />
          </div>
        )}
        {photo?.placeholder && <IllustrativeTag />}
      </div>
      <p className="mt-2.5 text-[16px] leading-snug font-medium text-ink underline decoration-transparent underline-offset-[5px] transition-colors group-hover:decoration-ink/40">
        {carName(car)}
      </p>
      {years && <p className="mt-0.5 text-[15px] text-muted">{years}</p>}
    </Link>
  );
}
