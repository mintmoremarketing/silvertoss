import { useEffect, useState } from "react";
import { getFileUrl } from "@/features/admin/api/http";

const imagesBase = "/assets/images";

// Import products and categories data generated from the BSON dump.
// The `convert_bson_to_json.py` script writes `products.json` and
// `categories.json` into `src/data`, allowing us to import them
// directly instead of fetching from an API.
import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";

type ProductRecord = {
  _id: string;
  name: string;
  description?: string;
  short_description?: string;
  image?: string;
  image_path?: string;
  category_id?: string | { _id?: string; name?: string };
  category?: { _id?: string; name?: string };
  sku?: string;
};

type CategoryRecord = {
  _id: string;
  name: string;
};

type ProductCard = {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
  cta: string;
  details: string[];
};

const fallbackProducts: ProductCard[] = [
  {
    id: "fallback-1",
    category: "Hardwood",
    title: "Premium Hardwood Planks",
    description:
      "Our premium hardwood planks are sourced from sustainably managed forests. Each plank undergoes rigorous quality control, ensuring superior durability, beautiful grain patterns, and consistent sizing. Perfect for flooring, furniture, and architectural applications.",
    image: `${imagesBase}/products_1.png`,
    cta: "Learn More",
    details: [
      "FSC Certified",
      "Kiln Dried",
      "Multiple Grades Available",
      "Custom Cutting",
    ],
  },
  {
    id: "fallback-2",
    category: "Lumber",
    title: "Industrial Lumber",
    description:
      "High-quality industrial lumber suitable for construction, manufacturing, and commercial applications. Built for dependable performance across high-demand use cases.",
    image: `${imagesBase}/products_2.png`,
    cta: "Learn More",
    details: [
      "Structural Grade Options",
      "Moisture Tested",
      "Bulk Supply Ready",
      "Commercial Distribution",
    ],
  },
  {
    id: "fallback-3",
    category: "Engineered",
    title: "Engineered Wood Products",
    description:
      "Advanced engineered wood products including plywood, MDF, and particle boards. Manufactured for consistency, stability, and efficient fabrication.",
    image: `${imagesBase}/products_3.png`,
    cta: "Learn More",
    details: [
      "Plywood and MDF",
      "Dimensional Stability",
      "Smooth Finish Options",
      "Interior and Exterior Use",
    ],
  },
  {
    id: "fallback-4",
    category: "Custom",
    title: "Custom Millwork",
    description:
      "Specialized custom millwork services for architectural and decorative applications. Our team delivers tailored timber solutions with precision workmanship.",
    image:
      "",
    cta: "Learn More",
    details: [
      "Architectural Detailing",
      "Decorative Profiles",
      "Project-Based Fabrication",
      "Precision Finishing",
    ],
  },
  {
    id: "fallback-5",
    category: "Sustainable",
    title: "Sustainable Timber",
    description:
      "Responsibly sourced timber from certified sustainable forests. We prioritize traceability, environmental stewardship, and long-term material quality.",
    image: `${imagesBase}/products_5.png`,
    cta: "Learn More",
    details: [
      "Certified Forest Sources",
      "Traceable Supply Chain",
      "Reduced Environmental Impact",
      "Long-Term Durability",
    ],
  },
  {
    id: "fallback-6",
    category: "Veneers",
    title: "Specialty Veneers",
    description:
      "Premium wood veneers featuring exotic and domestic species. Precision-cut for consistency, flexibility, and refined finishing across interior applications.",
    image:
      "",
    cta: "Learn More",
    details: [
      "Exotic and Domestic Species",
      "Bookmatched Options",
      "Consistent Thin Cuts",
      "Furniture and Panel Ready",
    ],
  },
];

const safeArray = (payload: unknown): ProductRecord[] => {
  if (!payload || typeof payload !== "object") return [];
  const data = payload as Record<string, unknown>;

  const candidates = [
    data.products,
    (data.data as Record<string, unknown> | undefined)?.products,
    (data.products as Record<string, unknown> | undefined)?.docs,
    (data.data as Record<string, unknown> | undefined)?.docs,
    data.product,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate as ProductRecord[];
    }
  }

  return [];
};

const safeCategories = (payload: unknown): CategoryRecord[] => {
  if (!payload || typeof payload !== "object") return [];
  const data = payload as Record<string, unknown>;
  if (Array.isArray(data.categories)) {
    return data.categories as CategoryRecord[];
  }
  return [];
};

