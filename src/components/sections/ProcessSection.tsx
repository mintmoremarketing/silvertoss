import { useEffect, useState } from "react";
import { getFileUrl } from "@/features/admin/api/http";

const DESCRIPTION_PREVIEW_LIMIT = 220;
const imagesBase = "/assets/images";
// Import the manufacturing process data generated from the BSON dump.  The
// `convert_bson_to_json.py` script writes `manufacturing-process.json`
// into `src/data`, allowing us to import it directly instead of
// fetching from an API.
import processData from "@/data/manufacturing-process.json";

type ProcessStep = {
  _id?: string;
  title: string;
  description: string;
  image: string;
  isActive?: boolean;
  iconSrc?: string;
};

type ProcessResponse = {
  manufacturingProcess?: {
    sectionTitle?: string;
    sectionIntro?: string;
    processItems?: ProcessStep[];
  };
  section?: {
    sectionTitle?: string;
    sectionIntro?: string;
  };
  processItems?: ProcessStep[];
};

const processIcons = {
  roundTimberLogs: `${imagesBase}/Round Timber Logs.png`,
  sawnTimber: `${imagesBase}/Sawn Timber.png`,
  windowDoorFrames: `${imagesBase}/Window and Door Frames.png`,
  woodenPlanks: `${imagesBase}/Wooden Planks.png`,
};

const fallbackProcessSteps: ProcessStep[] = [
  {
    title: "Round Timber Logs",
    description:
      "Procurement & Inspection Our process begins with the strategic procurement of high-grade Timber Round Logs from approved global suppliers in Malaysia, Indonesia, PNG, Suriname, the USA, and South Africa, alongside premium domestic sources. Upon arrival, every log undergoes a rigorous quality audit to verify species, grade, and dimensions, ensuring they are free from defects like decay or infestation. Log Yard Management To maintain material integrity, inspected logs are systematically stacked in our designated log yards. We segregate timber based on species and intended end-use, employing strict handling protocols to prevent moisture imbalance or physical deterioration prior to processing.",
    image: `${imagesBase}/process_1.jpg`,
    iconSrc: processIcons.roundTimberLogs,
  },
  {
    title: "Sawn Timber",
    description:
      "Precision Sawing & Sizing The transformation begins in our primary sawing section, where logs are converted into rough-sawn timber using world-class Wood-Mizer band saw technology. This ensures high cutting accuracy and minimal wastage. The timber then undergoes secondary resawing and cross-cutting to meet standard commercial sizes or custom client specifications. Seasoning & Planing Quality is locked in during the drying phase. The cut timber is treated in our in-house seasoning chambers, where controlled temperature and humidity regulation ensure uniform drying. This critical step enhances dimensional stability and immunizes the wood against warping and fungal attacks. Finally, the dried timber is processed through advanced planing machines to achieve a mirror-smooth surface and exacting thickness.",
    // Align fallback image with the static assets mapping: use process_2.jpg for Sawn Timber.
    image: `${imagesBase}/process_2.jpg`,
    iconSrc: processIcons.sawnTimber,
  },
  {
    title: "Window and Door Frames",
    description:
      "Joinery & Fabrication For our precision-engineered frames, we select only the finest seasoned and planed timber. Using modern machinery, we execute complex operations including groove formation, rebate cutting, and mortise and tenon joinery tailored to specific design requirements. Assembly & Finishing Individual components are expertly assembled into complete Window and Door Frames. Our quality team rigorously checks each unit for squareness, alignment, and joint strength. The frames undergo a final sanding and surface correction process to ensure a flawless finish before being cleared for dispatch.",
    // Align fallback image with the static assets mapping: use process_3.jpg for Window and Door Frames.
    image: `${imagesBase}/process_3.jpg`,
    iconSrc: processIcons.windowDoorFrames,
  },
  {
    title: "Wooden Planks",
    description:
      `Cutting & Surface Processing Our Wooden Planks are crafted from seasoned timber selected for superior grain orientation. Using precision band saws and straight-line cutting machines, we cut planks to exact thickness and width requirements. These are then processed through surface finishing machines to ensure straight edges and uniform consistency suitable for high-end interior applications.

      Inspection & Dispatch Every plank undergoes a final quality inspection to verify dimensional accuracy and structural soundness. Approved planks are securely bundled and packed to prevent damage during transit, ensuring they arrive at your project site ready for installation.`,
    // Align fallback image with the static assets mapping: use process_4.jpg for Wooden Planks.
    image: `${imagesBase}/process_4.jpg`,
    iconSrc: processIcons.woodenPlanks,
  },
];

const fallbackSection = {
  sectionTitle: "Our Manufacturing Process",
  sectionIntro:
    "At Silvertoss Industries, perfection is a process. From the global sourcing of raw logs to the final precision cut, our manufacturing line is optimized for accuracy, structural integrity, and sustainable efficiency.",
};

