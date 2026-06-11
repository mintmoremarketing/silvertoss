import { Link } from "react-router-dom";

import { ProductsSection } from "../components/sections/ProductsSection";
import { ProcessSection } from "../components/sections/ProcessSection";
import { IndustriesSection } from "../components/sections/IndustriesSection";
import { LocationSection } from "../components/sections/LocationSection";
import { ContactSection } from "../components/sections/ContactSection";
import MediaSection from "@/components/sections/MediaSection";
import { LeadershipSection } from "../components/sections/LeadershipSection";
import { useEffect, useState } from "react";
import { routePaths } from "@/app/router/routePaths";

// Import static data generated from the BSON dump. Vite's JSON import
// support allows us to import JSON files as modules. The data lives in
// `src/data`, which is populated by the `convert_bson_to_json.py` script.
import allBannersData from "@/data/allBanners.json";


type BannerItem = {
  _id?: string;
  title?: string;
  description?: string;
  image?: string;
  image_path?: string;
  banner_url?: string;
  link?: string;
};

// Note: there is no backend API when serving the static build. Dynamic
// content is imported from JSON modules (see above) instead of fetched.

export function HomePage() {
const [heroBanner, setHeroBanner] = useState<BannerItem | null>(null);

useEffect(() => {
  // Load banner data synchronously from the imported JSON. If no data is
  // present fallback values will be used when rendering below.
  const list: BannerItem[] =
    (allBannersData as { banners?: BannerItem[] }).banners || [];
  if (list.length > 0) {
    setHeroBanner(list[0]);
  }
}, []);

const heroTitle = heroBanner?.title?.trim() || "A Legacy of Evolution and Engineering";
const heroDescription = heroBanner?.description?.trim() || "Established in 2002, Silvertoss Industries Limited has evolved from a global timber trading house into Eastern India's leading integrated timber manufacturer. By combining international sourcing with advanced processing, we deliver high-quality, precision timber solutions for modern construction and interiors. As we continue to grow, our commitment remains anchored in quality, innovation, and responsible practices, shaping solutions that meet the evolving demands of modern infrastructure and design.";
const heroPrimaryLink = "#products";


  return (
    <main>
      {/* ==================== Hero Section Start ================== */}

      <section className="hero-section" id="aboutus">
        <div className="container hero-section__content">
          <div className="hero-section__inner">
            {heroTitle ? (
              <p
                className="hero-section__eyebrow"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="0"
              >
                {heroTitle}
              </p>
            ) : null}

            {heroDescription ? (
              <p
                className="hero-section__copy"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="150"
              >
                {heroDescription}
              </p>
            ) : null}

            <div
              className="hero-section__actions"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="300"
            >
              <a
                className="hero-section__button hero-section__button--primary"
                href={heroPrimaryLink}
              >
                Explore Products
              </a>
              <a
                className="hero-section__button hero-section__button--secondary"
                href="#getintouch"
              >
                Get in Touch
              </a>
            </div>
          </div>

          <Link
            className="hero-section__scroll"
            to={routePaths.products}
            aria-label="Scroll to next section"
          >
            <span className="hero-section__scroll-icon" />
          </Link>
        </div>
      </section>

      {/* ==================== Hero Section End ================== */}
      {/* 
      <LeadershipSection /> */}

      <ProductsSection />

      <ProcessSection />

      <IndustriesSection />
      <MediaSection />
      <LocationSection />

      <ContactSection />

      {/* <div id="investors">
        <LeadershipSection />
      </div> */}
    </main>
  );
}





