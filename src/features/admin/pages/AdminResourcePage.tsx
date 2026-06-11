import { FormEvent, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { apiRequest, extractArrayFromPayload, extractErrorMessage, getFileUrl, readResponseBody } from "@/features/admin/api/http";
import { adminResources } from "@/features/admin/config/resources";
import type { AdminFieldConfig } from "@/features/admin/config/types";

type RecordItem = Record<string, unknown>;
type LookupState = Record<string, RecordItem[]>;

const getRecordId = (record: RecordItem) => {
  const id = record._id ?? record.id;
  return typeof id === "string" ? id : "";
};

const getResourceByRoute = (pathname: string) => adminResources.find((resource) => pathname.endsWith(resource.route));
const imageKeys = ["image", "image_path", "img", "client_logo", "image_1", "image_2"];

const getImageSrc = (row: RecordItem, key: string) => {
  const direct = row[key];
  if (typeof direct === "string" && direct.trim()) return direct;
  const first = imageKeys.find((candidate) => typeof row[candidate] === "string" && String(row[candidate]).trim());
  return first ? String(row[first]) : "";
};

const getStatusValue = (row: RecordItem, statusKey?: string) => (statusKey ? Boolean(row[statusKey]) : false);

const validateField = (field: AdminFieldConfig, value: string, isEdit: boolean, file?: File | null) => {
  if (!field.required) return "";
  if (field.type === "file") return !isEdit && !file ? `${field.label} is required.` : "";
  if (!value.trim()) return `${field.label} is required.`;
  if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return "Please enter a valid email address.";
  if (field.type === "url" && value.trim()) {
    try {
      new URL(value.trim());
    } catch {
      return "Please enter a valid URL.";
    }
  }
  return "";
};

export function AdminResourcePage() {
  const location = useLocation();
  const resource = useMemo(() => getResourceByRoute(location.pathname), [location.pathname]);

  const [rows, setRows] = useState<RecordItem[]>([]);
  const [lookupMap, setLookupMap] = useState<LookupState>({});
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [formFiles, setFormFiles] = useState<Record<string, File | null>>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetCounter, setResetCounter] = useState(0);

  useEffect(() => {
    if (!resource) return;
    const initialValues: Record<string, string> = {};
    const initialFiles: Record<string, File | null> = {};
    for (const field of resource.fields) {
      initialValues[field.name] = "";
      if (field.type === "file") initialFiles[field.name] = null;
    }
    setFormValues(initialValues);
    setFormFiles(initialFiles);
    setEditId(null);
  }, [resource]);

  const loadRows = async () => {
    if (!resource) return;
    setLoading(true);
    try {
      const response = await apiRequest(resource.api.list.path, { method: resource.api.list.method || "GET" });
      if (!response.ok) {
        setMessage(await extractErrorMessage(response, `Failed to load ${resource.label}.`));
        return;
      }
      const payload = await readResponseBody(response);
      setRows(extractArrayFromPayload(payload, resource.listKeys));
    } catch {
      setMessage(`Error loading ${resource.label}.`);
    } finally {
      setLoading(false);
    }
  };

  const loadLookups = async () => {
    if (!resource) return;
    const lookupFields = resource.fields.filter((field) => field.optionsFrom);
    if (!lookupFields.length) {
      setLookupMap({});
      return;
    }
    const nextMap: LookupState = {};
    for (const field of lookupFields) {
      const lookupResource = adminResources.find((item) => item.key === field.optionsFrom);
      if (!lookupResource) continue;
      try {
        const response = await apiRequest(lookupResource.api.list.path, { method: lookupResource.api.list.method || "GET" });
        if (!response.ok) continue;
        const payload = await readResponseBody(response);
        nextMap[field.optionsFrom as string] = extractArrayFromPayload(payload, lookupResource.listKeys);
      } catch {
        // noop
      }
    }
    setLookupMap(nextMap);
  };

  useEffect(() => {
    void loadRows();
    void loadLookups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource?.key]);

  if (!resource) {
    return <section className="admin-table"><h2>Module not found</h2></section>;
  }

  const resetForm = () => {
    const nextValues: Record<string, string> = {};
    const nextFiles: Record<string, File | null> = {};
    for (const field of resource.fields) {
      nextValues[field.name] = "";
      if (field.type === "file") nextFiles[field.name] = null;
    }
    setFormValues(nextValues);
    setFormFiles(nextFiles);
    setEditId(null);
    setResetCounter((prev) => prev + 1);
  };

  const buildPayload = () => {
    const values = resource.normalizeSubmit ? resource.normalizeSubmit(formValues) : formValues;
    if (resource.api.create.bodyType === "formData") {
      const formData = new FormData();
      resource.fields.forEach((field) => {
        const value = values[field.name];
        if (field.type === "file") {
          const file = formFiles[field.name];
          if (file) formData.append(field.name, file);
          return;
        }
        if (value !== undefined && value !== null && `${value}`.trim() !== "") formData.append(field.name, value);
      });
      return { bodyType: "formData" as const, body: formData };
    }
    const jsonPayload: Record<string, string> = {};
    resource.fields.forEach((field) => {
      if (field.type !== "file") jsonPayload[field.name] = values[field.name] ?? "";
    });
    return { bodyType: "json" as const, body: jsonPayload };
  };

  const validateForm = () => {
    const isEdit = Boolean(editId);
    for (const field of resource.fields) {
      const error = validateField(field, formValues[field.name] || "", isEdit, formFiles[field.name]);
      if (error) {
        setMessage(error);
        return false;
      }
    }
    if (resource.key === "enquiries" && formValues.pin_code && !/^\d{6}$/.test(formValues.pin_code)) {
      setMessage("Pin code must be 6 digits.");
      return false;
    }
    if (resource.key === "enquiries" && formValues.mobile && !/^[6-9]\d{9}$/.test(formValues.mobile)) {
      setMessage("Mobile must be a valid 10 digit Indian mobile number.");
      return false;
    }
    return true;
  };

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setMessage(editId ? `Updating ${resource.label}...` : `Creating ${resource.label}...`);
    try {
      const payload = buildPayload();
      const request = editId
        ? await apiRequest(resource.api.update.path(editId), { method: resource.api.update.method, bodyType: payload.bodyType, body: payload.body })
        : await apiRequest(resource.api.create.path, { method: resource.api.create.method, bodyType: payload.bodyType, body: payload.body });
      if (!request.ok) {
        setMessage(await extractErrorMessage(request, `Failed to save ${resource.label}.`));
        return;
      }
      setMessage(editId ? "Updated successfully." : "Created successfully.");
      resetForm();
      await loadRows();
    } catch {
      setMessage(`Error saving ${resource.label}.`);
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (row: RecordItem) => {
    const id = getRecordId(row);
    if (!id) return;
    const nextValues: Record<string, string> = {};
    resource.fields.forEach((field) => {
      if (field.type === "file") return;
      const raw = row[field.name];
      if (typeof raw === "object" && raw !== null) {
        const nestedId = (raw as Record<string, unknown>)._id;
        nextValues[field.name] = typeof nestedId === "string" ? nestedId : "";
      } else {
        nextValues[field.name] = raw === undefined || raw === null ? "" : String(raw);
      }
    });
    setEditId(id);
    setFormValues((prev) => ({ ...prev, ...nextValues }));
  };

  const onDelete = async (row: RecordItem) => {
    const id = getRecordId(row);
    if (!id) return;
    setLoading(true);
    setMessage("Deleting item...");
    try {
      const response = await apiRequest(resource.api.remove.path(id), { method: resource.api.remove.method });
      if (!response.ok) {
        setMessage(await extractErrorMessage(response, "Delete failed."));
        return;
      }
      setMessage("Deleted successfully.");
      if (editId === id) resetForm();
      await loadRows();
    } catch {
      setMessage("Delete failed.");
    } finally {
      setLoading(false);
    }
  };

  const onToggleStatus = async (row: RecordItem) => {
    if (!resource.api.toggle || !resource.statusKey) return;
    const id = getRecordId(row);
    if (!id) return;
    const current = getStatusValue(row, resource.statusKey);
    setLoading(true);
    setMessage("Updating status...");
    try {
      const response = await apiRequest(resource.api.toggle.path(id), {
        method: resource.api.toggle.method,
        bodyType: "json",
        body: { [resource.api.toggle.payloadKey]: !current },
      });
      if (!response.ok) {
        setMessage(await extractErrorMessage(response, "Failed to update status."));
        return;
      }
      setMessage("Status updated.");
      await loadRows();
    } catch {
      setMessage("Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  const getLookupLabel = (fieldName: string, value: unknown) => {
    const field = resource.fields.find((item) => item.name === fieldName);
    if (!field?.optionsFrom) return String(value ?? "-");
    const options = lookupMap[field.optionsFrom] || [];
    const valueId = typeof value === "object" && value !== null ? (value as Record<string, unknown>)._id : value;
    const match = options.find((option) => {
      const id = option._id ?? option.id;
      return typeof id === "string" && id === valueId;
    });
    if (!match) return String(valueId ?? "-");
    const labelKey = field.optionLabelKey || "name";
    const label = match[labelKey];
    return typeof label === "string" ? label : String(valueId ?? "-");
  };

  return (
    <div className="admin-table">
      <h2>{resource.label}</h2>
      <p>Manage records with create, edit, delete and status controls.</p>

      <form className="admin-form-grid" onSubmit={submitForm}>
        {resource.fields.map((field) => {
          const value = formValues[field.name] || "";

          if (field.type === "textarea") {
            return (
              <label key={field.name} className="admin-field full">
                <span>{field.label}</span>
                <textarea
                  value={value}
                  onChange={(event) =>
                    setFormValues((prev) => ({ ...prev, [field.name]: field.maxLength ? event.target.value.slice(0, field.maxLength) : event.target.value }))
                  }
                  placeholder={field.placeholder || field.label}
                />
              </label>
            );
          }

          if (field.type === "file") {
            return (
              <label key={field.name} className="admin-field">
                <span>{field.label}</span>
                <input
                  key={`${field.name}-${resetCounter}`}
                  accept={field.accept}
                  onChange={(event) => setFormFiles((prev) => ({ ...prev, [field.name]: event.target.files?.[0] || null }))}
                  type="file"
                />
              </label>
            );
          }

          if (field.type === "select") {
            const options = field.optionsFrom ? lookupMap[field.optionsFrom] || [] : [];
            const labelKey = field.optionLabelKey || "name";
            return (
              <label key={field.name} className="admin-field">
                <span>{field.label}</span>
                <select value={value} onChange={(event) => setFormValues((prev) => ({ ...prev, [field.name]: event.target.value }))}>
                  <option value="">Select {field.label}</option>
                  {options.map((option) => {
                    const id = option._id ?? option.id;
                    if (typeof id !== "string") return null;
                    const label = option[labelKey];
                    return (
                      <option key={id} value={id}>
                        {typeof label === "string" ? label : id}
                      </option>
                    );
                  })}
                </select>
              </label>
            );
          }

          return (
            <label key={field.name} className="admin-field">
              <span>{field.label}</span>
              <input
                maxLength={field.maxLength}
                placeholder={field.placeholder || field.label}
                type={field.type === "number" ? "number" : field.type === "email" ? "email" : field.type === "url" ? "url" : "text"}
                value={value}
                onChange={(event) =>
                  setFormValues((prev) => ({ ...prev, [field.name]: field.maxLength ? event.target.value.slice(0, field.maxLength) : event.target.value }))
                }
              />
            </label>
          );
        })}

        <div className="admin-form-actions">
          <button className="quote-btn" disabled={loading} type="submit">{editId ? "Update" : "Create"}</button>
          {editId ? (
            <button className="quote-btn secondary" onClick={resetForm} type="button">Cancel Edit</button>
          ) : null}
        </div>
      </form>

      {message ? <p className="admin-login-message">{message}</p> : null}

      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              {resource.tableColumns.map((column) => <th key={column.key}>{column.label}</th>)}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={resource.tableColumns.length + 1}>{loading ? "Loading..." : "No records found."}</td></tr>
            ) : (
              rows.map((row) => {
                const rowId = getRecordId(row) || Math.random().toString(36);
                return (
                  <tr key={rowId}>
                    {resource.tableColumns.map((column) => {
                      const rawValue = row[column.key];
                      if (column.type === "image") {
                        const src = getFileUrl(getImageSrc(row, column.key));
                        return <td key={column.key}>{src ? <img alt={column.label} className="admin-thumb" src={src} /> : "-"}</td>;
                      }
                      if (column.type === "boolean") {
                        return (
                          <td key={column.key}>
                            <span className={`status-badge ${Boolean(rawValue) ? "active" : "inactive"}`}>
                              {Boolean(rawValue) ? "Active" : "Inactive"}
                            </span>
                          </td>
                        );
                      }
                      if (typeof rawValue === "object" && rawValue !== null) return <td key={column.key}>{getLookupLabel(column.key, rawValue)}</td>;
                      if (resource.fields.some((field) => field.name === column.key && field.type === "select")) {
                        return <td key={column.key}>{getLookupLabel(column.key, rawValue)}</td>;
                      }
                      return <td key={column.key}>{rawValue === undefined || rawValue === null || rawValue === "" ? "-" : String(rawValue)}</td>;
                    })}
                    <td>
                      <div className="table-actions">
                        <button className="quote-btn small info" onClick={() => onEdit(row)} type="button">Edit</button>
                        {resource.api.toggle && resource.statusKey ? (
                          <button className="quote-btn small warning" onClick={() => onToggleStatus(row)} type="button">
                            {getStatusValue(row, resource.statusKey) ? "Deactivate" : "Activate"}
                          </button>
                        ) : null}
                        <button className="quote-btn small danger" onClick={() => onDelete(row)} type="button">Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
