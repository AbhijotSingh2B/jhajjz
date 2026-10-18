import savedPhotos from "./saved-photos.json";

// Single source of truth for the client's facts. Everything here comes from
// jhajjz.in (Oct 2026). Don't invent stats, models or contact details — use
// [BRACKETS] for anything the client still has to confirm.

export const contact = {
  phones: [
    { label: "+91 98036 00001", href: "tel:+919803600001" },
    // Hidden: +91 98144 00019 doesn't appear to be Jhajj'z's number. Restore only once the client confirms it.
    // { label: "+91 98144 00019", href: "tel:+919814400019" },
    // Hidden, to confirm with the client: +91 98036 00002 is probably theirs (next number after the main one) but
    // nobody has verified it. Restore only once confirmed; phones feeds the footer, popups and JSON-LD.
    // { label: "+91 98036 00002", href: "tel:+919803600002" },
  ],
  whatsapp: "https://wa.me/919803600001",
  email: "info.jhajjz@gmail.com",
  address: ["SSS-106, 107, PCA Stadium Road", "Sector 63, Mohali (SAS Nagar), Punjab"],
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Jhajj'z, SSS-106, 107, PCA Stadium Road, Sector 63, Mohali, Punjab"),
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/jhajjz_transport/" },
    { label: "Instagram (Delhi)", href: "https://www.instagram.com/jhajjz_limos_delhi/" },
    { label: "LinkedIn", href: "https://in.linkedin.com/company/jhajjz" },
    { label: "YouTube", href: "https://www.youtube.com/@JhajjzTheTransporters" },
    { label: "Facebook", href: "https://www.facebook.com/HIRE.CONVERTIBLES.LUXURY.WEDDING.CORPORATE.CARS" },
    { label: "X", href: "https://x.com/Jhajjztransport" },
  ],
};

export const founded = 1998;

// The live domain (currently the Wix site; this build replaces it at launch). Canonical URLs, the sitemap and
// structured data all point here. Search engines are told not to index any other host (see proxy.ts).
export const siteUrl = "https://www.jhajjz.in";

// Every photo is saved in /public/photos and served from this site. The original URLs stay in this file as the
// backup: `saved()` swaps each one for its local copy (lib/saved-photos.json), and falls back to the original for a
// photo that hasn't been saved yet. After adding or changing a photo URL, run `npm run save-photos`.
// To go back to loading from the original hosts, empty lib/saved-photos.json to `{}`.
/** Original URLs of every photo, for scripts/save-photos.mjs. */
export const photoSources = new Set<string>();
const saved = (url: string) => {
  photoSources.add(url);
  return (savedPhotos as Record<string, string>)[url] ?? url;
};
/**
 * Absolute URL of a local photo, for link previews and structured data (they need one). Uses the domain the site is
 * deployed on (Vercel sets it: jhajjz.vercel.app now, www.jhajjz.in once that points at Vercel), so preview links
 * show their image before launch. Server-side only; falls back to `siteUrl`.
 */
export const absoluteUrl = (src: string) => {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return src.startsWith("/") ? `${host ? `https://${host}` : siteUrl}${src}` : src;
};
export const siteName = "Jhajj'z";

// Structured address for search engines. Same facts as `contact.address`; no postcode, it isn't on jhajjz.in.
export const postalAddress = {
  streetAddress: "SSS-106, 107, PCA Stadium Road, Sector 63",
  addressLocality: "Mohali",
  addressRegion: "Punjab",
  addressCountry: "IN",
};

// Hero photo. The client's own sharing image from jhajjz.in is used for now.
// /public/rolls-royce-hero.webp (from the v0 reference, likely AI-generated)
// is kept as an alternative — swap the value below to use it instead.
// `heroImage` (JPEG) is the sharing image for link previews, which don't all accept WebP; the page shows the WebP
// copies. Images aren't optimized by Next/Vercel (next.config.ts), so these URLs are what visitors download.
const hero = "https://static.wixstatic.com/media/171684_54ce935d2c1143669a4ad9a04866731d~mv2.jpg/v1/fill";
export const heroImage = saved(`${hero}/w_2400,h_1600,al_c,q_85/hero.jpg`);
export const heroPhoto = saved(`${hero}/w_2400,h_1600,al_c,q_80/hero.webp`);
export const heroThumb = saved(`${hero}/w_640,h_640,al_c,q_80/hero.webp`);

export const cities = [
  "Chandigarh",
  "New Delhi",
  "Gurgaon",
  "Jaipur",
  "Udaipur",
  "Mumbai",
  "Chennai",
  "Kolkata",
  "Bhubaneswar",
  "Dehradun",
  "Mussoorie",
  "Rishikesh",
  "Haridwar",
  "Ropar",
];

// Jhajj'z works pan-India; the cities above are where it has stations. Forms
// offer this for trips that start anywhere else.
/** wa.me link for one of the phone numbers (tel: href in, chat link out), optionally with a prefilled message. */
export const whatsappUrl = (telHref: string, text?: string) =>
  `https://wa.me/${telHref.replace(/\D/g, "")}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const otherCity = "Other city in India";
export const cityOptions = [...cities, otherCity];

// The same 9 services as jhajjz.in, grouped by who books them.
// One of the client's own photos per group (from jhajjz.in), shown in the "Who we drive for" rows.
const groupPhoto = (id: string) => saved(`https://static.wixstatic.com/media/${id}~mv2.jpg/v1/fill/w_1200,h_800,al_c,q_80/photo.webp`);

