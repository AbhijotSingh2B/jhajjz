import { type Car, carName, cities, contact, fleet, founded, heroImage, postalAddress, serviceGroups, siteName, siteUrl } from "@/lib/site";

/**
 * Schema.org data for search engines (Google's business panel, rich results).
 * Built only from the verified facts in lib/site.ts — no ratings, prices, hours or postcode,
 * because the client hasn't given us those.
 */
export function BusinessStructuredData() {
  const business = {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    "@id": `${siteUrl}/#business`,
    name: siteName,
    alternateName: ["Jhajjz", "Jhajj'z Transport", "Jhajjz The Transporters"],
    description:
      "Chauffeur-driven luxury cars, wedding cars, SUVs, limousines and coaches. Head office in Chandigarh, serving pan-India since 1998.",
    url: siteUrl,
    logo: `${siteUrl}/icon-512.png`,
    image: heroImage,
    telephone: contact.phones.map((p) => p.href.replace("tel:", "")),
    email: contact.email,
    foundingDate: String(founded),
    address: { "@type": "PostalAddress", ...postalAddress },
    hasMap: contact.mapsUrl,
    areaServed: [{ "@type": "Country", name: "India" }, ...cities.map((c) => ({ "@type": "City", name: c }))],
    sameAs: contact.socials.map((s) => s.href),
    contactPoint: contact.phones.map((p) => ({
      "@type": "ContactPoint",
      telephone: p.href.replace("tel:", ""),
      contactType: "reservations",
      areaServed: "IN",
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Chauffeur-driven vehicles and services",
      itemListElement: [
        ...fleet.map((v) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: `${v.name} with chauffeur`, description: v.text },
        })),
        ...serviceGroups.flatMap((g) =>
          g.items.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, description: s.text } })),
        ),
      ],
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: siteName,
    url: siteUrl,
    inLanguage: "en-IN",
    publisher: { "@id": `${siteUrl}/#business` },
  };

  return <JsonLd data={[business, website]} />;
}

/** Breadcrumb trail for inner pages, e.g. Home › Fleet, or Home › Fleet › Rolls-Royce Ghost with `parent`. */
export function BreadcrumbStructuredData({
  name,
  path,
  parent,
}: {
  name: string;
  path: string;
  parent?: { name: string; path: string };
}) {
  const trail = [{ name: "Home", item: siteUrl }];
  if (parent) trail.push({ name: parent.name, item: `${siteUrl}${parent.path}` });
  trail.push({ name, item: `${siteUrl}${path}` });
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, ...t })),
      }}
    />
  );
}

/** One car's page. Only the facts we have: no price, rating or specs the client hasn't confirmed. */
export function CarStructuredData({ car }: { car: Car }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Car",
        name: carName(car),
        brand: { "@type": "Brand", name: car.brand },
        model: car.model,
        description: car.text,
        url: `${siteUrl}/fleet/${car.slug}`,
        ...(car.photos.length > 0 && { image: car.photos.map((p) => p.src) }),
      }}
    />
  );
}

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so a value can never close the script tag early.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
