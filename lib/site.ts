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
export const heroImage =
  "https://static.wixstatic.com/media/171684_54ce935d2c1143669a4ad9a04866731d~mv2.jpg/v1/fill/w_2400,h_1600,al_c,q_85/hero.jpg";

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
const wix = (id: string) => `https://static.wixstatic.com/media/${id}~mv2.jpg/v1/fill/w_1600,h_1067,al_c,q_85/photo.jpg`;
const wixJpeg = (id: string) => `https://static.wixstatic.com/media/${id}~mv2.jpeg/v1/fill/w_1600,h_1067,al_c,q_85/photo.jpeg`;

export type FleetGroup = "cars" | "classic" | "suv" | "group";

export type Vehicle = {
  slug: string;
  name: string;
  group: FleetGroup;
  text: string;
  /** Leave out until the client sends a real photo; the card then shows a highlighted [CONFIRM]. */
  image?: string;
  imageAlt?: string;
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
};

// There is no separate "wedding cars" class: every car in the fleet can be booked for a wedding or any event.
export const fleet: Vehicle[] = [
  {
    slug: "luxury-cars",
    name: "Luxury cars",
    group: "cars",
    text: "Rolls-Royce, Mercedes-Benz, BMW and Audi, for business, celebrations and everything in between.",
    image: photos.bmw7Series,
    imageAlt: "White BMW 7 Series from the Jhajj'z fleet",
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
    image: photos.defender,
    imageAlt: "Black Land Rover Defender",
  },
  {
    slug: "executive-cabs",
    name: "Executive cabs",
    group: "cars",
    text: "Comfortable sedans for meetings, corporate events and airport runs.",
    image: photos.lineUp,
    imageAlt: "A line-up of Jhajj'z cars",
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
    // The photo that used to sit here is the Toyota Vellfire, now under Luxury MPVs.
  },
  {
    // "MPV" is the term used in India for the Vellfire class (Toyota sells it here as a luxury MPV).
    slug: "luxury-mpvs",
    name: "Luxury MPVs",
    group: "group",
    text: "The Toyota Vellfire, for families, small groups and business guests who need more room than a sedan.",
    image: photos.vellfire,
    imageAlt: "White Toyota Vellfire",
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
// PLACEHOLDER photos (`placeholder: true`) are CarWale stand-ins for cars the client hasn't sent photos of yet,
// used on Nirmal's instruction for the preview only. They're CarWale's / the maker's copyright: remove every one
// before public launch (see "Launch checklist" in CLAUDE.md). They're kept out of Open Graph and JSON-LD.
const carwale = (path: string) => `https://imgd.aeplcdn.com/1280x720/n/cw/ec/${path}?isig=0&q=80`;

export type CarPhoto = {
  src: string;
  alt: string;
  credit?: string;
  /** CSS object-position, when the 3:2 crop cuts the car off (e.g. "right" for a car right of centre). */
  position?: string;
  /** A CarWale/CarDekho stand-in, not the client's own car. Remove before public launch. */
  placeholder?: true;
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
    text: "Our Rolls-Royce Ghost comes with a trained Jhajj'z chauffeur. Ask us about it for a wedding, a business visit or a day you want to remember.",
    photos: [{ src: photos.ghost, alt: "White Rolls-Royce Ghost with a JHAJJZ number plate" }],
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
    text: "Our Mercedes-Benz S-Class comes with a trained Jhajj'z chauffeur. Ask us about it for business travel, airport transfers or a wedding.",
    photos: [
      // PLACEHOLDER: CarWale/CarDekho photo — remove before public launch
      { src: carwale("216615/s-class-facelift-exterior-right-front-three-quarter-2.jpeg"), alt: "Black Mercedes-Benz S-Class", placeholder: true },
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
    text: "Our Range Rover Autobiography comes with a trained Jhajj'z chauffeur. Ask us about it for a wedding, a business visit or a trip to the hills.",
    photos: [
      // PLACEHOLDER: CarWale/CarDekho photo — remove before public launch
      { src: carwale("107719/range-rover-exterior-left-front-three-quarter-37.jpeg"), alt: "White Range Rover", position: "right", placeholder: true },
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
    text: "Our Mercedes-Benz GLS comes with a trained Jhajj'z chauffeur. Ask us about it for family travel, business visits or a trip to the hills.",
    photos: [
      // PLACEHOLDER: CarWale/CarDekho photo — remove before public launch
      { src: carwale("167373/gls-exterior-left-front-three-quarter.jpeg"), alt: "Dark blue Mercedes-Benz GLS", placeholder: true },
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
    text: "Our bulletproof Mercedes-Benz GLE comes with a trained Jhajj'z chauffeur. Ask us about it for VIP visits, delegations and anyone who needs extra security on the road.",
    photos: [
      // PLACEHOLDER: CarWale/CarDekho photo — remove before public launch
      { src: carwale("167117/mercedes-benz-gle-right-front-three-quarter12.jpeg"), alt: "White Mercedes-Benz GLE", position: "right", placeholder: true },
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
    text: "Our Toyota Land Cruiser comes with a trained Jhajj'z chauffeur. Ask us about it for long road trips, hill travel or business visits.",
    photos: [
      // PLACEHOLDER: CarWale/CarDekho photo — remove before public launch
      { src: carwale("139739/land-cruiser-exterior-right-front-three-quarter-13.jpeg"), alt: "White Toyota Land Cruiser", placeholder: true },
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
    text: "Our black Toyota Fortuner comes with a trained Jhajj'z chauffeur. Ask us about it for family trips, hill travel or a wedding convoy.",
    photos: [
      // PLACEHOLDER: CarWale/CarDekho photo — remove before public launch
      { src: carwale("43037/toyota-fortuner-front-three-quarter-8.jpeg"), alt: "Black Toyota Fortuner", position: "right", placeholder: true },
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
    text: "Our Toyota Vellfire comes with a trained Jhajj'z chauffeur. Ask us about it for families, small groups and business guests.",
    photos: [{ src: photos.vellfire, alt: "White Toyota Vellfire" }],
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
    text: "Our BMW 7 Series comes with a trained Jhajj'z chauffeur. Ask us about it for business travel, airport transfers or a wedding.",
    photos: [{ src: photos.bmw7Series, alt: "White BMW 7 Series from the Jhajj'z fleet" }],
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
    text: "Our Land Rover Defender comes with a trained Jhajj'z chauffeur. Ask us about it for hill trips, long drives or a wedding convoy.",
    photos: [{ src: photos.defender, alt: "Black Land Rover Defender" }],
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
    text: "Our white stretch limousine comes with a trained Jhajj'z chauffeur. Ask us about it for a wedding, a red-carpet arrival or a night out.",
    photos: [{ src: photos.limousine, alt: "White Chrysler 300C stretch limousine with a red roof" }],
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
    text: "Our red Audi Cabriolet comes with a trained Jhajj'z chauffeur. Ask us about it for a wedding, a photoshoot or a drive with the roof down.",
    photos: [{ src: photos.audiCabriolet, alt: "Red Audi Cabriolet decorated with flowers" }],
    details: [
      { label: "Passengers", value: null },
      { label: "Colour", value: "Red" },
    ],
  },
];

export const carName = (c: Car) => c.name ?? `${c.brand} ${c.model}`;