export const serviceGroups = [
  {
    title: "Weddings & events",
    photo: { src: groupPhoto("171684_c3987d8a36be4e0c8aaf707439a6ed96"), alt: "Jhajj'z cars decorated with red ribbon for a wedding, seen from above" },
    items: [
      { title: "Weddings", text: "Couple, family and guest transport." },
      { title: "Events & conferences", text: "Moving guests between venues and hotels." },
      { title: "Photoshoots", text: "Vintage, sports and convertible cars." },
    ],
  },
  {
    title: "Corporate & VIP",
    photo: { src: groupPhoto("171684_bc6e0cdbab524b7184ceec501d071b4d"), alt: "Jhajj'z chauffeur beside a white BMW 7 Series with Taj branding" },
    items: [
      { title: "VIP delegations", text: "Convoys for official and state visits." },
      { title: "Hotel travel desks", text: "On-site desks at 5-star hotels." },
      { title: "Airline crew handling", text: "Crew pickups and drops on schedule." },
      { title: "Employee transport", text: "Daily office commutes for companies." },
    ],
  },
  {
    title: "Personal travel",
    photo: { src: groupPhoto("171684_d1fc70691c5d49a992df3e11337b6f7a"), alt: "Jhajj'z chauffeur beside a black Toyota Innova Crysta" },
    items: [
      { title: "Chauffeur-driven cars", text: "By the hour, day or month." },
      { title: "City tours", text: "Sightseeing with a local driver." },
    ],
  },
];

export const occasions = [
  "Wedding",
  "Corporate / VIP",
  "Event or conference",
  "Airport transfer",
  "Photoshoot",
  "Long-term hire",
  "City tour",
  "Other",
];

// Wix-hosted photos from the current site. The image-to-category mapping was
// taken from the order on the live homepage and has NOT been visually checked
// — confirm each one with the client (see CLAUDE.md, "Open items").
// Wix converts to WebP when the URL ends in .webp (about 45% smaller than its JPEG at this size).
const wix = (id: string) => saved(`https://static.wixstatic.com/media/${id}~mv2.jpg/v1/fill/w_1600,h_1067,al_c,q_80/photo.webp`);
// Whole photo, uncropped (for portrait shots; the page crops them with `position`).
const wixFit = (file: string) => saved(`https://static.wixstatic.com/media/${file}/v1/fit/w_1600,h_1600,q_80/photo.webp`);
const wixJpeg = (id: string) => saved(`https://static.wixstatic.com/media/${id}~mv2.jpeg/v1/fill/w_1600,h_1067,al_c,q_80/photo.webp`);

export type FleetGroup = "cars" | "classic" | "suv" | "group";

export type Vehicle = {
  slug: string;
  name: string;
  group: FleetGroup;
  text: string;
  /** Leave out until the client sends a real photo; the card then shows a highlighted [CONFIRM]. */
  image?: string;
  imageAlt?: string;
  /** CarWale stand-in (see `CarPhoto.placeholder`). Remove before public launch. */
  imagePlaceholder?: true;
  /** Studio shot on white: shown whole on sand (see `CarPhoto.cutout`). */
  imageCutout?: true;
  /** See `CarPhoto.zoom`. */
  imageZoom?: number;
};

// Photos from jhajjz.in. Identified by eye from Nirmal's screenshots of the preview (Oct 2026); the cars carry
// Jhajj'z plates and branding. Each class uses the photo that actually shows it.
export const photos = {
  bmw7Series: wix("171684_e2b3a2de810b49f1bd9066aa63ea5b47"),
  ghost: wixJpeg("171684_d0d46c5c136c43b6a41d577ba308dc77"),
  vintage: wix("171684_274fc280da2a49fb8271fb19015aac77"),
  audiCabriolet: wixJpeg("171684_b92c4c7fbc4544efaa3155a9e1b7ea5a"),
  limousine: wix("171684_230878eccc5e4a129225562dc3625aa5"),
  defender: wix("171684_96f78bb8e63b4a268e76e533cd6eb5af"),
  lineUp: wix("171684_1c9a798a6e444d7493d964f19512fbe7"),
  coaches: wix("171684_0af879bb5488447795fdb167404077b1"),
  vellfire: wixJpeg("171684_1371098b103945e981bf18c1563c7087"),
  sClass: wixJpeg("171684_5f7c84e40f8a4d4d9e1fbc126d6b8673"),
  rangeRover: wix("171684_34f6a3c7ace442ce9bb98320a8461cb3"),
  rangeRoverWedding: wixFit("171684_dde8a95bb3094d8fa204c7beb8cd8411~mv2.jpeg"),
  gls: wixFit("171684_122b8dc9756a461b9be68c186c6e04fb~mv2.jpeg"),
  hiace: wix("171684_0ef65ad782b14ebcbaa2dde8890be4f2"),
  // More of the client's photos from jhajjz.in, for the car-page carousels (portrait ones uncropped).
  ghostFlowers: wix("171684_38297c26f8cf4a2db12d5a03cc4b6d3c"),
  ghostSide: wix("171684_74f0227a52764832a86fc2535d0629b1"),
  ghostFront: wixFit("171684_d0d46c5c136c43b6a41d577ba308dc77~mv2.jpeg"),
  ghostLimos: wixFit("171684_6862724d9e604e18a04f3077c78c8111~mv2.jpeg"),
  ghostRear: wixFit("171684_1a756eb340244935bef2e654a951f2f7~mv2.jpeg"),
  sClassOlderWedding: wixFit("171684_bdcd704f2f9149b88f89217fa0d35a8e~mv2.jpeg"),
  sClassOlderChauffeur: wixFit("171684_b60a1812890b41d0b527a16fdfac26b9~mv2.jpg"),
  bmw7SeriesNewer: wix("171684_e914dd0c32c84a088d89030041e4f73c"),
  bmw7SeriesChauffeur: wix("171684_bc6e0cdbab524b7184ceec501d071b4d"),
  vellfireFront: wix("171684_741c780861be4775a9719e00e1b86272"),
  vellfireFlowers: wix("171684_a0891d0448854e7a9e4021fe16586b55"),
  vellfirePortrait: wixFit("171684_1371098b103945e981bf18c1563c7087~mv2.jpeg"),
  limousineTree: wixFit("171684_4e26a4cccdf7484fb9b0abe3fd9fbbbd~mv2.jpg"),
  audiSunset: wixFit("171684_b92c4c7fbc4544efaa3155a9e1b7ea5a~mv2.jpeg"),
  audiAbove: wixFit("171684_51c707a64ff645a6b827e8e2f725dc6d~mv2.jpg"),
  sClassOlderSilver: wix("171684_54ce935d2c1143669a4ad9a04866731d"),
  sClassOlderWhite: wix("171684_802ac0228de44308b45ad59a065c0542"),
  bmwX7: wixFit("171684_0f7ec1a1dc534c71bae4d52224b1a906~mv2.jpg"),
  fPace: wixFit("171684_14d2bd8bde1f4f21b0ac524e9aa17aed~mv2.png"),
  gClassBlack: wixFit("171684_1e6d9cf11df8432a9213fb8b8626de1d~mv2.jpg"),
  gClassWhite: wixFit("171684_8eeb67bdb2c048b582f2fbc622da8e24~mv2.jpg"),
  vClass: wixJpeg("171684_2c1d32861eec49088dbb8a5f8d6abbbe"),
  rangeRoverSportWedding: wixFit("171684_2ddf2c32246a480496a520f3bebc5a3c~mv2.png"),
  rangeRoverSportFront: wixFit("171684_70c708cf855e45c4bd02a91e15391a84~mv2.jpg"),
  rangeRoverSportBlue: wix("171684_d579ac12078a431ebbd000a307471bf8"),
  eClass: wixFit("171684_64da252c780f4817bb018b0e9bc800bb~mv2.png"),
  eClassOlderWedding: wixFit("171684_d0a1c5d7ba6b46d79023cb7002020974~mv2.jpg"),
  flyingSpur: wixJpeg("171684_9a263a9503ca45a692784946f6d5cc34"),
  maybachGls: wix("171684_aa22a48d457b42e987fff34e2eb08550"),
  hiaceSide: wix("171684_c7d78ab1cd9b4c3dbd9766cd79d35603"),
  innovaCrysta: wix("171684_d1fc70691c5d49a992df3e11337b6f7a"),
  jaguarXj: wix("171684_d6742c74994b45778c8f50bc0ed52817"),
  audiQ7: wixFit("171684_d95eac75e6314492bd61b5a29577a3f1~mv2.jpg"),
  bmwLineUp: wix("171684_ea339aad2cb8490cb5d8d1e38d055a29"), // BMW X5, BMW i8 and a Range Rover on the road
  ghostSilver: wixJpeg("171684_3bae57ad0f5348dbb59d4c51ce5ed205"),
  forceUrbania: wix("171684_93c797d72e81473ba9e78345d7a49391"),
  weddingLineUpGle: wix("171684_12c0dc2805044efb842caad88abfe2f4"), // black GLE in front of a decorated wedding line-up
};

