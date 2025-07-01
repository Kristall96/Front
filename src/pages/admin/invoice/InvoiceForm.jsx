import { useEffect, useState } from "react";
import secureAxios from "../../../utils/secureAxios";

// ... your currency options as before ...
const currencyOptions = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  // ... other currencies ...
];

const defaultLineItem = () => ({
  description: "",
  quantity: 1,
  price: 0,
  taxRate: 0,
});

const InvoiceForm = ({ invoice, onClose, onSaved }) => {
  // --- Form State ---
  const [formData, setFormData] = useState({
    invoiceNumber: invoice?.invoiceNumber || "",
    type: invoice?.type || "",
    clientCompany:
      typeof invoice?.clientCompany === "object"
        ? invoice?.clientCompany?._id || ""
        : invoice?.clientCompany || "",
    supplierCompany:
      typeof invoice?.supplierCompany === "object"
        ? invoice?.supplierCompany?._id || ""
        : invoice?.supplierCompany || "",
    client: invoice?.client || "",
    supplier: invoice?.supplier || "",
    currency: invoice?.currency || "USD",
    dateIssued: invoice?.dateIssued ? invoice.dateIssued.slice(0, 10) : "",
    dueDate: invoice?.dueDate ? invoice.dueDate.slice(0, 10) : "",
    status: invoice?.status || "unpaid",
    imageFile: null,
    category: invoice?.category || "",
    tags: invoice?.tags ? invoice.tags.join(", ") : "",
    notes: invoice?.notes || "",
    items:
      invoice?.items && invoice.items.length > 0
        ? invoice.items.map((item) => ({
            ...item,
            price: item.price || 0,
            quantity: item.quantity || 1,
            taxRate: item.taxRate || 0,
          }))
        : [defaultLineItem()],
  });
  const [editor, setEditor] = useState(null);
  useEffect(() => {
    if (invoice?.lastEditedBy) {
      const editorId =
        typeof invoice.lastEditedBy === "object"
          ? invoice.lastEditedBy._id
          : invoice.lastEditedBy;
      if (editorId) {
        secureAxios
          .get(`/users/${editorId}`)
          .then((res) => setEditor(res.data))
          .catch(() => setEditor(null)); // Already sets to null on error!
      } else {
        setEditor(null);
      }
    } else {
      setEditor(null);
    }
  }, [invoice]);

  // --- Company List State ---
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    // Fetch companies
    secureAxios
      .get("/companies")
      .then((res) =>
        setCompanies(
          Array.isArray(res.data) ? res.data : res.data.companies || []
        )
      )
      .catch(() => setCompanies([]));
  }, []);

  // --- Helpers for Items ---
  const addItem = () =>
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, defaultLineItem()],
    }));

  const removeItem = (idx) =>
    setFormData((prev) => ({
      ...prev,
      items:
        prev.items.length > 1
          ? prev.items.filter((_, i) => i !== idx)
          : prev.items,
    }));

  const updateItem = (idx, field, value) =>
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      ),
    }));

  // --- Input Handlers ---
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleCompanyChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value, // this will be the _id string
      [field === "clientCompany" ? "client" : "supplier"]: "",
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, imageFile: e.target.files[0] }));
  };

  // --- Calculations ---
  const subtotal = formData.items.reduce(
    (sum, item) =>
      sum + parseFloat(item.price || 0) * parseFloat(item.quantity || 1),
    0
  );
  const totalTax = formData.items.reduce(
    (sum, item) =>
      sum +
      parseFloat(item.price || 0) *
        parseFloat(item.quantity || 1) *
        (parseFloat(item.taxRate || 0) / 100),
    0
  );
  const totalAmount = subtotal + totalTax;

  // --- Submit Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert tags (comma-separated string) to array
    const tags = formData.tags
      ? formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    // Prepare the payload
    const payload = {
      invoiceNumber: formData.invoiceNumber,
      type: formData.type,
      clientCompany:
        typeof formData.clientCompany === "object"
          ? formData.clientCompany._id
          : formData.clientCompany || undefined,
      supplierCompany:
        typeof formData.supplierCompany === "object"
          ? formData.supplierCompany._id
          : formData.supplierCompany || undefined,
      client: formData.client,
      supplier: formData.supplier,
      currency: formData.currency,
      dateIssued: formData.dateIssued,
      dueDate: formData.dueDate || undefined,
      status: formData.status,
      category: formData.category,
      tags,
      notes: formData.notes,
      subtotal,
      totalTax,
      totalAmount,
      items: formData.items,
    };

    let dataToSend;
    let headers;

    if (formData.imageFile) {
      dataToSend = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (key === "items" || key === "tags") {
          dataToSend.append(key, JSON.stringify(value));
        } else if (value !== undefined) {
          dataToSend.append(key, value);
        }
      });
      dataToSend.append("file", formData.imageFile);
      headers = undefined; // <--- Change here!
    } else {
      dataToSend = payload;
      headers = undefined;
    }
    try {
      if (invoice?._id) {
        await secureAxios.put(
          `/invoices/${invoice._id}`,
          dataToSend,
          headers ? { headers } : undefined
        );
      } else {
        await secureAxios.post(
          "/invoices",
          dataToSend,
          headers ? { headers } : undefined
        );
      }
      onSaved();
    } catch (err) {
      console.error(
        "Error saving invoice:",
        err?.response?.data || err.message
      );
    }
  };

  // --- Render ---
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#1c1e2b] text-white p-4 md:p-6 rounded-lg shadow-2xl space-y-3 text-sm"
        encType={
          formData.imageFile ? "multipart/form-data" : "application/json"
        }
      >
        {/* Last edited info */}
        {invoice && (
          <div className="text-xs text-gray-400 mb-2">
            Last Edited:{" "}
            {invoice.updatedAt
              ? new Date(invoice.updatedAt).toLocaleString()
              : "—"}
          </div>
        )}
        {editor && (
          <div className="text-xs text-gray-400 mb-2">
            Edited by: {editor?.name || editor?.email || invoice?.lastEditedBy}
          </div>
        )}

        <div>
          <input
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
            placeholder="Invoice Number"
            className="w-full bg-[#252a3a] border border-gray-600 rounded px-3 py-2 mb-2"
            required
          />
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full bg-[#252a3a] border border-gray-600 rounded px-3 py-2"
            required
          >
            <option value="">Select Type</option>
            <option value="income">Income (You will receive money)</option>
            <option value="outcome">Expense (You will pay money)</option>
          </select>
        </div>

        {/* Client/Supplier */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-semibold text-gray-400 mb-1 block">
              Client
            </label>
            <select
              name="clientCompany"
              value={formData.clientCompany || ""}
              onChange={(e) =>
                handleCompanyChange("clientCompany", e.target.value)
              }
              className="w-full bg-[#252a3a] border border-gray-600 rounded px-3 py-2 mb-1"
            >
              <option value="">— Company —</option>
              {companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.name}
                </option>
              ))}
            </select>
            {!formData.clientCompany && (
              <input
                name="client"
                value={formData.client}
                onChange={handleChange}
                placeholder="Or enter client name"
                className="w-full bg-[#252a3a] border border-gray-600 rounded px-3 py-2"
              />
            )}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 mb-1 block">
              Supplier
            </label>
            <select
              name="supplierCompany"
              value={formData.supplierCompany || ""}
              onChange={(e) =>
                handleCompanyChange("supplierCompany", e.target.value)
              }
              className="w-full bg-[#252a3a] border border-gray-600 rounded px-3 py-2 mb-1"
            >
              <option value="">— Company —</option>
              {companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.name}
                </option>
              ))}
            </select>
            {!formData.supplierCompany && (
              <input
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                placeholder="Or enter supplier name"
                className="w-full bg-[#252a3a] border border-gray-600 rounded px-3 py-2"
              />
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-semibold text-gray-400 mb-1 block">
              Date Issued
            </label>
            <input
              name="dateIssued"
              type="date"
              value={formData.dateIssued}
              onChange={handleChange}
              className="w-full bg-[#252a3a] border border-gray-600 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 mb-1 block">
              Due Date
            </label>
            <input
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full bg-[#252a3a] border border-gray-600 rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Category/Tags */}
        <div className="grid grid-cols-2 gap-2">
          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            className="w-full bg-[#252a3a] border border-gray-600 rounded px-3 py-2"
          />
          <input
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Tags"
            className="w-full bg-[#252a3a] border border-gray-600 rounded px-3 py-2"
          />
        </div>

        {/* Currency/Status */}
        <div className="grid grid-cols-2 gap-2">
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full bg-[#252a3a] border border-gray-600 rounded px-3 py-2 text-white"
            required
          >
            {currencyOptions.map(({ code, name }) => (
              <option key={code} value={code}>
                {code} — {name}
              </option>
            ))}
          </select>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full bg-[#252a3a] border border-gray-600 rounded px-3 py-2"
          >
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Products/Services */}
        <div>
          <label className="text-xs font-semibold text-gray-400 mb-1 block">
            Products or Services
          </label>
          {formData.items.map((item, idx) => (
            <div key={idx} className="flex gap-1 mb-2">
              <input
                type="text"
                placeholder="Product/Service"
                value={item.description}
                onChange={(e) => updateItem(idx, "description", e.target.value)}
                className="bg-[#252a3a] border border-gray-600 rounded px-2 py-1 w-2/5"
                required
              />
              <input
                type="number"
                placeholder="Qty"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  updateItem(idx, "quantity", parseFloat(e.target.value))
                }
                className="bg-[#252a3a] border border-gray-600 rounded px-2 py-1 w-1/6"
                required
              />
              <input
                type="number"
                placeholder="Unit Price"
                min={0}
                step="0.01"
                value={item.price}
                onChange={(e) =>
                  updateItem(idx, "price", parseFloat(e.target.value))
                }
                className="bg-[#252a3a] border border-gray-600 rounded px-2 py-1 w-1/5"
                required
              />
              <input
                type="number"
                placeholder="Tax %"
                min={0}
                step="0.01"
                value={item.taxRate}
                onChange={(e) =>
                  updateItem(idx, "taxRate", parseFloat(e.target.value))
                }
                className="bg-[#252a3a] border border-gray-600 rounded px-2 py-1 w-1/6"
              />
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="text-red-400 hover:text-red-600 ml-1"
                title="Remove"
                disabled={formData.items.length === 1}
              >
                ✖
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="w-full py-1 bg-blue-700 hover:bg-blue-800 rounded text-xs"
          >
            + Add Product/Service
          </button>
        </div>

        {/* Totals */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-400">Subtotal</label>
            <input
              type="number"
              value={subtotal.toFixed(2)}
              readOnly
              className="w-full bg-[#252a3a] border border-gray-600 rounded px-2 py-1 opacity-70"
              tabIndex={-1}
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Total Tax</label>
            <input
              type="number"
              value={totalTax.toFixed(2)}
              readOnly
              className="w-full bg-[#252a3a] border border-gray-600 rounded px-2 py-1 opacity-70"
              tabIndex={-1}
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-gray-400">Total Amount</label>
            <input
              type="number"
              value={totalAmount.toFixed(2)}
              readOnly
              className="w-full bg-[#252a3a] border border-gray-600 rounded px-2 py-1 opacity-70"
              tabIndex={-1}
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs font-semibold text-gray-400 mb-1 block">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any notes or comments"
            className="w-full bg-[#252a3a] border border-gray-600 rounded px-3 py-2 min-h-[48px]"
          />
        </div>

        {/* Invoice Image */}
        <div>
          <label className="text-xs font-semibold text-gray-400 mb-1 block">
            Invoice Image
          </label>
          <div className="flex items-center gap-2">
            <label
              htmlFor="invoiceImage"
              className="cursor-pointer px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
            >
              {formData.imageFile ? "Change Image" : "Upload Image"}
            </label>
            <input
              id="invoiceImage"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="text-xs text-gray-400 truncate max-w-xs">
              {formData.imageFile?.name ||
                (invoice?.imageUrl && "Existing image")}
            </span>
          </div>
          {(formData.imageFile || invoice?.imageUrl) && (
            <img
              src={
                formData.imageFile
                  ? URL.createObjectURL(formData.imageFile)
                  : invoice.imageUrl
              }
              alt="Invoice preview"
              className="mt-2 max-h-24 border border-gray-600 rounded"
            />
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-500 text-gray-300 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
