// ✅ CLEAN + USER-FRIENDLY PRODUCT FORM
import { useEffect, useState } from "react";
import secureAxios from "../../../../utils/secureAxios";

const Label = ({ children }) => (
  <label className="block text-sm font-medium text-gray-700 mb-1">
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

  useEffect(() => {
    if (initialData) setForm((prev) => ({ ...prev, ...initialData }));
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
      console.error("Form metadata error", err);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    setUploading(true);
    try {
      const res = await secureAxios.post("/upload/product-images", formData);
      const uploaded = res.data.uploaded;
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploaded],
        thumbnail: prev.thumbnail || uploaded[0],
      }));
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md space-y-6"
    >
      <h2 className="text-xl font-semibold text-gray-800">
        📝 Product Details
      </h2>

      {/* Title & Description */}
      <div>
        <Label>Title *</Label>
        <input
          required
          type="text"
          className="input input-bordered w-full"
          value={form.title}
          placeholder="E.g. Classic White T-Shirt"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </div>
      <div>
        <Label>Description</Label>
        <textarea
          rows="4"
          className="textarea textarea-bordered w-full"
          value={form.description}
          placeholder="Full product description..."
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      {/* Brand / Category */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Brand *</Label>
          <select
            className="select select-bordered w-full"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
          >
            <option value="">Select Brand</option>
            {brands.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Category *</Label>
          <select
            className="select select-bordered w-full"
            value={form.category}
            onChange={(e) => {
              const cat = categories.find((c) => c._id === e.target.value);
              setForm({ ...form, category: e.target.value, subcategory: "" });
              setSubcategories(cat?.subcategories || []);
            }}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {subcategories.length > 0 && (
        <div>
          <Label>Subcategory</Label>
          <select
            className="select select-bordered w-full"
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

      {/* Price / Stock */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <Label>Base Price *</Label>
          <input
            type="number"
            className="input input-bordered w-full"
            value={form.basePrice}
            onChange={(e) => setForm({ ...form, basePrice: +e.target.value })}
          />
        </div>
        <div>
          <Label>Sale Price</Label>
          <input
            type="number"
            className="input input-bordered w-full"
            value={form.salePrice || ""}
            onChange={(e) => setForm({ ...form, salePrice: +e.target.value })}
          />
        </div>
        <div>
          <Label>Discount (%)</Label>
          <input
            type="number"
            className="input input-bordered w-full"
            value={form.discountPercentage}
            onChange={(e) =>
              setForm({ ...form, discountPercentage: +e.target.value })
            }
          />
        </div>
        <div>
          <Label>Stock *</Label>
          <input
            type="number"
            className="input input-bordered w-full"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: +e.target.value })}
          />
        </div>
      </div>

      {/* Images */}
      <div>
        <Label>Images</Label>
        <input type="file" multiple onChange={handleImageUpload} />
        {uploading && (
          <p className="text-sm text-gray-500 mt-1">Uploading...</p>
        )}
        <div className="flex gap-2 flex-wrap mt-2">
          {form.images.map((img) => (
            <div key={img} className="relative border rounded shadow-sm">
              <img src={img} className="w-24 h-24 object-cover" />
              <button
                type="button"
                className={`absolute top-1 right-1 text-xs px-2 py-1 rounded-full ${
                  form.thumbnail === img
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 text-black"
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
          <div key={i} className="flex gap-2 mb-2 items-center">
            <select
              className="select select-sm"
              value={v.variantCategory}
              onChange={(e) => {
                const updated = [...form.variants];
                updated[i].variantCategory = e.target.value;
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
            <input
              type="text"
              placeholder="Value (e.g. Red, XL)"
              className="input input-sm"
              value={v.value}
              onChange={(e) => {
                const updated = [...form.variants];
                updated[i].value = e.target.value;
                setForm({ ...form, variants: updated });
              }}
            />
            <button
              type="button"
              className="btn btn-sm btn-error"
              onClick={() => {
                const updated = [...form.variants];
                updated.splice(i, 1);
                setForm({ ...form, variants: updated });
              }}
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
          className="btn btn-sm mt-2"
        >
          + Add Variant
        </button>
      </div>

      {/* Toggles */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) =>
              setForm({ ...form, isPublished: e.target.checked })
            }
          />
          <span>Published</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
          />
          <span>Featured</span>
        </label>
      </div>

      <button type="submit" className="btn btn-primary w-full mt-6">
        {initialData ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
};

export default ProductForm;
