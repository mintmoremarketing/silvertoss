import { useEffect, useMemo, useState } from "react";
import { getFileUrl } from "@/features/admin/api/http";

const imagesBase = "/assets/images";

// Import the industries data generated from the BSON dump.  The
// `convert_bson_to_json.py` script writes `industries.json` into
// `src/data`, allowing us to import it directly instead of fetching
// from an API.  When running in a real environment the JSON will be
// bundled with the app.
import industriesData from "@/data/industries.json";

type IndustryRecord = {
  _id: string;
  title: string;
  description: string;
  image: string;
  isActive?: boolean;
};

type IndustryCard = {
  id: string;
  title: string;
  description: string;
  image: string;
};

const fallbackIndustries: IndustryCard[] = [
  {
    id: "fallback-1",
    title: "Construction & Real Estate",
    description:
      "Custom sawn timber for framing, shuttering, and heavy structural execution.",
    image: `${imagesBase}/Construction & Real Estate.webp`,
  },
  {
    id: "fallback-2",
    title: "Infrastructure Projects",
    description:
      "Bulk, long-length timber built for bridges, complex formwork, and large-scale temporary structures.",
    image: `${imagesBase}/Infrastructure Projects.webp`,
  },
  {
    id: "fallback-3",
    title: "Furniture Manufacturing",
    description:
      "Flawlessly seasoned, precision-cut imported timber tailored for premium residential and commercial furniture.",
    image: `${imagesBase}/Furniture Manufacturing.webp`,
  },
  {
    id: "fallback-4",
    title: "Carpentry & Woodworking",
    description:
      "Special planks and custom-dimensioned materials designed for intricate joinery and flawless on-site fabrication.",
    image: `${imagesBase}/Carpentry & Woodworking.webp`,
  },
  {
    id: "fallback-5",
    title: "Architectural & Interior Fit-Outs",
    description:
      "Bespoke door frames, window frames, and interior components milled exactly to your design blueprints.",
    image: `${imagesBase}/Architectural & Interior Fit-Outs.webp`,
  },
  {
    id: "fallback-6",
    title: "Wholesale & Institutional Trading",
    description:
      "Consistent, high-volume bulk supply empowering organized timber traders and downstream distributors.",
    image: `${imagesBase}/Wholesale & Institutional Trading.webp`,
  },
];

const resolveIndustries = (payload: unknown): IndustryRecord[] => {
  if (!payload || typeof payload !== "object") return [];
  const data = payload as Record<string, unknown>;
  if (Array.isArray(data.industries)) {
    return data.industries as IndustryRecord[];
  }
  return [];
};

export function IndustriesSection() {
  const [industries, setIndustries] = useState<IndustryCard[]>(fallbackIndustries);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load industries synchronously from the imported JSON.  Because the
    // data is bundled with the application there is no need to fetch it.
    const resolved = resolveIndustries(industriesData as unknown);
    const active = resolved.filter(
      (industry) => typeof industry.isActive !== "boolean" || industry.isActive,
    );
    if (active.length) {
      setIndustries(
        active.map((industry, index) => ({
          id: industry._id || `industry-${index}`,
          title: industry.title,
          description: industry.description,
          image:
            getFileUrl(industry.image || industry.image_path || '') ||
            fallbackIndustries[index % fallbackIndustries.length].image,
        })),
      );
    }
    setLoading(false);
  }, []);

  const displayIndustries = useMemo(
    () => (industries.length ? industries : fallbackIndustries),
    [industries]
  );

  return (
    <section className="content-section industries-section" id="industries">
      <div className="container">
        <div className="industries-section__header">

          <h2 className="industries-section__title" data-aos="fade-up" data-aos-delay="80" data-aos-duration="1000">
            Industries We Power
          </h2>
          <p className="industries-section__intro" data-aos="fade-up" data-aos-delay="160" data-aos-duration="1000">
            Engineered timber solutions for the sectors building tomorrow.
          </p>
        </div>

        {loading ? (
          <p className="industries-section__intro" style={{ textAlign: "center", marginBottom: "20px" }}>
            Loading industries...
          </p>
        ) : null}

        <div className="industries-section__grid" data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000">
          {displayIndustries.map((industry, index) => (
            <article className="industry-card" key={industry.id}>
              <div className="industry-card__media">
                <img
                  alt={industry.title}
                  className="industry-card__image"
                  loading="lazy"
                  src={industry.image}
                />
                <div className="industry-card__number">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>
              <div className="industry-card__body">
                <h3 className="industry-card__title">{industry.title}</h3>
                <p className="industry-card__description">{industry.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
