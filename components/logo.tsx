import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * The Jhajj'z monogram: two Js from Libre Caslon Display (the heading font, SIL OFL), the second set lower
 * and to the right so its top serif meets the first J's stem. Outlines exported with fontTools; same
 * drawing as app/icon.svg.
 */
const J1 =
  "M117 849Q83 849 83 814L84 785Q84 764 73 752Q62 740 42 740Q23 740 11.5 752Q0 764 0 784Q0 817 31 839Q62 861 109 861Q146 861 179 844.5Q212 828 232 799Q250 773 257.5 735.5Q265 698 265 633V16L347 8V0H106V8L188 16V710Q188 773 168.5 811Q149 849 117 849Z";
const J2 =
  "M267 999Q233 999 233 964L234 935Q234 914 223 902Q212 890 192 890Q173 890 161.5 902Q150 914 150 934Q150 967 181 989Q212 1011 259 1011Q296 1011 329 994.5Q362 978 382 949Q400 923 407.5 885.5Q415 848 415 783V166L497 158V150H256V158L338 166V860Q338 923 318.5 961Q299 999 267 999Z";

/**
 * "hajj'z" from the same font, set after J1 on its baseline (x = left edge, font units). Drawn as outlines
 * so the opening looks right before the web font has loaded.
 */
const letters = [
  {
    x: 384,
    d: "M822 682V690H635V682L696 674V419Q696 378 694 359.5Q692 341 686 329Q678 312 660 302.5Q642 293 618 293Q566 293 528 336V674L589 682V690H402V682L463 674V37L404 15V8L520 -31H528V321Q559 289 592.5 272.5Q626 256 659 256Q689 256 713.5 269Q738 282 750 305Q757 318 759 340.5Q761 363 761 419V674Z",
  },
  {
    x: 837,
    d: "M880 602Q880 552 925.5 522Q971 492 1080 470V379Q1080 321 1067 298.5Q1054 276 1022 276Q991 276 972 292.5Q953 309 953 337L954 364Q954 389 944.5 403.5Q935 418 918 418Q903 418 893.5 408Q884 398 884 382Q884 358 907.5 329.5Q931 301 968 282Q1013 257 1061 257Q1089 257 1108.5 268Q1128 279 1137 299Q1142 312 1143.5 331Q1145 350 1145 404V595Q1145 631 1152 644.5Q1159 658 1177 658Q1204 658 1217 639L1221 641Q1209 666 1189 679.5Q1169 693 1146 693Q1120 693 1103 677.5Q1086 662 1084 636L1081 635Q1058 664 1028 680.5Q998 697 967 697Q929 697 904.5 670.5Q880 644 880 602ZM1080 622V481Q1028 494 999.5 507Q971 520 959 538Q947 556 947 583Q947 618 964 638.5Q981 659 1010 659Q1031 659 1049.5 649.5Q1068 640 1080 622Z",
  },
  {
    x: 1228,
    d: "M1336 64Q1357 64 1370.5 77.5Q1384 91 1384 112Q1384 133 1370.5 146.5Q1357 160 1336 160Q1315 160 1301.5 146.5Q1288 133 1288 112Q1288 91 1301.5 77.5Q1315 64 1336 64ZM1252 918Q1236 918 1228 909.5Q1220 901 1215 878Q1210 858 1200.5 848.5Q1191 839 1176 839Q1159 839 1148.5 850Q1138 861 1138 879Q1138 905 1159.5 921Q1181 937 1215 937Q1257 937 1292.5 913.5Q1328 890 1351 848Q1365 822 1369.5 785Q1374 748 1374 650V256H1366L1250 295V302L1309 324V792Q1309 857 1295 887.5Q1281 918 1252 918Z",
  },
  {
    x: 1446,
    d: "M1554 64Q1575 64 1588.5 77.5Q1602 91 1602 112Q1602 133 1588.5 146.5Q1575 160 1554 160Q1533 160 1519.5 146.5Q1506 133 1506 112Q1506 91 1519.5 77.5Q1533 64 1554 64ZM1470 918Q1454 918 1446 909.5Q1438 901 1433 878Q1428 858 1418.5 848.5Q1409 839 1394 839Q1377 839 1366.5 850Q1356 861 1356 879Q1356 905 1377.5 921Q1399 937 1433 937Q1475 937 1510.5 913.5Q1546 890 1569 848Q1583 822 1587.5 785Q1592 748 1592 650V256H1584L1468 295V302L1527 324V792Q1527 857 1513 887.5Q1499 918 1470 918Z",
  },
  {
    x: 1664,
    d: "M1727 45Q1721 15 1721 6Q1721 -24 1748 -24Q1775 -24 1775 6Q1775 20 1768 46Q1761 79 1757 107.5Q1753 136 1753 180H1743Q1743 109 1727 45Z",
  },
  {
    x: 1832,
    d: "M1880 412 1895 413Q1905 362 1929 296L1935 280H2111L1863 668V690H2170L2176 536L2162 535Q2145 600 2124 657L2117 675H1931L2181 288V266H1889Z",
  },
];
/** The second "j" of "hajj" is the one that becomes J2. */
const lastJ = 3;

/** Mark + "Jhajj'z" as text (footer). */
export function Logo({
  className,
  markClassName = "h-10",
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <svg
        viewBox="0 0 497 1011"
        aria-hidden="true"
        className={cn("w-auto shrink-0 fill-gold", markClassName)}
      >
        <path d={J1} />
        <path d={J2} />
      </svg>
      <span>Jhajj&apos;z</span>
    </span>
  );
}

/**
 * Header logo. With `intro` it opens as the name "Jhajj'z" (gold J, cream "hajj'z") at text size: the other
 * letters fold into the J, the last "j" slides down into place as the second J, and the whole grows into the
 * monogram. CSS keyframes in globals.css, so it starts with the first paint; reduced motion shows the
 * monogram straight away.
 */
export function LogoMark({ intro = false }: { intro?: boolean }) {
  if (!intro) {
    return (
      <svg
        viewBox="0 0 497 1011"
        aria-hidden="true"
        className="h-10 w-auto fill-gold"
      >
        <path d={J1} />
        <path d={J2} />
      </svg>
    );
  }
  // Wide enough for the name at text size (26px type in a 40px-high mark).
  return (
    <svg
      viewBox="0 0 1460 1011"
      aria-hidden="true"
      className="logo-intro h-10 w-auto overflow-visible"
    >
      <g className="logo-word">
        <path className="fill-gold" d={J1} />
        <path className="logo-j2 fill-gold" d={J2} />
        {letters.map((l, i) => (
          <path
            key={i}
            d={l.d}
            className={cn(
              "fill-cream",
              i === lastJ ? "logo-last-j" : "logo-letter",
            )}
            style={
              i === lastJ
                ? undefined
                : ({
                    "--dx": `${(54 - l.x) * 0.6}px`,
                    "--delay": `${650 + (5 - i) * 40}ms`,
                  } as CSSProperties)
            }
          />
        ))}
      </g>
    </svg>
  );
}
