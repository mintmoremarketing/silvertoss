import { useEffect, useMemo, useState } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import leadership data generated from the BSON dump.  The
// `convert_bson_to_json.py` script writes `leadership.json` into
// `src/data`, allowing us to import it directly instead of fetching
// from an API.
import leadershipData from "@/data/leadership.json";

type LeadershipMember = {
  _id?: string;
  name: string;
  role: string;
  desc?: string;
  bio?: string;
  img?: string;
  image?: string;
  mail?: string;
  email?: string;
  linkedin?: string;
  is_active?: boolean;
};

type LeadershipTab = "board" | "management" | null;

// No backend is available; leadership data is imported directly from
// `leadershipData` above.

const managementMembers: LeadershipMember[] = [
  {
    name: "Mr. Anand Kumar Singh",
    role: "Managing Director",
    desc: "At the helm of Silvertoss Industries, Mr. Anand Kumar Singh brings over 27 years of mastery in the timber industry. As Managing Director, he is the architect of the company's strategic vision and global growth. His expertise spans the entire business value chain, from the global procurement of round logs to precision manufacturing and logistics. Mr. Singh spearheads the company's bulk sourcing strategy and market-oriented production planning, ensuring that Silvertoss continues to set benchmarks in quality and operational excellence.",
  },
  {
    name: "Mrs. Kalyani Singh",
    role: "Executive Director",
    desc: "With over two decades of experience in the timber sector, Mrs. Kalyani Singh is the operational backbone of Silvertoss Industries. As Executive Director, she plays a pivotal role in driving organizational efficiency and stability.",
  },
  {
    name: "Mr. Gurucharan Acharya",
    // Updated designation: Mr. Gurucharan Acharya is now Executive Director
    role: "Executive Director",
    desc: "A veteran of the trade and a foundational pillar of Silvertoss, Mr. Gurucharan Acharya brings over 25 years of hands-on industry expertise to the Board. Having served as General Manager (Factory) prior to joining the leadership team, he possesses an intricate understanding of production planning and timber processing. In his current role, he oversees the manufacturing facility with a focus on rigorous quality control, while simultaneously managing key relationships within the trader and make-to-order segments.",
  },
  {
    name: "Mr. Dipak Kumar Singh",
    role: "Chief Financial Officer",
    desc: "With nearly two decades of association with the Company, Mr. Dipak Kumar Singh brings deep financial expertise and strong institutional knowledge as the Chief Financial Officer. Having progressed through roles of increasing responsibility, he has played a key role in strengthening accounting systems, statutory compliance, and internal controls. His experience spans financial management, budgeting, taxation, and regulatory compliance, supported by a thorough understanding of the timber processing and manufacturing business.",
  },
  {
    name: "Ms. Neha Lunia",
    role: "Company Secretary & Compliance Officer",
    desc: "Ms. Neha Lunia serves as the Company Secretary and Compliance Officer of Silvertoss Industries Limited, bringing over five years of specialized experience in corporate secretarial practice and regulatory compliance. She plays a pivotal role in strengthening the Company's governance framework, ensuring adherence to the Companies Act, 2013, SEBI regulations, and all applicable statutory mandates. In her capacity, she oversees board processes, maintains statutory records, and upholds best-in-class corporate governance standards.",
  },
];

const tabContent = {
  board: {
    title: "Board of Directors",
    intro:
      "Meet the experienced board steering Silvertoss Industries with long-term vision, industry expertise, and strong governance.",
  },
  management: {
    title: "The Management",
    intro:
      "Meet the leadership team responsible for daily execution, operations, compliance, and sustained business growth.",
  },
} as const;

export function LeadershipSection() {
  const [members, setMembers] = useState<LeadershipMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<LeadershipTab>(null);

  useEffect(() => {
    // Load leadership synchronously from the imported JSON.  Because the
    // data is bundled with the application there is no need to fetch it.
    const payload = leadershipData as { leadership?: LeadershipMember[] };
    setMembers(payload.leadership || []);
    setLoading(false);
  }, []);

  const boardMembers = useMemo(
    () => members.filter((member) => member.is_active !== false),
    [members],
  );

  const activeTitle = activeTab ? tabContent[activeTab].title : "";
  const activeIntro = activeTab ? tabContent[activeTab].intro : "";
  const activeMembers =
    activeTab === "board"
      ? boardMembers
      : activeTab === "management"
        ? managementMembers
        : [];

  const shouldShowLoading = activeTab === "board" && loading;
  const shouldShowEmptyState =
    activeTab === "board" && !loading && activeMembers.length === 0;

  return (
    <section className="content-section leadership-section" id="leadership">
      <div className="container">
        <div
          className="leadership-section__tabs"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <button
            className={`leadership-section__tab${
              activeTab === "board" ? " is-active" : ""
            }`}
            type="button"
            onClick={() => setActiveTab("board")}
          >
            Board of Directors
          </button>
          <button
            className={`leadership-section__tab${
              activeTab === "management" ? " is-active" : ""
            }`}
            type="button"
            onClick={() => setActiveTab("management")}
          >
            The Management
          </button>
        </div>

        {activeTab ? (
          <div className="leadership-section__header">
            <p
              className="leadership-section__eyebrow"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              {activeTitle}
            </p>
            <p
              className="leadership-section__intro"
              data-aos="fade-up"
              data-aos-delay="100"
              data-aos-duration="1000"
            >
              {activeIntro}
            </p>
          </div>
        ) : null}

        {shouldShowLoading ? (
          <p className="leadership-section__intro">Loading leadership team...</p>
        ) : null}

        {shouldShowEmptyState ? (
          <p className="leadership-section__intro">
            No leadership profiles available.
          </p>
        ) : null}

        {!shouldShowLoading && activeMembers.length > 0 ? (
          <Swiper
            key={activeTab}
            breakpoints={{
              576: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1200: {
                slidesPerView: 3,
              },
            }}
            className="leadership-section__slider"
            modules={[Navigation]}
            navigation
            slidesPerView={1}
            spaceBetween={20}
          >
            {activeMembers.map((member, index) => {
              const bio = member.desc || member.bio || "";

              return (
                <SwiperSlide
                  className="leadership-section__slide"
                  key={member._id || `${activeTab}-${member.name}-${index}`}
                >
                  <article
                    className="leadership-card"
                    data-aos="fade-up"
                    data-aos-delay="150"
                    data-aos-duration="1000"
                  >
                    <div className="leadership-card__body">
                      <h3 className="leadership-card__name">{member.name}</h3>
                      <p className="leadership-card__role">{member.role}</p>
                      <p className="leadership-card__copy">{bio}</p>
                    </div>
                  </article>
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : null}
      </div>
    </section>
  );
}
