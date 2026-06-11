import type { AdminResourceConfig } from "@/features/admin/config/types";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

const withSlug = (sourceField: string) => (values: Record<string, string>) => {
  const next = { ...values };
  if (!next.slug?.trim() && next[sourceField]?.trim()) {
    next.slug = slugify(next[sourceField]);
  }
  return next;
};

export const adminResources: AdminResourceConfig[] = [
  {
    key: "categories",
    label: "Categories",
    route: "/admin/categories",
    api: {
      list: { path: "/categories" },
      create: { path: "/categories", method: "POST", bodyType: "json" },
      update: {
        path: (id) => `/categories/${id}`,
        method: "PUT",
        bodyType: "json",
      },
      remove: { path: (id) => `/categories/${id}`, method: "DELETE" },
      toggle: {
        path: (id) => `/categories/${id}/status`,
        method: "PATCH",
        payloadKey: "status",
      },
    },
    listKeys: ["categories"],
    statusKey: "status",
    normalizeSubmit: withSlug("name"),
    fields: [
      {
        name: "name",
        label: "Name",
        type: "text",
        required: true,
        maxLength: 80,
      },
      {
        name: "slug",
        label: "Slug",
        type: "text",
        required: false,
        maxLength: 120,
      },
    ],
    tableColumns: [
      { key: "name", label: "Name" },
      { key: "slug", label: "Slug" },
      { key: "status", label: "Status", type: "boolean" },
    ],
  },
  {
    key: "products",
    label: "Products",
    route: "/admin/products",
    api: {
      list: { path: "/products" },
      create: { path: "/products", method: "POST", bodyType: "formData" },
      update: {
        path: (id) => `/products/${id}`,
        method: "PUT",
        bodyType: "formData",
      },
      remove: { path: (id) => `/products/${id}`, method: "DELETE" },
    },
    listKeys: ["products"],
    normalizeSubmit: withSlug("name"),
    fields: [
      {
        name: "category_id",
        label: "Category",
        type: "select",
        required: true,
        optionsFrom: "categories",
        optionLabelKey: "name",
      },
      {
        name: "name",
        label: "Name",
        type: "text",
        required: true,
        maxLength: 100,
      },
      {
        name: "slug",
        label: "Slug",
        type: "text",
        required: false,
        maxLength: 140,
      },
      {
        name: "sku",
        label: "SKU",
        type: "text",
        required: true,
        maxLength: 80,
      },
      {
        name: "short_description",
        label: "Short Description",
        type: "textarea",
      },
      { name: "description", label: "Description", type: "textarea" },
      { name: "image", label: "Image", type: "file", accept: "image/*" },
    ],
    tableColumns: [
      { key: "name", label: "Name" },
      { key: "slug", label: "Slug" },
      { key: "sku", label: "SKU" },
      { key: "category_id", label: "Category" },
      { key: "image", label: "Image", type: "image" },
    ],
  },
  // {
  //   key: "about-us",
  //   label: "About Us",
  //   route: "/admin/about-us",
  //   api: {
  //     list: { path: "/about-us" },
  //     create: { path: "/about-us", method: "POST", bodyType: "formData" },
  //     update: { path: (id) => `/about-us/${id}`, method: "PUT", bodyType: "formData" },
  //     remove: { path: (id) => `/about-us/${id}`, method: "DELETE" },
  //   },
  //   listKeys: ["abouts", "aboutUs"],
  //   fields: [
  //     { name: "title", label: "Title", type: "text", required: true, maxLength: 120 },
  //     { name: "description", label: "Description", type: "textarea" },
  //     { name: "completed_projects", label: "Completed Projects", type: "number" },
  //     { name: "company_followers", label: "Company Followers", type: "number" },
  //     { name: "image_1", label: "Image 1", type: "file", accept: "image/*" },
  //     { name: "image_2", label: "Image 2", type: "file", accept: "image/*" },
  //   ],
  //   tableColumns: [
  //     { key: "title", label: "Title" },
  //     { key: "completed_projects", label: "Completed" },
  //     { key: "company_followers", label: "Followers" },
  //     { key: "image_1", label: "Image 1", type: "image" },
  //     { key: "image_2", label: "Image 2", type: "image" },
  //   ],
  // },
  // {
  //   key: "about-us-data",
  //   label: "About Data",
  //   route: "/admin/about-us-data",
  //   api: {
  //     list: { path: "/about-us-multiple-data" },
  //     create: { path: "/about-us-multiple-data", method: "POST", bodyType: "formData" },
  //     update: { path: (id) => `/about-us-multiple-data/${id}`, method: "PUT", bodyType: "formData" },
  //     remove: { path: (id) => `/about-us-multiple-data/${id}`, method: "DELETE" },
  //   },
  //   listKeys: ["aboutUsMultipleData"],
  //   fields: [
  //     { name: "about_us_id", label: "About Us Entry", type: "select", required: true, optionsFrom: "about-us", optionLabelKey: "title" },
  //     { name: "title", label: "Title", type: "text", required: true, maxLength: 120 },
  //     { name: "image_path", label: "Image", type: "file", accept: "image/*" },
  //   ],
  //   tableColumns: [
  //     { key: "title", label: "Title" },
  //     { key: "about_us_id", label: "About Entry" },
  //     { key: "image_path", label: "Image", type: "image" },
  //   ],
  // },
  {
    key: "about-company",
    label: "About Company",
    route: "/admin/about-company",
    api: {
      list: { path: "/about-company" },
      create: { path: "/about-company", method: "POST", bodyType: "json" },
      update: {
        path: (id) => `/about-company/${id}`,
        method: "PUT",
        bodyType: "json",
      },
      remove: { path: (id) => `/about-company/${id}`, method: "DELETE" },
      toggle: {
        path: (id) => `/about-company/${id}/status`,
        method: "PATCH",
        payloadKey: "status",
      },
    },
    listKeys: ["aboutCompany", "aboutCompanies", "items"],
    statusKey: "status",
    fields: [
      {
        name: "mediator_type",
        label: "Mediator Type",
        type: "text",
        required: true,
        maxLength: 20,
      },
      {
        name: "mediator_value",
        label: "Mediator Value",
        type: "text",
        required: true,
        maxLength: 30,
      },
      {
        name: "content",
        label: "Content",
        type: "text",
        required: false,
        maxLength: 50,
      },
    ],
    tableColumns: [
      { key: "mediator_type", label: "Type" },
      { key: "mediator_value", label: "Value" },
      { key: "content", label: "Content" },
      { key: "status", label: "Status", type: "boolean" },
    ],
  },
  // {
  //   key: "production-process",
  //   label: "Production Process",
  //   route: "/admin/production-process",
  //   api: {
  //     list: { path: "/production-process" },
  //     create: { path: "/production-process", method: "POST", bodyType: "formData" },
  //     update: { path: (id) => `/production-process/${id}`, method: "PUT", bodyType: "formData" },
  //     remove: { path: (id) => `/production-process/${id}`, method: "DELETE" },
  //   },
  //   listKeys: ["productionProcesses"],
  //   fields: [
  //     { name: "title", label: "Title", type: "text", required: true, maxLength: 120 },
  //     { name: "description", label: "Description", type: "textarea" },
  //     { name: "image_path", label: "Image", type: "file", accept: "image/*" },
  //   ],
  //   tableColumns: [
  //     { key: "title", label: "Title" },
  //     { key: "description", label: "Description" },
  //     { key: "image_path", label: "Image", type: "image" },
  //   ],
  // },
  // {
  //   key: "why-choose",
  //   label: "Why Choose",
  //   route: "/admin/why-choose",
  //   api: {
  //     list: { path: "/why-choose-silvertoos" },
  //     create: { path: "/why-choose-silvertoos", method: "POST", bodyType: "formData" },
  //     update: { path: (id) => `/why-choose-silvertoos/${id}`, method: "PUT", bodyType: "formData" },
  //     remove: { path: (id) => `/why-choose-silvertoos/${id}`, method: "DELETE" },
  //   },
  //   listKeys: ["whyChooseSilvertoos"],
  //   fields: [
  //     { name: "title", label: "Title", type: "text", required: true, maxLength: 120 },
  //     { name: "description", label: "Description", type: "textarea" },
  //     { name: "image_path", label: "Image", type: "file", accept: "image/*" },
  //   ],
  //   tableColumns: [
  //     { key: "title", label: "Title" },
  //     { key: "description", label: "Description" },
  //     { key: "image_path", label: "Image", type: "image" },
  //   ],
  // },
  // {
  //   key: "our-clients",
  //   label: "Clients",
  //   route: "/admin/our-clients",
  //   api: {
  //     list: { path: "/our-clients" },
  //     create: { path: "/our-clients", method: "POST", bodyType: "formData" },
  //     update: { path: (id) => `/our-clients/${id}`, method: "PUT", bodyType: "formData" },
  //     remove: { path: (id) => `/our-clients/${id}`, method: "DELETE" },
  //   },
  //   listKeys: ["ourClients"],
  //   fields: [{ name: "client_logo", label: "Client Logo", type: "file", required: true, accept: "image/*" }],
  //   tableColumns: [{ key: "client_logo", label: "Logo", type: "image" }],
  // },
  // {
  //   key: "testimonial-categories",
  //   label: "Testimonial Categories",
  //   route: "/admin/testimonial-categories",
  //   api: {
  //     list: { path: "/testimonial-categories" },
  //     create: { path: "/testimonial-categories", method: "POST", bodyType: "json" },
  //     update: { path: (id) => `/testimonial-categories/${id}`, method: "PUT", bodyType: "json" },
  //     remove: { path: (id) => `/testimonial-categories/${id}`, method: "DELETE" },
  //   },
  //   listKeys: ["categories", "testimonialCategories"],
  //   fields: [{ name: "name", label: "Name", type: "text", required: true, maxLength: 80 }],
  //   tableColumns: [{ key: "name", label: "Name" }],
  // },
  // {
  //   key: "testimonials",
  //   label: "Testimonials",
  //   route: "/admin/testimonials",
  //   api: {
  //     list: { path: "/testimonials" },
  //     create: { path: "/testimonials", method: "POST", bodyType: "formData" },
  //     update: { path: (id) => `/testimonials/${id}`, method: "PUT", bodyType: "formData" },
  //     remove: { path: (id) => `/testimonials/${id}`, method: "DELETE" },
  //     toggle: { path: (id) => `/testimonials/${id}/status`, method: "PATCH", payloadKey: "status" },
  //   },
  //   listKeys: ["testimonials"],
  //   statusKey: "status",
  //   fields: [
  //     { name: "testimonial_category_id", label: "Category", type: "select", required: true, optionsFrom: "testimonial-categories", optionLabelKey: "name" },
  //     { name: "name", label: "Name", type: "text", required: true, maxLength: 120 },
  //     { name: "description", label: "Description", type: "textarea", required: true },
  //     { name: "rating", label: "Rating", type: "number" },
  //     { name: "image_path", label: "Image", type: "file", accept: "image/*" },
  //   ],
  //   tableColumns: [
  //     { key: "name", label: "Name" },
  //     { key: "testimonial_category_id", label: "Category" },
  //     { key: "rating", label: "Rating" },
  //     { key: "image_path", label: "Image", type: "image" },
  //     { key: "status", label: "Status", type: "boolean" },
  //   ],
  // },
  // {
  //   key: "faqs",
  //   label: "FAQs",
  //   route: "/admin/faqs",
  //   api: {
  //     list: { path: "/faqs" },
  //     create: { path: "/faqs", method: "POST", bodyType: "json" },
  //     update: { path: (id) => `/faqs/${id}`, method: "PUT", bodyType: "json" },
  //     remove: { path: (id) => `/faqs/${id}`, method: "DELETE" },
  //     toggle: { path: (id) => `/faqs/${id}/status`, method: "PATCH", payloadKey: "status" },
  //   },
  //   listKeys: ["faqs"],
  //   statusKey: "status",
  //   fields: [
  //     { name: "title", label: "Question", type: "text", required: true, maxLength: 160 },
  //     { name: "description", label: "Answer", type: "textarea", required: true },
  //   ],
  //   tableColumns: [
  //     { key: "title", label: "Question" },
  //     { key: "description", label: "Answer" },
  //     { key: "status", label: "Status", type: "boolean" },
  //   ],
  // },
  // {
  //   key: "blogs",
  //   label: "Blogs",
  //   route: "/admin/blogs",
  //   api: {
  //     list: { path: "/blogs" },
  //     create: { path: "/blogs", method: "POST", bodyType: "formData" },
  //     update: { path: (id) => `/blogs/${id}`, method: "PUT", bodyType: "formData" },
  //     remove: { path: (id) => `/blogs/${id}`, method: "DELETE" },
  //     toggle: { path: (id) => `/blogs/${id}/status`, method: "PATCH", payloadKey: "status" },
  //   },
  //   listKeys: ["blogs"],
  //   statusKey: "status",
  //   normalizeSubmit: withSlug("title"),
  //   fields: [
  //     { name: "title", label: "Title", type: "text", required: true, maxLength: 150 },
  //     { name: "slug", label: "Slug", type: "text" },
  //     { name: "short_description", label: "Short Description", type: "textarea" },
  //     { name: "description", label: "Description", type: "textarea", required: true },
  //     { name: "image_path", label: "Image", type: "file", accept: "image/*" },
  //   ],
  //   tableColumns: [
  //     { key: "title", label: "Title" },
  //     { key: "slug", label: "Slug" },
  //     { key: "image_path", label: "Image", type: "image" },
  //     { key: "status", label: "Status", type: "boolean" },
  //   ],
  // },
  {
    key: "leadership",
    label: "Leadership",
    route: "/admin/leadersip",
    api: {
      list: { path: "/leadership" },
      create: { path: "/leadership", method: "POST", bodyType: "formData" },
      update: {
        path: (id) => `/leadership/${id}`,
        method: "PUT",
        bodyType: "formData",
      },
      remove: { path: (id) => `/leadership/${id}`, method: "DELETE" },
      toggle: {
        path: (id) => `/leadership/${id}/status`,
        method: "PATCH",
        payloadKey: "status",
      },
    },
    listKeys: ["leadership"],
    statusKey: "is_active",
    fields: [
      {
        name: "name",
        label: "Name",
        type: "text",
        required: true,
        maxLength: 100,
      },
      {
        name: "role",
        label: "Role",
        type: "text",
        required: true,
        maxLength: 100,
      },
      { name: "desc", label: "Description", type: "textarea", required: true },
      { name: "linkedin", label: "LinkedIn", type: "url" },
      { name: "mail", label: "Email", type: "email" },
      { name: "img", label: "Image", type: "file", accept: "image/*" },
    ],
    tableColumns: [
      { key: "name", label: "Name" },
      { key: "role", label: "Role" },
      { key: "mail", label: "Email" },
      { key: "img", label: "Image", type: "image" },
      { key: "is_active", label: "Status", type: "boolean" },
    ],
  },
  // {
  //   key: "contacts",
  //   label: "Contacts",
  //   route: "/admin/contacts",
  //   api: {
  //     list: { path: "/contacts" },
  //     create: { path: "/contacts", method: "POST", bodyType: "json" },
  //     update: { path: (id) => `/contacts/${id}`, method: "PUT", bodyType: "json" },
  //     remove: { path: (id) => `/contacts/${id}`, method: "DELETE" },
  //   },
  //   listKeys: ["contacts"],
  //   fields: [
  //     { name: "location", label: "Location", type: "text", required: true },
  //     { name: "anotherLocation", label: "Another Location", type: "text" },
  //     { name: "phone", label: "Phone", type: "text", required: true },
  //     { name: "email", label: "Email", type: "email", required: true },
  //   ],
  //   tableColumns: [
  //     { key: "location", label: "Location" },
  //     { key: "anotherLocation", label: "Another" },
  //     { key: "phone", label: "Phone" },
  //     { key: "email", label: "Email" },
  //   ],
  // },
  {
    key: "industries",
    label: "Industries",
    route: "/admin/industries",
    api: {
      list: { path: "/industries" },
      create: { path: "/industries", method: "POST", bodyType: "formData" },
      update: {
        path: (id) => `/industries/${id}`,
        method: "PUT",
        bodyType: "formData",
      },
      remove: { path: (id) => `/industries/${id}`, method: "DELETE" },
      toggle: {
        path: (id) => `/industries/${id}/status`,
        method: "PATCH",
        payloadKey: "isActive",
      },
    },
    listKeys: ["industries"],
    statusKey: "isActive",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
      {
        name: "image",
        label: "Image",
        type: "file",
        required: true,
        accept: "image/*",
      },
    ],
    tableColumns: [
      { key: "title", label: "Title" },
      { key: "description", label: "Description" },
      { key: "image", label: "Image", type: "image" },
      { key: "isActive", label: "Status", type: "boolean" },
    ],
  },
  {
    key: "manufacturing-process",
    label: "Manufacturing Process",
    route: "/admin/manufacturing-process",
    api: {
      list: { path: "/manufacturing-process" },
      create: {
        path: "/manufacturing-process/items",
        method: "POST",
        bodyType: "formData",
      },
      update: {
        path: (id) => `/manufacturing-process/items/${id}`,
        method: "PUT",
        bodyType: "formData",
      },
      remove: {
        path: (id) => `/manufacturing-process/items/${id}`,
        method: "DELETE",
      },
      toggle: {
        path: (id) => `/manufacturing-process/items/${id}/status`,
        method: "PATCH",
        payloadKey: "isActive",
      },
    },
    listKeys: ["processItems"],
    statusKey: "isActive",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
      {
        name: "image",
        label: "Image",
        type: "file",
        required: true,
        accept: "image/*",
      },
    ],
    tableColumns: [
      { key: "title", label: "Title" },
      { key: "description", label: "Description" },
      { key: "image", label: "Image", type: "image" },
      { key: "isActive", label: "Status", type: "boolean" },
    ],
  },
  // {
  //   key: "enquiries",
  //   label: "Enquiries",
  //   route: "/admin/enquiries",
  //   api: {
  //     list: { path: "/enquiries" },
  //     create: { path: "/enquiries", method: "POST", bodyType: "json" },
  //     update: { path: (id) => `/enquiries/${id}`, method: "PUT", bodyType: "json" },
  //     remove: { path: (id) => `/enquiries/${id}`, method: "DELETE" },
  //   },
  //   listKeys: ["enquiries"],
  //   fields: [
  //     { name: "name", label: "Name", type: "text", required: true },
  //     { name: "city", label: "City", type: "text" },
  //     { name: "pin_code", label: "Pin Code", type: "text" },
  //     { name: "mobile", label: "Mobile", type: "text" },
  //     { name: "product_type", label: "Product Type", type: "text" },
  //     { name: "message", label: "Message", type: "textarea" },
  //   ],
  //   tableColumns: [
  //     { key: "name", label: "Name" },
  //     { key: "city", label: "City" },
  //     { key: "mobile", label: "Mobile" },
  //     { key: "product_type", label: "Product" },
  //     { key: "message", label: "Message" },
  //   ],
  // },
  {
    key: "get-in-touch",
    label: "Get In Touch",
    route: "/admin/get-in-touch",
    api: {
      list: { path: "/get-in-touch" },
      create: { path: "/get-in-touch", method: "POST", bodyType: "formData" },
      update: {
        path: (id) => `/get-in-touch/${id}`,
        method: "PUT",
        bodyType: "formData",
      },
      remove: { path: (id) => `/get-in-touch/${id}`, method: "DELETE" },
      toggle: {
        path: (id) => `/get-in-touch/${id}/status`,
        method: "PATCH",
        payloadKey: "status",
      },
    },
    listKeys: ["getInTouch", "getInTouches", "get_in_touch", "entries"],
    statusKey: "status",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "location", label: "Location", type: "text", required: true },
      { name: "image_path", label: "Image", type: "file", accept: "image/*" },
    ],
    tableColumns: [
      { key: "title", label: "Title" },
      { key: "location", label: "Location" },
      { key: "image_path", label: "Image", type: "image" },
      { key: "status", label: "Status", type: "boolean" },
    ],
  },
  {
    key: "banners",
    label: "Banners",
    route: "/admin/banners",
    api: {
      list: { path: "/allBanners?all=true" },
      create: { path: "/createBanner", method: "POST", bodyType: "formData" },
      update: {
        path: (id) => `/updateBanner/${id}`,
        method: "PUT",
        bodyType: "formData",
      },
      remove: { path: (id) => `/deleteBanner/${id}`, method: "DELETE" },
      toggle: {
        path: (id) => `/bannerStatus/${id}`,
        method: "PUT",
        payloadKey: "isActive",
      },
    },
    listKeys: ["banners"],
    statusKey: "isActive",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
      {
        name: "image",
        label: "Image",
        type: "file",
        required: true,
        accept: "image/*",
      },
    ],
    tableColumns: [
      { key: "title", label: "Title" },
      { key: "description", label: "Description" },
      { key: "image", label: "Image", type: "image" },
      { key: "isActive", label: "Status", type: "boolean" },
    ],
  },
];

export const adminResourceMap = new Map(
  adminResources.map((resource) => [resource.key, resource]),
);
