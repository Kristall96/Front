import { useEffect, useState } from "react";
import secureAxios from "../../../../utils/secureAxios";

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
    variants: [], // { variantCategory, value, previewImage }
  });

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [variantCategories, setVariantCategories] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({ ...form, ...initialData });
    }
    fetchMeta();
  }, []);

  const fetchMeta = async () => {
    try {
      const [brandsRes, catsRes, variantsRes] = await Promise.all([
        secureAxios.get("/admin/brands"),
        secureAxios.get("/admin/categories"),
        secureAxios.get("/admin/variants"),
      ]);
      setBrands(brandsRes.data);
      setCategories(catsRes.data);
      setVariantCategories(variantsRes.data);
    } catch (err) {
      console.error(
        "Failed to load form metadata",
        err.response?.data?.message
      );
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    setUploading(true);
    try {
      const res = await secureAxios.post("/upload/product-images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      const uploaded = res.data.uploaded;
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploaded],
        thumbnail: prev.thumbnail || uploaded[0],
      }));
    } catch (err) {
      console.error("Upload failed", err);
    }
    setUploading(false);
  };

  const handleThumbnailSelect = (url) => {
    setForm({ ...form, thumbnail: url });
  };

  const handleRemoveImage = (url) => {
    const newImages = form.images.filter((img) => img !== url);
    const isThumb = url === form.thumbnail;
    setForm({
      ...form,
      images: newImages,
      thumbnail: isThumb ? newImages[0] || "" : form.thumbnail,
    });
  };

  const handleVariantChange = (index, key, value) => {
    const updated = [...form.variants];
    updated[index][key] = value;
    setForm({ ...form, variants: updated });
  };

  const addVariant = () => {
    setForm({
      ...form,
      variants: [
        ...form.variants,
        { variantCategory: "", value: "", previewImage: "" },
      ],
    });
  };

  const removeVariant = (index) => {
    const updated = [...form.variants];
    updated.splice(index, 1);
    setForm({ ...form, variants: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-gray-50 p-4 rounded border"
    >
      {/* TITLE */}
      <input
        className="input input-bordered w-full"
        placeholder="Product Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />

      {/* DESCRIPTION */}
      <textarea
        className="textarea textarea-bordered w-full"
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      {/* BRAND + CATEGORY */}
      <div className="grid grid-cols-2 gap-4">
        <select
          value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
          className="select select-bordered"
        >
          <option value="">Select Brand</option>
          {brands.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          value={form.category}
          onChange={(e) => {
            const cat = categories.find((c) => c._id === e.target.value);
            setForm({ ...form, category: e.target.value, subcategory: "" });
            setSubcategories(cat?.subcategories || []);
          }}
          className="select select-bordered"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* SUBCATEGORY */}
      {subcategories.length > 0 && (
        <select
          value={form.subcategory}
          onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
          className="select select-bordered w-full"
        >
          <option value="">Select Subcategory</option>
          {subcategories.map((sub) => (
            <option key={sub.slug} value={sub.name}>
              {sub.name}
            </option>
          ))}
        </select>
      )}

      {/* PRICING + STOCK */}
      <div className="grid grid-cols-3 gap-4">
        <input
          type="number"
          placeholder="Base Price"
          value={form.basePrice}
          onChange={(e) =>
            setForm({ ...form, basePrice: Number(e.target.value) })
          }
          className="input input-bordered"
        />
        <input
          type="number"
          placeholder="Sale Price"
          value={form.salePrice || ""}
          onChange={(e) =>
            setForm({ ...form, salePrice: Number(e.target.value) })
          }
          className="input input-bordered"
        />
        <input
          type="number"
          placeholder="Discount %"
          value={form.discountPercentage}
          onChange={(e) =>
            setForm({ ...form, discountPercentage: Number(e.target.value) })
          }
          className="input input-bordered"
        />
      </div>

      <input
        type="number"
        placeholder="Stock"
        value={form.stock}
        onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
        className="input input-bordered w-full"
      />

      {/* IMAGES + THUMBNAIL */}
      <div>
        <label className="font-semibold">Upload Images</label>
        <input type="file" multiple onChange={handleImageUpload} />
        {uploading && <p className="text-sm text-gray-500">Uploading...</p>}

        <div className="flex gap-2 flex-wrap mt-3">
          {form.images.map((img) => (
            <div key={img} className="relative border rounded">
              <img src={img} className="w-24 h-24 object-cover" />
              <button
                type="button"
                className={`absolute top-1 right-1 text-xs px-2 py-1 ${
                  form.thumbnail === img
                    ? "bg-green-600 text-white"
                    : "bg-gray-300"
                }`}
                onClick={() => handleThumbnailSelect(img)}
              >
                {form.thumbnail === img ? "✓ Thumbnail" : "Set"}
              </button>
              <button
                type="button"
                onClick={() => handleRemoveImage(img)}
                className="absolute bottom-1 right-1 text-xs bg-red-500 text-white px-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* VARIANTS */}
      <div>
        <label className="font-semibold">Variants</label>
        {form.variants.map((v, i) => (
          <div key={i} className="flex gap-2 items-center my-2">
            <select
              value={v.variantCategory}
              onChange={(e) =>
                handleVariantChange(i, "variantCategory", e.target.value)
              }
              className="select select-sm"
            >
              <option value="">Category</option>
              {variantCategories.map((vc) => (
                <option key={vc._id} value={vc._id}>
                  {vc.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Value (e.g. Red)"
              value={v.value}
              onChange={(e) => handleVariantChange(i, "value", e.target.value)}
              className="input input-sm"
            />
            <button
              type="button"
              onClick={() => removeVariant(i)}
              className="btn btn-sm btn-error text-white"
            >
              ✕
            </button>
          </div>
        ))}
        <button type="button" onClick={addVariant} className="btn btn-sm mt-2">
          + Add Variant
        </button>
      </div>

      {/* TOGGLES */}
      <div className="flex gap-4">
        <label>
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) =>
              setForm({ ...form, isPublished: e.target.checked })
            }
          />
          <span className="ml-2">Published</span>
        </label>
        <label>
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
          />
          <span className="ml-2">Featured</span>
        </label>
      </div>

      <button type="submit" className="btn btn-primary w-full">
        {initialData ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
};

export default ProductForm;
