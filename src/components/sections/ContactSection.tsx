import { useEffect, useMemo, useState } from "react";

// Import about company/contact data generated from the BSON dump.  The
// `convert_bson_to_json.py` script writes `about-company.json` into
// `src/data`, allowing us to import it directly instead of fetching
// from an API.
import aboutCompanyData from "@/data/about-company.json";

type InfoBox = {
  _id: string;
  mediator_type: string;
  mediator_value: string;
  content: string;
  status?: boolean;
  created_at?: string;
};

type ContactCard = {
  title: string;
  value: string;
  detail: string;
  iconClass: string;
  href?: string;
};

// No backend is available; contact data is imported directly from
// `aboutCompanyData` above.

const fallbackBoxes: InfoBox[] = [
  {
    _id: "fallback-phone",
    mediator_type: "Phone",
    mediator_value: "033 4801 7916",
    content: "+91 7980396853",
  },
  {
    _id: "fallback-email",
    mediator_type: "Email",
    mediator_value: "singhbros1@yahoo.co.in",
    content: "kcms_1971@yahoo.com",
  },
  {
    _id: "fallback-location",
    mediator_type: "Location",
    mediator_value: "B-4/486, Kalyani, Nadia",
    content: "W.B. - 741235, India",
  },
];

const iconByType = (type: string, index: number) => {
  const normalized = type.toLowerCase();
  if (normalized.includes("phone")) return "fa-solid fa-phone";
  if (normalized.includes("email")) return "fa-regular fa-envelope";
  if (normalized.includes("location") || normalized.includes("address")) return "fa-solid fa-location-dot";
  if (normalized.includes("hour") || normalized.includes("time")) return "fa-regular fa-clock";
  return ["fa-solid fa-phone", "fa-regular fa-envelope", "fa-solid fa-location-dot"][index % 3];
};

const formatLink = (value: string, type: string) => {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const lower = type.toLowerCase();
  if (lower.includes("phone") || /^[+\d()\s-]+$/.test(trimmed)) {
    return `tel:${trimmed.replace(/[^\d+]/g, "")}`;
  }

  if (lower.includes("email") || trimmed.includes("@")) {
    return `mailto:${trimmed}`;
  }

  if (lower.includes("location") || lower.includes("address")) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`;
  }

  return undefined;
};

export function ContactSection() {
  const [infoBoxes, setInfoBoxes] = useState<InfoBox[]>(fallbackBoxes);

  useEffect(() => {
    // Load contact cards synchronously from the imported JSON.  The
    // generated `about-company.json` file exposes the data under several
    // key names: `aboutCompany`, `aboutCompanies`, or `items`.
    const payload = aboutCompanyData as {
      aboutCompany?: InfoBox[];
      aboutCompanies?: InfoBox[];
      items?: InfoBox[];
    };
    const resolved = payload.aboutCompany || payload.aboutCompanies || payload.items || [];
    const active = resolved.filter((entry) => entry.status !== false);
    if (active.length) {
      const sorted = [...active].sort((a, b) => {
        const aTime = a.created_at ? Date.parse(a.created_at) : 0;
        const bTime = b.created_at ? Date.parse(b.created_at) : 0;
        return (Number.isNaN(aTime) ? 0 : aTime) - (Number.isNaN(bTime) ? 0 : bTime);
      });
      setInfoBoxes(sorted);
    }
  }, []);

  const contactCards = useMemo<ContactCard[]>(
    () =>
      (infoBoxes.length ? infoBoxes : fallbackBoxes).map((entry, index) => ({
        title: entry.mediator_type,
        value: entry.mediator_value,
        detail: entry.content,
        iconClass: iconByType(entry.mediator_type, index),
        href: formatLink(entry.mediator_value, entry.mediator_type),
      })),
    [infoBoxes]
  );

  return (
    <section className="content-section contact-section" id="contact">
      <div className="container">
        <div
          className="contact-section__grid"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          {contactCards.map((card, index) =>
            card.href ? (
              <a
                className="contact-card contact-card--link"
                href={card.href}
                key={`${card.title}-${index}`}
                rel={card.href.startsWith("https://") ? "noreferrer" : undefined}
                target={card.href.startsWith("https://") ? "_blank" : undefined}
              >
                <div className="contact-card__icon-wrap">
                  <i aria-hidden="true" className={card.iconClass} />
                </div>
                <div className="contact-card__content">
                  <h3 className="contact-card__title">{card.title}</h3>
                  <p className="contact-card__value">{card.value}</p>
                  {card.detail ? (
                    <p className="contact-card__detail">{card.detail}</p>
                  ) : null}
                </div>
              </a>
            ) : (
              <article className="contact-card" key={`${card.title}-${index}`}>
                <div className="contact-card__icon-wrap">
                  <i aria-hidden="true" className={card.iconClass} />
                </div>
                <div className="contact-card__content">
                  <h3 className="contact-card__title">{card.title}</h3>
                  <p className="contact-card__value">{card.value}</p>
                  {card.detail ? (
                    <p className="contact-card__detail">{card.detail}</p>
                  ) : null}
                </div>
              </article>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
