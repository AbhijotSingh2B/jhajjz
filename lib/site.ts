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
];

// Wix-hosted photos from the current site. The image-to-category mapping was
// taken from the order on the live homepage and has NOT been visually checked
// — confirm each one with the client (see CLAUDE.md, "Open items").
const wix = (id: string) => `https://static.wixstatic.com/media/${id}~mv2.jpg/v1/fill/w_1600,h_1067,al_c,q_85/photo.jpg`;
const wixJpeg = (id: string) => `https://static.wixstatic.com/media/${id}~mv2.jpeg/v1/fill/w_1600,h_1067,al_c,q_85/photo.jpeg`;

export type FleetGroup = "cars" | "wedding" | "suv" | "group";

export type Vehicle = {
  slug: string;
  name: string;
  group: FleetGroup;
  text: string;
  image: string;
  imageAlt: string;
};

export const fleet: Vehicle[] = [
  {
    slug: "luxury-cars",
    name: "Luxury cars",
    group: "cars",
    text: "Rolls-Royce, Mercedes-Benz, BMW and Audi, for business, celebrations and everything in between.",
    image: wix("171684_e2b3a2de810b49f1bd9066aa63ea5b47"),
    imageAlt: "Luxury car from the Jhajj'z fleet",
  },
  {
    slug: "wedding-cars",
    name: "Wedding cars",
    group: "wedding",
    text: "Decorated to your theme and driven by our chauffeurs, so the arrival is part of the memory.",
    image: wixJpeg("171684_d0d46c5c136c43b6a41d577ba308dc77"),
    imageAlt: "Decorated wedding car",
  },
  {
    slug: "vintage-cars",
    name: "Vintage cars",
    group: "wedding",
    text: "Classic cars for weddings, anniversaries and themed photoshoots.",
    image: wix("171684_274fc280da2a49fb8271fb19015aac77"),
    imageAlt: "Vintage car",
  },
  {
    slug: "convertibles",
    name: "Convertibles",
    group: "cars",
    text: "Roof down, for photoshoots and days that call for open sky.",
    image: wixJpeg("171684_b92c4c7fbc4544efaa3155a9e1b7ea5a"),
    imageAlt: "Convertible car",
  },
  {
    slug: "limousines",
    name: "Limousines",
    group: "wedding",
    text: "For red carpets, weddings and the meetings that matter most.",
    image: wix("171684_230878eccc5e4a129225562dc3625aa5"),
    imageAlt: "Limousine",
  },
  {
    slug: "suvs",
    name: "SUVs",
    group: "suv",
    text: "Range Rover and more, with space for families, luggage and hill trips.",
    image: wix("171684_96f78bb8e63b4a268e76e533cd6eb5af"),
    imageAlt: "Luxury SUV",
  },
  {
    slug: "executive-cabs",
    name: "Executive cabs",
    group: "cars",
    text: "Comfortable sedans for meetings, corporate events and airport runs.",
    image: wix("171684_1c9a798a6e444d7493d964f19512fbe7"),
    imageAlt: "Executive sedan",
  },
  {
    slug: "luxury-coaches",
    name: "Luxury coaches",
    group: "group",
    text: "Volvo and Mercedes-Benz coaches for delegations, baraat and large groups.",
    image: wix("171684_0af879bb5488447795fdb167404077b1"),
    imageAlt: "Luxury coach",
  },
  {
    slug: "mini-vans",
    name: "Mini vans",
    group: "group",
    text: "Flexible seating and room for luggage, for families and small groups.",
    image: wixJpeg("171684_1371098b103945e981bf18c1563c7087"),
    imageAlt: "Mini van",
  },
];

export const fleetGroups: { id: "all" | FleetGroup; label: string }[] = [
  { id: "all", label: "All" },
  { id: "cars", label: "Luxury & executive" },
  { id: "wedding", label: "Weddings" },
  { id: "suv", label: "SUVs" },
  { id: "group", label: "Coaches & vans" },
];
