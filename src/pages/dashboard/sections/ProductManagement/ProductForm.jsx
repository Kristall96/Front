import { useEffect, useState } from "react";
import secureAxios from "../../../../utils/secureAxios";

// Reusable label
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

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [variantCategories, setVariantCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({ ...prev, ...initialData }));
      const selectedCategory =
        initialData.category?._id || initialData.category;
      const found = categories.find((c) => c._id === selectedCategory);
      if (found) setSubcategories(found.subcategories || []);
    }
    fetchMeta();
  }, []);

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
      setError("Image upload failed. Please check your files and try again.");
    } finally {
      setUploading(false);
    }
  };

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
      console.error("Submit error", err);
      if (err.response?.data?.errors) {
        setFormErrors(err.response.data.errors);
      } else {
        setError(err.response?.data?.message || "Failed to submit product.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 p-6 rounded-xl space-y-8 text-white"
    >
      <h2 className="text-2xl font-semibold text-white border-b border-gray-700 pb-2">
        🧾 Product Details
      </h2>

      {error && (
        <div className="bg-red-500/10 text-red-400 border border-red-500 rounded p-3">
          ⚠️ {error}
        </div>
      )}

      {/* Title */}
      <div>
        <Label>Title *</Label>
        <input
          type="text"
          className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-600"
          placeholder="E.g. Classic White T-Shirt"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        {formErrors.title && <p className="text-red-400">{formErrors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <Label>Description</Label>
        <textarea
          className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-600 resize-none"
          rows={4}
          placeholder="Full product description..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        {formErrors.description && (
          <p className="text-red-400">{formErrors.description}</p>
        )}
      </div>

      {/* Brand & Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Brand *</Label>
          <select
            className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2"
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
            <p className="text-red-400">{formErrors.brand}</p>
          )}
        </div>

        <div>
          <Label>Category *</Label>
          <select
            className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2"
            value={form.category?._id || form.category || ""}
            onChange={(e) => {
              const selected = categories.find((c) => c._id === e.target.value);
              setForm({ ...form, category: selected, subcategory: "" });
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
            <p className="text-red-400">{formErrors.category}</p>
          )}
        </div>
      </div>

      {/* Subcategory */}
      {subcategories.length > 0 && (
        <div>
          <Label>Subcategory</Label>
          <select
            className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2"
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {["basePrice", "salePrice", "discountPercentage", "stock"].map(
          (key) => (
            <div key={key}>
              <Label>{key}</Label>
              <input
                type="number"
                value={form[key] ?? ""}
                className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2"
                onChange={(e) =>
                  setForm({ ...form, [key]: +e.target.value || 0 })
                }
              />
              {formErrors[key] && (
                <p className="text-red-400">{formErrors[key]}</p>
              )}
            </div>
          )
        )}
      </div>

      {/* Images */}
      <div>
        <Label>Upload Images</Label>
        <input
          type="file"
          multiple
          className="bg-gray-900 text-white"
          onChange={handleImageUpload}
        />
        {uploading && <p className="text-sm text-blue-300">Uploading...</p>}
        {formErrors.images && (
          <p className="text-red-400">{formErrors.images}</p>
        )}

        {/* Image Preview */}
        <div className="flex flex-wrap gap-4 mt-4">
          {form.images.map((img) => (
            <div key={img} className="relative w-24 h-24 border rounded-md">
              <img
                src={img}
                alt="preview"
                className="w-full h-full object-cover rounded"
              />
              <button
                type="button"
                onClick={() => setForm({ ...form, thumbnail: img })}
                className={`absolute bottom-1 left-1 text-xs px-1 py-0.5 rounded ${
                  form.thumbnail === img
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 text-gray-200"
                }`}
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
                className="absolute top-0 right-0 text-xs px-1 py-0.5 bg-red-600 text-white rounded"
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
        <div className="space-y-4">
          {form.variants.map((v, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-2">
              <select
                className="bg-gray-800 border border-gray-600 rounded px-3 py-2"
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
                <option value="">Variant Category</option>
                {variantCategories.map((vc) => (
                  <option key={vc._id} value={vc._id}>
                    {vc.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Value (e.g. Red)"
                className="bg-gray-800 border border-gray-600 rounded px-3 py-2 w-full"
                value={v.value}
                onChange={(e) => {
                  const updated = [...form.variants];
                  updated[i].value = e.target.value;
                  setForm({ ...form, variants: updated });
                }}
              />

              <button
                type="button"
                onClick={() => {
                  const updated = [...form.variants];
                  updated.splice(i, 1);
                  setForm({ ...form, variants: updated });
                }}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            setForm({
              ...form,
              variants: [...form.variants, { variantCategory: "", value: "" }],
            })
          }
          className="mt-2 text-blue-400 hover:underline"
        >
          + Add Variant
        </button>
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) =>
              setForm({ ...form, isPublished: e.target.checked })
            }
          />
          Published
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
          />
          Featured
        </label>
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md"
      >
        {initialData ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
};

export default ProductForm;