const getIconForStep = (title: string, index: number) => {
  const normalizedTitle = title.trim().toLowerCase();

  if (normalizedTitle.includes("round timber") || normalizedTitle.includes("logs")) {
    return processIcons.roundTimberLogs;
  }

  if (normalizedTitle.includes("sawn timber") || normalizedTitle.includes("saw")) {
    return processIcons.sawnTimber;
  }

  if (
    normalizedTitle.includes("window") ||
    normalizedTitle.includes("door") ||
    normalizedTitle.includes("frame")
  ) {
    return processIcons.windowDoorFrames;
  }

  if (normalizedTitle.includes("plank")) {
    return processIcons.woodenPlanks;
  }

  const fallbackIcons = [
    processIcons.roundTimberLogs,
    processIcons.sawnTimber,
    processIcons.windowDoorFrames,
    processIcons.woodenPlanks,
  ];

  return fallbackIcons[index % fallbackIcons.length];
};

const normalizeProcessPayload = (payload: ProcessResponse) => {
  const sectionTitle =
    payload?.manufacturingProcess?.sectionTitle ||
    payload?.section?.sectionTitle ||
    fallbackSection.sectionTitle;
  const sectionIntro =
    payload?.manufacturingProcess?.sectionIntro ||
    payload?.section?.sectionIntro ||
    fallbackSection.sectionIntro;

  const fromRoot = Array.isArray(payload?.processItems) ? payload.processItems : [];
  const fromDoc = Array.isArray(payload?.manufacturingProcess?.processItems)
    ? payload.manufacturingProcess.processItems
    : [];

  const itemsSource = fromRoot.length ? fromRoot : fromDoc;
  const activeItems = itemsSource.filter(
    (item) => typeof item?.isActive !== "boolean" || item.isActive
  );

  const normalizedItems =
    activeItems.length > 0
      ? activeItems.map((item, index) => ({
          _id: item._id,
          title: item.title,
          description: item.description,
          // Use either the explicit image or image_path from the JSON.  Prefix
          // a leading slash if necessary via getFileUrl.  Fallback to the
          // placeholder image for this index when neither exists.
          image:
            getFileUrl(item.image || (item as any).image_path || '') ||
            fallbackProcessSteps[index % fallbackProcessSteps.length].image,
          iconSrc: getIconForStep(item.title, index),
        }))
      : fallbackProcessSteps;

  return {
    sectionTitle,
    sectionIntro,
    items: normalizedItems,
  };
};

export function ProcessSection() {
  const [selectedStep, setSelectedStep] = useState<ProcessStep | null>(null);
  const [sectionTitle, setSectionTitle] = useState(fallbackSection.sectionTitle);
  const [sectionIntro, setSectionIntro] = useState(fallbackSection.sectionIntro);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>(fallbackProcessSteps);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedStep) {
      document.body.style.overflow = "";
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedStep(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedStep]);

  useEffect(() => {
    // Load the manufacturing process synchronously from the imported JSON.
    const payload = processData as ProcessResponse;
    const normalized = normalizeProcessPayload(payload);
    setSectionTitle(normalized.sectionTitle);
    setSectionIntro(normalized.sectionIntro);
    setProcessSteps(normalized.items as ProcessStep[]);
    setLoading(false);
  }, []);

  return (
    <section className="content-section process-section" id="process">
      <div className="container">
        <div className="process-section__header">
          <h2 className="process-section__title" data-aos="fade-up" data-aos-duration="1000">{sectionTitle}</h2>
          <p className="process-section__intro" data-aos="fade-up" data-aos-delay="100" data-aos-duration="1000">
            {sectionIntro}
          </p>
        </div>

        {loading ? (
          <p className="process-section__intro" style={{ textAlign: "center", marginBottom: "18px" }}>
            Loading process steps...
          </p>
        ) : null}

        <div className="process-section__grid" data-aos="fade-up" data-aos-delay="150" data-aos-duration="1000">
          {processSteps.map((step, index) => (
            <article className="process-card" key={step._id || `${step.title}-${index}`}>
              <div className="process-card__icon">
                <img alt="" aria-hidden="true" src={step.iconSrc} />
              </div>
              <h3 className="process-card__title">{step.title}</h3>
              <p className="process-card__description">{step.description}</p>
              {step.description?.length > DESCRIPTION_PREVIEW_LIMIT ? (
                <button
                  className="process-card__button"
                  type="button"
                  onClick={() => setSelectedStep(step)}
                >
                  Read more
                </button>
              ) : null}
            </article>
          ))}
        </div>
      </div>

      {selectedStep ? (
        <div
          aria-modal="true"
          className="process-modal"
          role="dialog"
          onClick={() => setSelectedStep(null)}
        >
          <div
            className="process-modal__panel"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              aria-label="Close process details"
              className="process-modal__close"
              type="button"
              onClick={() => setSelectedStep(null)}
            >
              <i aria-hidden="true" className="fa-solid fa-xmark" />
            </button>

            <div className="process-modal__media">
              <img
                alt={selectedStep.title}
                className="process-modal__image"
                src={selectedStep.image}
              />
            </div>

            <div className="process-modal__content">
              <h3 className="process-modal__title">{selectedStep.title}</h3>
              <div className="process-modal__description">
                <p className="process-modal__text">{selectedStep.description}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