const normalizeProducts = (products: ProductRecord[], categories: CategoryRecord[]): ProductCard[] => {
  const categoryMap = new Map(categories.map((category) => [category._id, category.name]));

  return products.map((product) => {
    const categoryId =
      typeof product.category_id === "string"
        ? product.category_id
        : product.category_id?._id;
    const categoryName =
      product.category?.name ||
      (typeof product.category_id === "object" ? product.category_id?.name : undefined) ||
      (categoryId ? categoryMap.get(categoryId) : undefined) ||
      "Product";

    const description =
      product.description?.trim() ||
      product.short_description?.trim() ||
      "Premium product from Silvertoss Industries.";

    const details = [
      product.sku ? `SKU: ${product.sku}` : "",
      categoryName ? `Category: ${categoryName}` : "",
    ].filter(Boolean);

    return {
      id: product._id,
      category: categoryName,
      title: product.name,
      description,
      image: getFileUrl(product.image || product.image_path || "") || `${imagesBase}/products_1.png`,
      cta: "Learn More",
      details: details.length ? details : ["Premium quality", "Trusted supply"],
    };
  });
};

export function ProductsSection() {
  const [selectedProduct, setSelectedProduct] = useState<ProductCard | null>(null);
  const [products, setProducts] = useState<ProductCard[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedProduct) {
      document.body.style.overflow = "";
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedProduct(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProduct]);

  useEffect(() => {
    // Load products synchronously from the imported JSON.  Because the
    // data is bundled with the application there is no need to fetch it.
    const productsPayload = productsData as unknown;
    const categoriesPayload = categoriesData as unknown;
    const resolvedProducts = safeArray(productsPayload);
    const resolvedCategories = safeCategories(categoriesPayload);
    if (resolvedProducts.length > 0) {
      setProducts(normalizeProducts(resolvedProducts, resolvedCategories));
    }
    setLoading(false);
  }, []);


  return (
    <section className="content-section alt" id="products">
      <div className="container">
        <div className="products-section__header">
          <h2
            className="products-section__title"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            Our Products
          </h2>
          <p
            className="products-section__intro"
            data-aos="fade-up"
            data-aos-delay="100"
            data-aos-duration="1000"
          >
            At Silvertoss Industries Limited, we transform premium imported and
            domestic round logs into high-performance structural components.
            Driven by cutting-edge machinery and our proprietary in-house
            seasoning facilities, our portfolio is the gold standard for
            consistency, durability, and dimensional accuracy.
          </p>
        </div>

        {loading ? (
          <p
            className="products-section__intro"
            style={{ textAlign: "center", marginBottom: "20px" }}
          >
            Loading products...
          </p>
        ) : null}

        <div
          className="products-section__grid"
          data-aos="fade-up"
          data-aos-delay="150"
          data-aos-duration="1000"
        >
          {products.map((product) => (
            <button
              key={product.id}
              className="product-card"
              type="button"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="product-card__media">
                <img
                  alt={product.title}
                  className="product-card__image"
                  loading="lazy"
                  src={product.image}
                />
                <div className="product-card__overlay">
                  {/* <span className="product-card__tag">{product.category}</span> */}
                  <h3 className="product-card__tag">{product.title}</h3>
                </div>
              </div>

              <div className="product-card__body">
                {/* <p className="product-card__description">
                  {product.description}
                </p> */}
                <span className="product-card__link">
                  {product.cta} <i className="fa-solid fa-arrow-right"></i>
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedProduct ? (
        <div
          aria-modal="true"
          className="product-modal"
          role="dialog"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="product-modal__panel"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              aria-label="Close product details"
              className="product-modal__close"
              type="button"
              onClick={() => setSelectedProduct(null)}
            >
              <i aria-hidden="true" className="fa-solid fa-xmark" />
            </button>

            <div className="product-modal__media">
              <img
                alt={selectedProduct.title}
                className="product-modal__image"
                src={selectedProduct.image}
              />
              {/* <div className="product-modal__badge">
                {selectedProduct.category}
              </div> */}
            </div>

            <div className="product-modal__content">
              <h3 className="product-modal__title">{selectedProduct.title}</h3>
              <p className="product-modal__text">
                {selectedProduct.description}
              </p>

              <div className="product-modal__features">
                {/* {selectedProduct.details.map((detail) => (
                  <div className="product-modal__feature" key={detail}>
                    {detail}
                  </div>
                ))} */}
              </div>

              <a
                className="product-modal__button"
                href="#contact"
                onClick={() => setSelectedProduct(null)}
              >
                Request Quote
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
