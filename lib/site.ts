// Single source of truth for the client's facts. Everything here comes from
// jhajjz.in (Oct 2026). Don't invent stats, models or contact details — use
// [BRACKETS] for anything the client still has to confirm.

export const contact = {
  phones: [
    { label: "+91 98036 00001", href: "tel:+919803600001" },
    { label: "+91 98144 00019", href: "tel:+919814400019" },
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
    { label: "Facebook", href: "http://facebook.com/HIRE.CONVERTIBLES.LUXURY.WEDDING.CORPORATE.CARS" },
    { label: "X", href: "http://twitter.com/Jhajjztransport" },
  ],
};

export const founded = 1998;

// The live domain (currently the Wix site; this build replaces it at launch). Canonical URLs, the sitemap and
// structured data all point here. Search engines are told not to index any other host (see proxy.ts).
export const siteUrl = "https://www.jhajjz.in";
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
export const heroImage = `${hero}/w_2400,h_1600,al_c,q_85/hero.jpg`;
export const heroPhoto = `${hero}/w_2400,h_1600,al_c,q_80/hero.webp`;
export const heroThumb = `${hero}/w_640,h_640,al_c,q_80/hero.webp`;

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
export const serviceGroups = [
  {
    title: "Weddings & events",
    items: [
      { title: "Weddings", text: "Couple, family and guest transport." },
      { title: "Events & conferences", text: "Moving guests between venues and hotels." },
      { title: "Photoshoots", text: "Vintage, sports and convertible cars." },
    ],
  },
  {
    title: "Corporate & VIP",
    items: [
      { title: "VIP delegations", text: "Convoys for official and state visits." },
      { title: "Hotel travel desks", text: "On-site desks at 5-star hotels." },
      { title: "Airline crew handling", text: "Crew pickups and drops on schedule." },
      { title: "Employee transport", text: "Daily office commutes for companies." },
    ],
  },
  {
    title: "Personal travel",
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
const wix = (id: string) => `https://static.wixstatic.com/media/${id}~mv2.jpg/v1/fill/w_1600,h_1067,al_c,q_80/photo.webp`;
// Whole photo, uncropped (for portrait shots; the page crops them with `position`).
const wixFit = (file: string) => `https://static.wixstatic.com/media/${file}/v1/fit/w_1600,h_1600,q_80/photo.webp`;
const wixJpeg = (id: string) => `https://static.wixstatic.com/media/${id}~mv2.jpeg/v1/fill/w_1600,h_1067,al_c,q_80/photo.webp`;

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
};

// PLACEHOLDER: CarWale studio shots on white (from each model's colours page), matched to the generation and colour
// of the client's own car. CarWale/maker copyright: remove before public launch (see "Launch checklist" in CLAUDE.md).
// Leaving out `wm=1` from CarWale's URL gives the photo without their watermark.
const carwaleColour = (id: string) => `https://imgd.aeplcdn.com/1280x720/n/${id}.jpg?q=80`;
export const studio = {
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
};

// There is no separate "wedding cars" class: every car in the fleet can be booked for a wedding or any event.
export const fleet: Vehicle[] = [
  {
    slug: "luxury-cars",
    name: "Luxury cars",
    group: "cars",
    text: "Rolls-Royce, Mercedes-Benz, BMW and Audi, for business, celebrations and everything in between.",
    image: studio.sClass,
    imageAlt: "Black Mercedes-Benz S-Class",
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
    slug: "luxury-coaches",
    name: "Luxury coaches",
    group: "group",
    text: "Volvo and Mercedes-Benz coaches for delegations, baraat and large groups.",
    image: photos.coaches,
    imageAlt: "Jhajj'z coaches",
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
    // "MPV" is the term used in India for the Vellfire class (Toyota sells it here as a luxury MPV).
    slug: "luxury-mpvs",
    name: "Luxury MPVs",
    group: "group",
    text: "The Toyota Vellfire, for families, small groups and business guests who need more room than a sedan.",
    image: studio.vellfire,
    imageAlt: "White Toyota Vellfire",
    imagePlaceholder: true,
    imageCutout: true,
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
// fleet. Details with a `null` value are simply not shown; fill them in only from the client, never from the
// manufacturer's brochure or a guess. An empty `photos` list shows a highlighted [CONFIRM] box.
// Until the client's own photos arrive, a licensed photo of the same model may stand in: give it a `credit`
// (photographer + licence, e.g. "Photo: Jane Doe, CC BY-SA 4.0, via Wikimedia Commons") and the page labels it
// "Representative photo".
// PLACEHOLDER photos (`placeholder: true`) are CarWale studio shots (no background, see `studio` above), used on
// Nirmal's instruction for the preview: on every car that has one, in the generation and colour the client has. Remove
// every one before public launch (see "Launch checklist" in CLAUDE.md). They're kept out of Open Graph and JSON-LD.
// Car pages show the photos as carousels, one per `generation`, in the order they first appear: list newer first.
const carwale = (path: string) => `https://imgd.aeplcdn.com/1280x720/n/cw/ec/${path}?isig=0&q=80`;

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
  /** Portrait photo: shown whole (letterboxed) in the 3:2 frame rather than cropped. Fetch it with `wixFit`. */
  portrait?: true;
  /** When the client has two generations of a car, each gets its own carousel, newer on top. */
  generation?: "Newer model" | "Older model";
};

export type Car = {
  slug: string;
  brand: string;
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
      { src: photos.ghostFlowers, alt: "White Rolls-Royce Ghost decorated with flowers" },
      { src: photos.ghostSide, alt: "White Rolls-Royce Ghost from the side" },
      { src: photos.ghostFront, alt: "White Rolls-Royce Ghost with a JHAJJZ number plate", portrait: true },
      { src: photos.ghostLimos, alt: "White Rolls-Royce Ghost with a JHAJJZ LIMOS plate", portrait: true },
      { src: photos.ghostRear, alt: "White Rolls-Royce Ghost from behind", portrait: true },
    ],
    details: [
      { label: "Passengers", value: null },
      { label: "Colour", value: "White" },
    ],
  },
  {
    slug: "mercedes-benz-s-class",
    brand: "Mercedes-Benz",
    model: "S-Class",
    fleetClass: "luxury-cars",
    text: "A Mercedes-Benz S-Class for business travel, airport transfers and weddings.",
    photos: [
      // PLACEHOLDER: CarWale photo — remove before public launch
      { src: studio.sClass, alt: "Black Mercedes-Benz S-Class", placeholder: true, cutout: true, generation: "Newer model" },
      { src: photos.sClass, alt: "Black Mercedes-Benz S-Class from the Jhajj'z fleet", generation: "Newer model" },
      { src: photos.sClassOlderWedding, alt: "White Mercedes-Benz S-Class decorated for a wedding", portrait: true, generation: "Older model" },
      { src: photos.sClassOlderChauffeur, alt: "White Mercedes-Benz S-Class with a Jhajj'z chauffeur", portrait: true, generation: "Older model" },
    ],
    details: [
      { label: "Passengers", value: null },
      { label: "Colour", value: null },
    ],
  },
  {
    slug: "range-rover-autobiography",
    brand: "Land Rover",
    model: "Range Rover Autobiography",
    name: "Range Rover Autobiography",
    fleetClass: "suvs",
    text: "A Range Rover for weddings, business visits and trips to the hills.",
    photos: [
      // PLACEHOLDER: CarWale photo — remove before public launch
      { src: studio.rangeRover, alt: "White Range Rover", placeholder: true, cutout: true, generation: "Newer model" },
      { src: photos.rangeRoverWedding, alt: "White Range Rover with wedding flowers and a Jhajj'z Limos plate", portrait: true, generation: "Newer model" },
      // PLACEHOLDER: CarWale photo — remove before public launch
      { src: studio.rangeRoverOlder, alt: "White Range Rover, previous generation", placeholder: true, cutout: true, generation: "Older model" },
      { src: photos.rangeRover, alt: "White Range Rover from the Jhajj'z fleet", generation: "Older model" },
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
      { label: "Passengers", value: null },
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
      { label: "Passengers", value: null },
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
      { label: "Passengers", value: null },
      { label: "Colour", value: "White" },
    ],
  },
  {
    slug: "bmw-7-series",
    brand: "BMW",
    model: "7 Series",
    fleetClass: "luxury-cars",
    text: "A BMW 7 Series for business travel, airport transfers and weddings.",
    photos: [
      // PLACEHOLDER: CarWale photo — remove before public launch
      { src: studio.bmw7Series, alt: "White BMW 7 Series", placeholder: true, cutout: true, generation: "Newer model" },
      { src: photos.bmw7SeriesNewer, alt: "White BMW 7 Series from the Jhajj'z fleet", generation: "Newer model" },
      { src: photos.bmw7Series, alt: "White BMW 7 Series from the Jhajj'z fleet", generation: "Older model" },
      { src: photos.bmw7SeriesChauffeur, alt: "White BMW 7 Series with a Jhajj'z chauffeur", generation: "Older model" },
    ],
    details: [
      { label: "Passengers", value: null },
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
    model: "Cabriolet",
    fleetClass: "convertibles",
    text: "A red Audi Cabriolet for weddings, photoshoots and drives with the roof down.",
    photos: [
      { src: photos.audiSunset, alt: "Red Audi Cabriolet decorated with flowers at sunset", portrait: true },
      { src: photos.audiAbove, alt: "Red Audi Cabriolet seen from above", portrait: true },
    ],
    details: [
      { label: "Passengers", value: null },
      { label: "Colour", value: "Red" },
    ],
  },
];

export const carName = (c: Car) => c.name ?? `${c.brand} ${c.model}`;
