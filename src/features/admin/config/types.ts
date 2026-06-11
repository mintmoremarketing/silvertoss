import type { RequestBodyType } from "@/features/admin/api/http";

export type FieldType = "text" | "textarea" | "number" | "file" | "email" | "url" | "select";

export type AdminFieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  accept?: string;
  maxLength?: number;
  optionsFrom?: string;
  optionLabelKey?: string;
};

export type TableColumn = {
  key: string;
  label: string;
  type?: "text" | "image" | "boolean";
};

export type AdminResourceConfig = {
  key: string;
  label: string;
  route: string;
  api: {
    list: { path: string; method?: "GET" | "POST" };
    create: { path: string; method: "POST" | "PUT"; bodyType: RequestBodyType };
    update: { path: (id: string) => string; method: "PUT" | "PATCH"; bodyType: RequestBodyType };
    remove: { path: (id: string) => string; method: "DELETE" };
    toggle?: {
      path: (id: string) => string;
      method: "PUT" | "PATCH";
      payloadKey: string;
    };
  };
  listKeys: string[];
  idKey?: string;
  statusKey?: string;
  fields: AdminFieldConfig[];
  tableColumns: TableColumn[];
  normalizeSubmit?: (values: Record<string, string>) => Record<string, string>;
};