// PLACEHOLDER: CarWale studio shots on white (from each model's colours page), matched to the generation and colour
// of the client's own car. CarWale/maker copyright: remove before public launch (see "Launch checklist" in CLAUDE.md).
// Leaving out `wm=1` from CarWale's URL gives the photo without their watermark.
const carwaleColour = (id: string) => saved(`https://imgd.aeplcdn.com/1280x720/n/${id}.jpg?q=80`);
// CarDekho's colours pages work the same way (studio shot on white); used where CarWale has no match.
const cardekhoColour = (path: string) => saved(`https://stimg.cardekho.com/images/car-images/930x620/${path}`);
export const studio = {
  ghost: cardekhoColour("Rolls-Royce/Ghost/8051/1602847337627/235_silver_7b7d7f.jpg"), // Ghost 2014–2020 (CarDekho), Silver
  sClass: carwaleColour("y2ehbua_1541075"), // S-Class 2021 generation, Onyx Black
  bmw7Series: carwaleColour("tp798sa_1468095"), // 7 Series 2019–2023, Alpine White
  rangeRover: carwaleColour("af5du3a_1590443"), // current Range Rover, Fuji White
  rangeRoverOlder: carwaleColour("zwiuqsa_1477720"), // Range Rover 2018–2022, Fuji White
  gls: carwaleColour("xonshcb_1709837"), // current GLS, Polar White
  gle: carwaleColour("64nn4bb_1697927"), // current GLE, Polar White
  landCruiser: carwaleColour("4uen40b_1643915"), // Land Cruiser, Precious White Pearl
  vellfire: carwaleColour("48e4tsa_1481285"), // Vellfire 2020–2023, Pearl White
  defender: carwaleColour("m77deeb_1759635"), // Defender, Santorini Black
  eClass: carwaleColour("4vqrueb_1779981"), // current E-Class, Polar White
  bmwX7: carwaleColour("lpa894a_1517731"), // X7 2019–2023, Alpine White
  bmwX5: carwaleColour("mzvepra_1422179"), // X5 2014–2019, Alpine White
  bmwI8: carwaleColour("7zigura_1428550"), // i8 2015–2019, Crystal White
  fPace: carwaleColour("lp8crsa_1477901"), // F-Pace 2016–2021, Fuji White
  jaguarXj: carwaleColour("vwrmrsa_1478302"), // XJ L, Fuji White
  gClass: carwaleColour("vohua9b_1783719"), // Mercedes-AMG G 63, Obsidian Black
  innovaCrysta: carwaleColour("p8d49jb_1950184"), // Innova Crysta, Attitude Black Mica
  audiQ7: carwaleColour("93c7oua_1555653"), // Q7 2022–2024, Carrara White
  rangeRoverSport: carwaleColour("2x5uqsa_1477733"), // Range Rover Sport 2018–2022, Fuji White
  gleOlder: carwaleColour("stahtsa_1480771"), // GLE 2020–2023, Obsidian Black
  urbania: cardekhoColour("Force/Urbania/11849/1721042241113/221_Gray_414142.jpg"), // Urbania (CarDekho), Grey
  maybachGls: carwaleColour("uvkhafb_1810183"),
  // A3 Cabriolet before the 2017 facelift, red, roof down, transparent PNG (only 561px wide). Link from Nirmal; it's on
  // the site of Pannu Car Rental, another Chandigarh rental company, but is a maker's render, not a photo of their car.
  audiA3Cabriolet: saved("https://www.pannucarrental.com/uploads/topics/16353351209623.png"), // Maybach GLS, Hyacinth Red (CarWale has no two-tone shot)
};

