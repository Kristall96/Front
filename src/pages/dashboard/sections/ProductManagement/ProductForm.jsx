import { useEffect, useState } from "react";
import secureAxios from "../../../../utils/secureAxios";

// Reusable label component
const Label = ({ children }) => (
  <label className="block text-sm font-medium text-gray-300 mb-1">
    {children}
  </label>
);

const ProductForm = ({ onSubmit, initialData = {} }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    brand: "",
    category: "",
    subcategory: "",
    images: [],
    thumbnail: "",
    basePrice: 0,
    salePrice: null,
    discountPercentage: 0,
    stock: 0,
    isPublished: false,
    isFeatured: false,
    variants: [],
  });

  // Dropdown options
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [variantCategories, setVariantCategories] = useState([]);

  // UI state
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(""); // global fallback error
  const [formErrors, setFormErrors] = useState({}); // field-specific validation errors

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({ ...prev, ...initialData }));
    }
    fetchMeta();
  }, []);

  // Load dropdown metadata
  const fetchMeta = async () => {
    try {
      const [brandsRes, catsRes, variantsRes] = await Promise.all([
        secureAxios.get("/admin/brands"),
        secureAxios.get("/admin/categories"),
        secureAxios.get("/admin/variant-categories"),
      ]);
      setBrands(brandsRes.data);
      setCategories(catsRes.data);
      setVariantCategories(variantsRes.data);
    } catch (err) {
      console.error("Failed to load metadata", err);
      setError("Failed to load brand/category/variant data.");
    }
  };

  // Handle image upload to server
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    setUploading(true);
    setError("");
    setFormErrors({});

    try {
      const res = await secureAxios.post("/upload/product-images", formData);
      const uploaded = res.data.uploaded;

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploaded],
        thumbnail: prev.thumbnail || uploaded[0],
      }));
    } catch (err) {
      console.error("Image upload failed", err);
      setError("Image upload failed. Please check your file(s) and try again.");
    } finally {
      setUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFormErrors({});

    try {
      const cleanedForm = {
        ...form,
        brand: form.brand?._id || form.brand,
        category: form.category?._id || form.category,
        variants: form.variants.map((v) => ({
          variantCategory: v.variantCategory?._id || v.variantCategory,
          value: v.value,
        })),
      };

      await onSubmit(cleanedForm);
    } catch (err) {
      console.error("Product submission failed", err);

      if (err.response?.data?.errors) {
        setFormErrors(err.response.data.errors); // backend field validation
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to submit product. Please try again."
        );
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-700 space-y-8 text-white"
    >
      <h2 className="text-2xl font-semibold text-white border-b border-gray-700 pb-2">
        🧾 Product Details
      </h2>

      {/* Global error message */}
      {error && (
        <div className="bg-red-500/10 text-red-400 border border-red-500 rounded p-3">
          ⚠️ {error}
        </div>
      )}

      {/* Title & Description */}
      <div className="space-y-4">
        <div>
          <Label>Title *</Label>
          <input
            type="text"
            className={`w-full px-3 py-2 rounded-md bg-gray-800 text-white border ${
              formErrors.title ? "border-red-500" : "border-gray-600"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={form.title}
            placeholder="E.g. Classic White T-Shirt"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          {formErrors.title && (
            <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
          )}
        </div>

        <div>
          <Label>Description</Label>
          <textarea
            rows="4"
            className={`w-full px-3 py-2 rounded-md bg-gray-800 text-white border ${
              formErrors.description ? "border-red-500" : "border-gray-600"
            } resize-none`}
            value={form.description}
            placeholder="Full product description..."
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          {formErrors.description && (
            <p className="text-red-500 text-sm mt-1">
              {formErrors.description}
            </p>
          )}
        </div>
      </div>

      {/* Brand & Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Brand *</Label>
          <select
            className={`w-full px-3 py-2 rounded-md bg-gray-800 text-white border ${
              formErrors.brand ? "border-red-500" : "border-gray-600"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={form.brand?._id || form.brand || ""}
            onChange={(e) => {
              const selected = brands.find((b) => b._id === e.target.value);
              setForm({ ...form, brand: selected });
            }}
          >
            <option value="">Select Brand</option>
            {brands.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
          {formErrors.brand && (
            <p className="text-red-500 text-sm mt-1">{formErrors.brand}</p>
          )}
        </div>

        <div>
          <Label>Category *</Label>
          <select
            className={`w-full px-3 py-2 rounded-md bg-gray-800 text-white border ${
              formErrors.category ? "border-red-500" : "border-gray-600"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={form.category?._id || form.category || ""}
            onChange={(e) => {
              const selected = categories.find((c) => c._id === e.target.value);
              setForm({
                ...form,
                category: selected,
                subcategory: "",
              });
              setSubcategories(selected?.subcategories || []);
            }}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          {formErrors.category && (
            <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
          )}
        </div>
      </div>

      {/* Subcategory (optional, no validation) */}
      {subcategories.length > 0 && (
        <div>
          <Label>Subcategory</Label>
          <select
            className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
            value={form.subcategory}
            onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((s) => (
              <option key={s.slug} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {/* Pricing & Stock */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Base Price *", key: "basePrice" },
          { label: "Sale Price", key: "salePrice" },
          { label: "Discount (%)", key: "discountPercentage" },
          { label: "Stock *", key: "stock" },
        ].map(({ label, key }) => (
          <div key={key}>
            <Label>{label}</Label>
            <input
              type="number"
              className={`no-spinner w-full px-3 py-2 rounded-md bg-gray-800 text-white border ${
                formErrors[key] ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={form[key] ?? ""}
              onChange={(e) =>
                setForm({ ...form, [key]: +e.target.value || 0 })
              }
            />
            {formErrors[key] && (
              <p className="text-red-500 text-sm mt-1">{formErrors[key]}</p>
            )}
          </div>
        ))}
      </div>

      {/* Images */}
      <div>
        <Label>Upload Images</Label>
        <div className="relative w-fit">
          <input
            type="file"
            id="fileUpload"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
          <label
            htmlFor="fileUpload"
            className="cursor-pointer px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white inline-block"
          >
            📁 Browse Files
          </label>
          {uploading && (
            <p className="text-sm text-gray-400 mt-1">Uploading...</p>
          )}
          {formErrors.images && (
            <p className="text-red-500 text-sm mt-1">{formErrors.images}</p>
          )}
        </div>

        <div className="flex gap-2 flex-wrap mt-3">
          {form.images.map((img) => (
            <div key={img} className="relative border rounded shadow-sm">
              <img src={img} className="w-24 h-24 object-cover rounded" />
              <button
                type="button"
                className={`absolute top-1 right-1 text-xs px-2 py-1 rounded-full ${
                  form.thumbnail === img
                    ? "bg-green-600 text-white"
                    : "bg-gray-600 text-white"
                }`}
                onClick={() => setForm({ ...form, thumbnail: img })}
              >
                {form.thumbnail === img ? "✓" : "Set"}
              </button>
              <button
                type="button"
                onClick={() => {
                  const filtered = form.images.filter((f) => f !== img);
                  setForm({
                    ...form,
                    images: filtered,
                    thumbnail:
                      form.thumbnail === img
                        ? filtered[0] || ""
                        : form.thumbnail,
                  });
                }}
                className="absolute bottom-1 right-1 text-xs bg-red-500 text-white px-1 rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Variants */}
      <div>
        <Label>Variants</Label>
        {form.variants.map((v, i) => (
          <div
            key={i}
            className="flex gap-3 items-start md:items-end mb-4 flex-wrap md:flex-nowrap"
          >
            <div className="flex-1">
              <Label className="text-xs">Category</Label>
              <select
                className={`w-full px-2 py-1 rounded bg-gray-800 text-white border ${
                  formErrors[`variants.${i}.variantCategory`]
                    ? "border-red-500"
                    : "border-gray-600"
                }`}
                value={v.variantCategory?._id || v.variantCategory || ""}
                onChange={(e) => {
                  const selected = variantCategories.find(
                    (vc) => vc._id === e.target.value
                  );
                  const updated = [...form.variants];
                  updated[i].variantCategory = selected;
                  setForm({ ...form, variants: updated });
                }}
              >
                <option value="">Select Category</option>
                {variantCategories.map((vc) => (
                  <option key={vc._id} value={vc._id}>
                    {vc.name}
                  </option>
                ))}
              </select>
              {formErrors[`variants.${i}.variantCategory`] && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors[`variants.${i}.variantCategory`]}
                </p>
              )}
            </div>

            <div className="flex-1">
              <Label className="text-xs">Value</Label>
              <input
                type="text"
                className={`w-full px-2 py-1 rounded bg-gray-800 text-white border ${
                  formErrors[`variants.${i}.value`]
                    ? "border-red-500"
                    : "border-gray-600"
                }`}
                placeholder="e.g. Red, XL"
                value={v.value}
                onChange={(e) => {
                  const updated = [...form.variants];
                  updated[i].value = e.target.value;
                  setForm({ ...form, variants: updated });
                }}
              />
              {formErrors[`variants.${i}.value`] && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors[`variants.${i}.value`]}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                const updated = [...form.variants];
                updated.splice(i, 1);
                setForm({ ...form, variants: updated });
              }}
              className="h-9 mt-6 px-3 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            setForm({
              ...form,
              variants: [...form.variants, { variantCategory: "", value: "" }],
            })
          }
          className="mt-2 inline-block px-4 py-2 rounded border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition"
        >
          + Add Variant
        </button>
      </div>

      {/* Toggles */}
      <div className="flex gap-6 pt-2">
        <label className="flex items-center gap-2 text-gray-200">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) =>
              setForm({ ...form, isPublished: e.target.checked })
            }
          />
          <span>Published</span>
        </label>
        <label className="flex items-center gap-2 text-gray-200">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
          />
          <span>Featured</span>
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full mt-6 px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
        disabled={uploading}
      >
        {initialData ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
};

export default ProductForm;
