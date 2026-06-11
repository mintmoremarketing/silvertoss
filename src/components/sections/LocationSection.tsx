import { useEffect, useMemo, useState } from "react";

// Import get-in-touch data generated from the BSON dump.  The
// `convert_bson_to_json.py` script writes `get-in-touch.json` into
// `src/data`, allowing us to import it directly instead of fetching
// from an API.
import getInTouchData from "@/data/get-in-touch.json";

type TouchEntry = {
  _id: string;
  title: string;
  location: string;
  image_path?: string;
  status?: boolean;
};

type LocationCard = {
  id: string;
  title: string;
  address: string;
  image: string;
};

// No backend is available; location data is imported directly from
// `getInTouchData` above.

const fallbackLocations: LocationCard[] = [
  {
    id: "fallback-1",
    title: "Factory",
    address: "1250 Industrial Avenue, Timber Valley, Oregon 97201",
    image:
      "https://images.unsplash.com/photo-1629965995905-bf0bbd10dcaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aW1iZXIlMjBmYWN0b3J5fGVufDF8fHx8MTc2NTUyNDk5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "fallback-2",
    title: "Head Office",
    address: "789 Corporate Plaza, Suite 500, Portland, Oregon 97204",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
  },
];

const normalizeTouchEntries = (payload: unknown): TouchEntry[] => {
  if (!payload || typeof payload !== "object") return [];
  const data = payload as Record<string, unknown>;

  const candidates = [
    data.getInTouch,
    data.getInTouches,
    data.get_in_touch,
    data.entries,
    (data.data as Record<string, unknown> | undefined)?.getInTouch,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate as TouchEntry[];
    }
  }

  return [];
};

export function LocationSection() {
  const [locations, setLocations] = useState<LocationCard[]>(fallbackLocations);
  useEffect(() => {
    // Load locations synchronously from the imported JSON.  Because the
    // data is bundled with the application there is no need to fetch it.
    const resolved = normalizeTouchEntries(getInTouchData as unknown);
    const active = resolved.filter(
      (entry) => typeof entry.status !== "boolean" || entry.status,
    );
    if (active.length) {
      setLocations(
        active.map((entry, index) => ({
          id: entry._id || `location-${index}`,
          title: entry.title || `Location ${index + 1}`,
          address: entry.location || "Address unavailable",
          image: entry.image_path || fallbackLocations[index % fallbackLocations.length].image,
        })),
      );
    }
  }, []);

  const locationCards = useMemo(
    () => (locations.length ? locations : fallbackLocations),
    [locations]
  );

  return (
    <section className="content-section location-section" id="getintouch">
      <div className="container">
        <div className="location-section__header">
          <h2 className="location-section__title" data-aos="fade-up" data-aos-duration="1000">Get in Touch</h2>
          {/* <p className="location-section__intro" data-aos="fade-up" data-aos-delay="100" data-aos-duration="1000">
            Visit us at our locations or reach out to discuss your timber needs.
          </p> */}
        </div>

        <div className="location-section__grid" data-aos="fade-up" data-aos-delay="150" data-aos-duration="1000">
          {locationCards.map((location) => (
            <article className="location-card" key={location.id}>
              <div className="location-card__media">
                <img
                  alt={location.title}
                  className="location-card__image"
                  loading="lazy"
                  src={location.image}
                />
                <div className="location-card__overlay">
                  <h3 className="location-card__title">{location.title}</h3>
                </div>
              </div>

              <div className="location-card__body">
                <span aria-hidden="true" className="location-card__icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2.5A6.75 6.75 0 0 0 5.25 9.25c0 4.69 5.54 10.64 6.18 11.31a.8.8 0 0 0 1.14 0c.64-.67 6.18-6.62 6.18-11.31A6.75 6.75 0 0 0 12 2.5Zm0 16.32c-1.86-2.1-5.25-6.4-5.25-9.57a5.25 5.25 0 0 1 10.5 0c0 3.17-3.39 7.47-5.25 9.57Zm0-12.57a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
                  </svg>
                </span>
                <p className="location-card__address">{location.address}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