// There is no separate "wedding cars" class: every car in the fleet can be booked for a wedding or any event.
export const fleet: Vehicle[] = [
  {
    slug: "luxury-cars",
    name: "Luxury cars",
    group: "cars",
    text: "Rolls-Royce, Bentley, Mercedes-Benz, BMW and Jaguar, for business, celebrations and everything in between.",
    image: studio.ghost,
    imageAlt: "Silver Rolls-Royce Ghost",
    imageZoom: 1.35,
    imagePlaceholder: true,
    imageCutout: true,
  },
  {
    slug: "executive-cabs",
    name: "Executive cabs",
    group: "cars",
    text: "Comfortable sedans for meetings, corporate events and airport runs.",
    image: studio.eClass,
    imageAlt: "White Mercedes-Benz E-Class",
    imagePlaceholder: true,
    imageCutout: true,
  },
  {
    slug: "suvs",
    name: "SUVs",
    group: "suv",
    text: "Range Rover and more, with space for families, luggage and hill trips.",
    image: studio.rangeRover,
    imageAlt: "White Range Rover",
    imagePlaceholder: true,
    imageCutout: true,
  },
  {
    // "MPV" is the term used in India for the Vellfire class (Toyota sells it here as a luxury MPV).
    slug: "luxury-mpvs",
    name: "Luxury MPVs",
    group: "group",
    text: "The Toyota Vellfire and Mercedes-Benz V-Class, for families, small groups and business guests who need more room than a sedan.",
    image: studio.vellfire,
    imageAlt: "White Toyota Vellfire",
    imagePlaceholder: true,
    imageCutout: true,
  },
  {
    slug: "vintage-cars",
    name: "Vintage cars",
    group: "classic",
    text: "Classic cars for weddings, anniversaries and themed photoshoots.",
    image: photos.vintage,
    imageAlt: "Blue and white vintage open tourers at the Jhajj'z transport yard",
  },
  {
    slug: "convertibles",
    name: "Convertibles",
    group: "classic",
    text: "Roof down, for photoshoots and days that call for open sky.",
    image: photos.audiCabriolet,
    imageAlt: "Red Audi cabriolet decorated with flowers",
  },
  {
    slug: "limousines",
    name: "Limousines",
    group: "classic",
    text: "For red carpets, weddings and the meetings that matter most.",
    image: photos.limousine,
    imageAlt: "White Chrysler 300C stretch limousine with a red roof",
  },
  {
    slug: "mini-vans",
    name: "Mini vans",
    group: "group",
    text: "Flexible seating and room for luggage, for families and small groups.",
    image: photos.hiace,
    imageAlt: "Navy Toyota HiAce van from the Jhajj'z fleet",
  },
  {
    slug: "luxury-coaches",
    name: "Luxury coaches",
    group: "group",
    text: "Volvo and Mercedes-Benz coaches for delegations, baraat and large groups.",
    image: photos.coaches,
    imageAlt: "Jhajj'z coaches",
  },
];

export const fleetGroups: { id: "all" | FleetGroup; label: string }[] = [
  { id: "all", label: "All" },
  { id: "cars", label: "Luxury & executive" },
  { id: "suv", label: "SUVs" },
  { id: "classic", label: "Vintage, limousines & convertibles" },
  { id: "group", label: "MPVs, vans & coaches" },
];

// Individual cars, each with its own page at /fleet/<slug>. Only add a car the client has confirmed is in the
// fleet. Details with a `null` value are simply not shown; fill them in only from the client or a checked source,
// never a guess. "Passengers" (Nirmal, Oct 2026) is CarWale's seating capacity for the generation in the client's
// photos, minus the chauffeur, and only where every Indian version of it seats the same (not Range Rover, GLE, X7,
// Defender, Innova Crysta, V-Class...); the client should confirm. An empty `photos` list shows a highlighted [CONFIRM] box.
// Until the client's own photos arrive, a licensed photo of the same model may stand in: give it a `credit`
// (photographer + licence, e.g. "Photo: Jane Doe, CC BY-SA 4.0, via Wikimedia Commons") and the page labels it
// "Representative photo".
// PLACEHOLDER photos (`placeholder: true`) are CarWale studio shots (no background, see `studio` above), used on
// Nirmal's instruction for the preview: on every car that has one, in the generation and colour the client has. Remove
// every one before public launch (see "Launch checklist" in CLAUDE.md). They're kept out of Open Graph and JSON-LD.
// Two generations of the same model are separate cars (own page, own `years`); their pages link to each other.
const carwale = (path: string) => saved(`https://imgd.aeplcdn.com/1280x720/n/cw/ec/${path}?isig=0&q=80`);

export type CarPhoto = {
  src: string;
  alt: string;
  credit?: string;
  /** CSS object-position, when the 3:2 crop cuts the car off (e.g. "right" for a car right of centre). */
  position?: string;
  /** A CarWale/CarDekho stand-in, not the client's own car. Remove before public launch. */
  placeholder?: true;
  /** Studio shot with no (or a plain white) background: shown whole on sand instead of cropped to fill the frame. */
  cutout?: true;
  /** Enlarges a cutout whose studio shot has wide white margins, so the car matches the others in size. */
  zoom?: number;
  /** Portrait photo: shown whole (letterboxed) in the 3:2 frame rather than cropped. Fetch it with `wixFit`. */
  portrait?: true;
  /** When the client has the car in more than one colour: the car page shows a colour picker over the photos. */
  colour?: string;
};

export type Car = {
  slug: string;
  /** "" when the make isn't known (the vintage cars); give a `name` then. */
  brand: string;
  /** Model years of the generation in the client's photos (identified by eye), when the fleet has more than one
   * generation of the model, e.g. "2013–2020". Shown with the name; the client should confirm. */
  years?: string;
  model: string;
  /** What we call it on the site, when "brand model" reads wrong (e.g. "Range Rover Autobiography"). */
  name?: string;
  /** Slug of the vehicle class in `fleet` this car belongs to. */
  fleetClass: string;
  text: string;
  photos: CarPhoto[];
  details: { label: string; value: string | null }[];
};

export const cars: Car[] = [
  {
    slug: "rolls-royce-ghost",
    brand: "Rolls-Royce",
    model: "Ghost",
    fleetClass: "luxury-cars",
    text: "A Rolls-Royce Ghost for weddings, business visits and the days you want to remember.",
    photos: [
      // PLACEHOLDER: CarDekho photo — remove before public launch
      { src: studio.ghost, alt: "Silver Rolls-Royce Ghost", placeholder: true, cutout: true, zoom: 1.35, colour: "Silver" },
      { src: photos.ghostFlowers, alt: "White Rolls-Royce Ghost decorated with flowers", colour: "White" },
      { src: photos.ghostSide, alt: "White Rolls-Royce Ghost from the side", colour: "White" },
      { src: photos.ghostFront, alt: "White Rolls-Royce Ghost with a JHAJJZ number plate", portrait: true, colour: "White" },
      { src: photos.ghostLimos, alt: "White Rolls-Royce Ghost with a JHAJJZ LIMOS plate", portrait: true, colour: "White" },
      { src: photos.ghostRear, alt: "White Rolls-Royce Ghost from behind", portrait: true, colour: "White" },
      { src: photos.ghostSilver, alt: "Silver Rolls-Royce Ghost with its coach doors open", colour: "Silver" },
    ],
    details: [
      { label: "Passengers", value: "4" },
      { label: "Colour", value: "White, silver" },
    ],
  },
  {
    slug: "mercedes-benz-s-class",
    brand: "Mercedes-Benz",
    model: "S-Class",
    years: "2021 onwards",
    fleetClass: "luxury-cars",
    text: "A Mercedes-Benz S-Class for business travel, airport transfers and weddings.",
    photos: [
      // PLACEHOLDER: CarWale photo — remove before public launch
      { src: studio.sClass, alt: "Black Mercedes-Benz S-Class", placeholder: true, cutout: true },
      { src: photos.sClass, alt: "Black Mercedes-Benz S-Class from the Jhajj'z fleet" },
    ],
    details: [
      { label: "Passengers", value: "4" },
      { label: "Colour", value: null },
    ],
  },
  {
    slug: "mercedes-benz-s-class-2013-2020",
    brand: "Mercedes-Benz",
    model: "S-Class",
    years: "2013–2020",
    fleetClass: "luxury-cars",
    text: "A Mercedes-Benz S-Class for business travel, airport transfers and weddings.",
    photos: [
      { src: photos.sClassOlderWhite, alt: "White Mercedes-Benz S-Class from the side" },
      { src: photos.sClassOlderSilver, alt: "Silver Mercedes-Benz S-Class parked under trees" },
      { src: photos.sClassOlderWedding, alt: "White Mercedes-Benz S-Class decorated for a wedding", portrait: true },
      { src: photos.sClassOlderChauffeur, alt: "White Mercedes-Benz S-Class with a Jhajj'z chauffeur", portrait: true },
    ],
    details: [
      { label: "Passengers", value: "4" },
      { label: "Colour", value: null },
    ],
  },
  {
    slug: "range-rover-autobiography",
    brand: "Land Rover",
    model: "Range Rover Autobiography",
    name: "Range Rover Autobiography",
    years: "2022 onwards",
    fleetClass: "suvs",
    text: "A Range Rover for weddings, business visits and trips to the hills.",
    photos: [
      // PLACEHOLDER: CarWale photo — remove before public launch
      { src: studio.rangeRover, alt: "White Range Rover", placeholder: true, cutout: true },
      { src: photos.rangeRoverWedding, alt: "White Range Rover with wedding flowers and a Jhajj'z Limos plate", portrait: true },
    ],
    details: [
      { label: "Passengers", value: null },
      { label: "Colour", value: null },
    ],
  },
  {
    slug: "range-rover-autobiography-2013-2022",
    brand: "Land Rover",
    model: "Range Rover Autobiography",
    name: "Range Rover Autobiography",
    years: "2013–2022",
    fleetClass: "suvs",
    text: "A Range Rover for weddings, business visits and trips to the hills.",
    photos: [
      // PLACEHOLDER: CarWale photo — remove before public launch
      { src: studio.rangeRoverOlder, alt: "White Range Rover", placeholder: true, cutout: true },
      { src: photos.rangeRover, alt: "White Range Rover from the Jhajj'z fleet" },
    ],
    details: [
      { label: "Passengers", value: null },
      { label: "Colour", value: null },
    ],
  },
  {
    slug: "mercedes-benz-gls",
    brand: "Mercedes-Benz",
    model: "GLS",
    fleetClass: "suvs",
    text: "A Mercedes-Benz GLS for family travel, business visits and trips to the hills.",
    photos: [
      // PLACEHOLDER: CarWale photo — remove before public launch
      { src: studio.gls, alt: "White Mercedes-Benz GLS", placeholder: true, cutout: true },
      { src: photos.gls, alt: "White Mercedes-Benz GLS decorated with flowers for a wedding", position: "50% 70%" },
    ],
    details: [
      { label: "Passengers", value: "6" },
      { label: "Colour", value: null },
    ],
  },
  {
    slug: "mercedes-benz-gle-bulletproof",
    brand: "Mercedes-Benz",
    model: "GLE",
    name: "Mercedes-Benz GLE (bulletproof)",
    fleetClass: "suvs",
    text: "A bulletproof Mercedes-Benz GLE for VIP visits, delegations and anyone who needs extra security on the road.",
    photos: [
      // PLACEHOLDER: CarWale photo — remove before public launch
      { src: studio.gle, alt: "White Mercedes-Benz GLE", placeholder: true, cutout: true },
    ],
    details: [
      { label: "Passengers", value: null },
      { label: "Colour", value: null },
      { label: "Protection level", value: null },
    ],
  },
  {
    slug: "toyota-land-cruiser",
    brand: "Toyota",
    model: "Land Cruiser",
    fleetClass: "suvs",
    text: "A Toyota Land Cruiser for long road trips, hill travel and business visits.",
    photos: [
      // PLACEHOLDER: CarWale photo — remove before public launch
      { src: studio.landCruiser, alt: "White Toyota Land Cruiser", placeholder: true, cutout: true },
    ],
    details: [
      { label: "Passengers", value: null },
      { label: "Colour", value: null },
    ],
  },
  {
    slug: "toyota-fortuner",
    brand: "Toyota",
    model: "Fortuner",
    fleetClass: "suvs",
    text: "A black Toyota Fortuner for family trips, hill travel and wedding convoys.",
    photos: [
      // PLACEHOLDER: CarWale photo — remove before public launch
      { src: carwale("44709/fortuner-exterior-right-front-three-quarter-7.jpeg"), alt: "Black Toyota Fortuner", placeholder: true, cutout: true },
    ],
    details: [
      { label: "Passengers", value: "6" },
      { label: "Colour", value: "Black" },
    ],
  },
  {
    slug: "toyota-vellfire",
    brand: "Toyota",
    model: "Vellfire",
    fleetClass: "luxury-mpvs",
    text: "A Toyota Vellfire for families, small groups and business guests.",
    photos: [
      // PLACEHOLDER: CarWale photo — remove before public launch
      { src: studio.vellfire, alt: "White Toyota Vellfire", placeholder: true, cutout: true },
      { src: photos.vellfireFront, alt: "White Toyota Vellfire from the Jhajj'z fleet" },
      { src: photos.vellfireFlowers, alt: "White Toyota Vellfire in front of flowering bushes" },
      { src: photos.vellfirePortrait, alt: "White Toyota Vellfire on an empty road", portrait: true },
    ],
    details: [
      { label: "Passengers", value: "6" },
      { label: "Colour", value: "White" },
    ],
  },
  {
    slug: "bmw-7-series",
    brand: "BMW",
    model: "7 Series",
    years: "2019–2022",
    fleetClass: "luxury-cars",
    text: "A BMW 7 Series for business travel, airport transfers and weddings.",
    photos: [
      // PLACEHOLDER: CarWale photo — remove before public launch
      { src: studio.bmw7Series, alt: "White BMW 7 Series", placeholder: true, cutout: true },
      { src: photos.bmw7SeriesNewer, alt: "White BMW 7 Series from the Jhajj'z fleet" },
    ],
    details: [
      { label: "Passengers", value: "4" },
      { label: "Colour", value: "White" },
    ],
  },
  {
    slug: "bmw-7-series-2015-2019",
    brand: "BMW",
    model: "7 Series",
    years: "2015–2019",
    fleetClass: "luxury-cars",
    text: "A BMW 7 Series for business travel, airport transfers and weddings.",
    photos: [
      { src: photos.bmw7Series, alt: "White BMW 7 Series from the Jhajj'z fleet" },
      { src: photos.bmw7SeriesChauffeur, alt: "White BMW 7 Series with a Jhajj'z chauffeur" },
    ],
    details: [
      { label: "Passengers", value: "4" },
      { label: "Colour", value: "White" },
    ],
  },
  {
    slug: "land-rover-defender",
    brand: "Land Rover",
    model: "Defender",
    fleetClass: "suvs",
    text: "A Land Rover Defender for hill trips, long drives and wedding convoys.",
    photos: [
      // PLACEHOLDER: CarWale photo — remove before public launch
      { src: studio.defender, alt: "Black Land Rover Defender", placeholder: true, cutout: true },
      { src: photos.defender, alt: "Black Land Rover Defender from the Jhajj'z fleet" },
    ],
    details: [
      { label: "Passengers", value: null },
      { label: "Colour", value: null },
    ],
  },
  {
    slug: "chrysler-300c-limousine",
    brand: "Chrysler",
    model: "300C limousine",
    name: "Chrysler 300C stretch limousine",
    fleetClass: "limousines",
    text: "A white stretch limousine for weddings, red-carpet arrivals and nights out.",
    photos: [
      { src: photos.limousine, alt: "White Chrysler 300C stretch limousine with a red roof" },
      { src: photos.limousineTree, alt: "White stretch limousine with a red roof, parked under a tree", portrait: true },
    ],
    details: [
      { label: "Passengers", value: null },
      { label: "Colour", value: "White with a red roof" },
    ],
  },
  {
    slug: "audi-cabriolet",
    brand: "Audi",
    model: "A3 Cabriolet",
    fleetClass: "convertibles",
    text: "A red Audi A3 Cabriolet for weddings, photoshoots and drives with the roof down.",
    photos: [
      // PLACEHOLDER: stand-in render — remove before public launch
      { src: studio.audiA3Cabriolet, alt: "Red Audi A3 Cabriolet with the roof down", placeholder: true, cutout: true, zoom: 1.4 },
      { src: photos.audiSunset, alt: "Red Audi A3 Cabriolet decorated with flowers at sunset", portrait: true },
      { src: photos.audiAbove, alt: "Red Audi A3 Cabriolet seen from above", portrait: true },
    ],
    details: [
      { label: "Passengers", value: "3" },
      { label: "Colour", value: "Red" },
    ],
  },
  {
    slug: "bentley-flying-spur",
    brand: "Bentley",
    model: "Flying Spur",
    fleetClass: "luxury-cars",
    text: "A Bentley Flying Spur for weddings, business visits and the days you want to remember.",
    photos: [
      { src: photos.flyingSpur, alt: "Silver Bentley Flying Spur from the Jhajj'z fleet" },
    ],
    details: [
      { label: "Passengers", value: null },
      { label: "Colour", value: "Silver" },
    ],
  },
  {
    slug: "jaguar-xj",
    brand: "Jaguar",
    model: "XJ",
    fleetClass: "luxury-cars",
    text: "A Jaguar XJ for weddings, business travel and airport transfers.",
    photos: [
      // PLACEHOLDER: CarWale photo — remove before public launch
      { src: studio.jaguarXj, alt: "White Jaguar XJ", placeholder: true, cutout: true },
      { src: photos.jaguarXj, alt: "White Jaguar XJ decorated for a wedding" },
    ],
    details: [
      { label: "Passengers", value: "4" },
      { label: "Colour", value: "White" },
    ],
  },
  {
    slug: "bmw-i8",
    brand: "BMW",
    model: "i8",
    fleetClass: "luxury-cars",
    text: "A BMW i8 for weddings, photoshoots and special arrivals.",
    photos: [
      // PLACEHOLDER: CarWale photo — remove before public launch
      { src: studio.bmwI8, alt: "White BMW i8", placeholder: true, cutout: true },
      { src: photos.bmwLineUp, alt: "BMW i8 between a BMW X5 and a Range Rover from the Jhajj'z fleet" },
    ],
    details: [
      { label: "Passengers", value: "3" },
      { label: "Colour", value: "White" },
    ],
  },
  {
    slug: "mercedes-benz-e-class",
    brand: "Mercedes-Benz",
    model: "E-Class",
    years: "2023 onwards",
    fleetClass: "executive-cabs",
    text: "A Mercedes-Benz E-Class for meetings, corporate events and airport runs.",
    photos: [
      // PLACEHOLDER: CarWale photo — remove before public launch
      { src: studio.eClass, alt: "White Mercedes-Benz E-Class", placeholder: true, cutout: true },
      { src: photos.eClass, alt: "White Mercedes-Benz E-Class from the Jhajj'z fleet", portrait: true },
    ],
    details: [
      { label: "Passengers", value: "4" },
      { label: "Colour", value: null },
    ],
  },
  {
    slug: "mercedes-benz-e-class-2016-2023",
    brand: "Mercedes-Benz",
    model: "E-Class",
    years: "2016–2023",
    fleetClass: "executive-cabs",
    text: "A Mercedes-Benz E-Class for meetings, corporate events and airport runs.",
    photos: [
      { src: photos.eClassOlderWedding, alt: "Mercedes-Benz E-Class decorated with red ribbon for a wedding", portrait: true },
    ],
    details: [
      { label: "Passengers", value: "4" },
      { label: "Colour", value: null },
    ],
  },
  {
    slug: "bmw-x7",
    brand: "BMW",
    model: "X7",
    fleetClass: "suvs",
    text: "A BMW X7 for family travel, business visits and trips to the hills.",
    photos: [
      // PLACEHOLDER: CarWale photo — remove before public launch
      { src: studio.bmwX7, alt: "White BMW X7", placeholder: true, cutout: true },
      { src: photos.bmwX7, alt: "White BMW X7 from the Jhajj'z fleet", portrait: true },
    ],
    details: [
      { label: "Passengers", value: null },
      { label: "Colour", value: "White" },
    ],
  },
  {
    slug: "bmw-x5",
    brand: "BMW",
    model: "X5",
    fleetClass: "suvs",
    text: "A BMW X5 for business visits, airport runs and weekend drives.",
    photos: [
      // PLACEHOLDER: CarWale photo — remove before public launch
      { src: studio.bmwX5, alt: "White BMW X5", placeholder: true, cutout: true },
      { src: photos.bmwLineUp, alt: "BMW X5, BMW i8 and a Range Rover from the Jhajj'z fleet" },
    ],
    details: [
      { label: "Passengers", value: "4" },
      { label: "Colour", value: "White" },
    ],
  },
  {
    slug: "mercedes-benz-g-class",
    brand: "Mercedes-Benz",
    model: "G-Class",
    fleetClass: "suvs",
    text: "A Mercedes-Benz G-Class for weddings, VIP arrivals and hill trips.",
    photos: [
      // PLACEHOLDER: CarWale photo — remove before public launch
      { src: studio.gClass, alt: "Black Mercedes-AMG G 63", placeholder: true, cutout: true },
      { src: photos.gClassBlack, alt: "Black Mercedes-Benz G-Class from the Jhajj'z fleet", portrait: true },
      { src: photos.gClassWhite, alt: "White Mercedes-Benz G-Class decorated for a wedding", portrait: true },
    ],
    details: [
      { label: "Passengers", value: "4" },
      { label: "Colour", value: null },
    ],
  },
  {
    slug: "mercedes-maybach-gls",
    brand: "Mercedes-Maybach",
    model: "GLS",
    name: "Mercedes-Maybach GLS",
    fleetClass: "suvs",
    text: "A Mercedes-Maybach GLS for weddings, VIP visits and family travel.",
    photos: [
      { src: studio.maybachGls, alt: "Red Mercedes-Maybach GLS", placeholder: true, cutout: true },
      { src: photos.maybachGls, alt: "Two-tone Mercedes-Maybach GLS at night" },
    ],
    details: [
      { label: "Passengers", value: "4" },
      { label: "Colour", value: "Red and white (two-tone)" },
    ],
  },
  {
    slug: "range-rover-sport",
    brand: "Land Rover",
    model: "Range Rover Sport",
    name: "Range Rover Sport",
    years: "2018–2022",
    fleetClass: "suvs",
    text: "A Range Rover Sport for weddings, business visits and trips to the hills.",
    photos: [
      // PLACEHOLDER: CarWale photo — remove before public launch
      { src: studio.rangeRoverSport, alt: "White Range Rover Sport", placeholder: true, cutout: true },
      { src: photos.rangeRoverSportFront, alt: "White Range Rover Sport from the Jhajj'z fleet", portrait: true },
      { src: photos.rangeRoverSportWedding, alt: "White Range Rover Sport decorated for a wedding", portrait: true },
    ],
    details: [
      { label: "Passengers", value: null },
      { label: "Colour", value: null },
    ],
  },
  {
    slug: "range-rover-sport-2013-2017",
    brand: "Land Rover",
    model: "Range Rover Sport",
    name: "Range Rover Sport",
    years: "2013–2017",
    fleetClass: "suvs",
    text: "A Range Rover Sport for weddings, business visits and trips to the hills.",
    photos: [
      { src: photos.rangeRoverSportBlue, alt: "Blue Range Rover Sport" },
    ],
    details: [
      { label: "Passengers", value: null },
      { label: "Colour", value: null },
    ],
  },
  {
    slug: "jaguar-f-pace",
    brand: "Jaguar",
    model: "F-Pace",
    fleetClass: "suvs",
    text: "A Jaguar F-Pace for business visits, weekend drives and wedding convoys.",
    photos: [
      // PLACEHOLDER: CarWale photo — remove before public launch
      { src: studio.fPace, alt: "White Jaguar F-Pace", placeholder: true, cutout: true },
      { src: photos.fPace, alt: "White Jaguar F-Pace from the Jhajj'z fleet" },
    ],
    details: [
      { label: "Passengers", value: "4" },
      { label: "Colour", value: "White" },
    ],
  },
  {
    slug: "audi-q7",
    brand: "Audi",
    model: "Q7",
    fleetClass: "suvs",
    text: "An Audi Q7 for family travel, business visits and trips to the hills.",
    photos: [
      // PLACEHOLDER: CarWale photo — remove before public launch
      { src: studio.audiQ7, alt: "White Audi Q7", placeholder: true, cutout: true },
      { src: photos.audiQ7, alt: "White Audi Q7 from the Jhajj'z fleet", portrait: true },
    ],
    details: [
      { label: "Passengers", value: "6" },
      { label: "Colour", value: "White" },
    ],
  },
  {
    slug: "mercedes-benz-v-class",
    brand: "Mercedes-Benz",
    model: "V-Class",
    fleetClass: "luxury-mpvs",
    text: "A Mercedes-Benz V-Class for families, small groups and business guests.",
    photos: [
      { src: photos.vClass, alt: "White Mercedes-Benz V-Class from the Jhajj'z fleet" },
    ],
    details: [
      { label: "Passengers", value: null },
      { label: "Colour", value: "White" },
    ],
  },
  {
    slug: "toyota-hiace",
    brand: "Toyota",
    model: "HiAce",
    fleetClass: "mini-vans",
    text: "A Toyota HiAce van for families, small groups and trips with plenty of luggage.",
    photos: [
      { src: photos.hiace, alt: "Navy Toyota HiAce van from the Jhajj'z fleet" },
      { src: photos.hiaceSide, alt: "Navy Toyota HiAce with its sliding door open" },
    ],
    details: [
      { label: "Passengers", value: null },
      { label: "Colour", value: "Navy blue" },
    ],
  },
  {
    slug: "toyota-innova-crysta",
    brand: "Toyota",
    model: "Innova Crysta",
    fleetClass: "mini-vans",
    text: "A Toyota Innova Crysta for family trips, airport runs and small groups.",
    photos: [
      // PLACEHOLDER: CarWale photo — remove before public launch
      { src: studio.innovaCrysta, alt: "Black Toyota Innova Crysta", placeholder: true, cutout: true },
      { src: photos.innovaCrysta, alt: "Black Toyota Innova Crysta with a Jhajj'z chauffeur" },
    ],
    details: [
      { label: "Passengers", value: null },
      { label: "Colour", value: "Black" },
    ],
  },
  {
    slug: "mercedes-benz-gle",
    brand: "Mercedes-Benz",
    model: "GLE",
    fleetClass: "suvs",
    text: "A Mercedes-Benz GLE for weddings, family travel and business visits.",
    photos: [
      // PLACEHOLDER: CarWale photo — remove before public launch
      { src: studio.gleOlder, alt: "Black Mercedes-Benz GLE", placeholder: true, cutout: true },
      { src: photos.weddingLineUpGle, alt: "Black Mercedes-Benz GLE decorated with flowers, leading a wedding line-up", position: "right" },
    ],
    details: [
      { label: "Passengers", value: null },
      { label: "Colour", value: "Black" },
    ],
  },
  {
    slug: "force-urbania",
    brand: "Force",
    model: "Urbania",
    fleetClass: "mini-vans",
    text: "A Force Urbania for groups, wedding guests and trips with plenty of luggage.",
    photos: [
      // PLACEHOLDER: CarDekho photo — remove before public launch
      { src: studio.urbania, alt: "Grey Force Urbania", placeholder: true, cutout: true },
      { src: photos.forceUrbania, alt: "Grey Force Urbania van with its sliding door open" },
    ],
    details: [
      { label: "Passengers", value: null },
      { label: "Colour", value: "Grey" },
    ],
  },
  {
    slug: "vintage-open-tourers",
    brand: "",
    model: "Open tourer",
    name: "Vintage open tourer",
    fleetClass: "vintage-cars",
    text: "Our blue and white vintage open tourers, for weddings, anniversaries and themed photoshoots.",
    photos: [{ src: photos.vintage, alt: "Blue and white vintage open tourers at the Jhajj'z transport yard" }],
    details: [
      { label: "Passengers", value: null },
      { label: "Colour", value: "Blue, white" },
    ],
  },
];

export const carName = (c: Car) => c.name ?? `${c.brand} ${c.model}`;
/** The name plus model years, for lists where two generations of one model sit side by side. */
export const carTitle = (c: Car) => (c.years ? `${carName(c)} (${c.years})` : carName(c));
/** "2013–2020 model", "2021 onwards" — the line shown under a car's name. */
export const carYears = (c: Car) => (c.years && /\d$/.test(c.years) ? `${c.years} model` : c.years);
/** Other generations of the same model in the fleet. */
export const otherYears = (c: Car) => cars.filter((o) => o.slug !== c.slug && carName(o) === carName(c));

export const carsInClass = (slug: string) => cars.filter((c) => c.fleetClass === slug);
/** A class with cars has its own page listing them (/fleet/suvs); one without any yet (coaches) stays on /fleet. */
export const classHref = (slug: string) => (carsInClass(slug).length > 0 ? `/fleet/${slug}` : `/fleet#${slug}`);

/** "Luxury cars" → "luxury cars", but "SUVs" stays "SUVs". */
export const inSentence = (s: string) => (/^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s);
