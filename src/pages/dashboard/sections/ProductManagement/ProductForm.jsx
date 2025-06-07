import { useState, useEffect } from "react";
import secureAxios from "../../../../utils/secureAxios";
import { toast } from "react-toastify";

const ProductForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    basePrice: "",
    category: "",
    brand: "",
    images: [],
    thumbnail: "",
    variants: [{ variantCategory: "", value: "" }],
  });

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [variantCategories, setVariantCategories] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [cats, brs, vCats] = await Promise.all([
          secureAxios.get("/admin/categories"),
          secureAxios.get("/admin/brands"),
          secureAxios.get("/admin/variant-categories"),
        ]);
        setCategories(cats.data.categories || []);
        setBrands(brs.data.brands || []);
        setVariantCategories(vCats.data.categories || []);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load form data.");
      }
    };
    fetchMeta();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (files) => {
    if (!files.length) return;

    const uploadedUrls = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("images", file); // ✅ correct field name

        const res = await secureAxios.post("/upload/product-images", formData); // ✅ correct route

        if (res.data?.uploaded?.[0]) {
          uploadedUrls.push(res.data.uploaded[0]);
        } else {
          throw new Error("No URL returned from server.");
        }
      }

      setForm((prev) => {
        const newImages = [...prev.images, ...uploadedUrls];
        return {
          ...prev,
          images: newImages,
          thumbnail: prev.thumbnail || uploadedUrls[0],
        };
      });
    } catch (err) {
      toast.error("Image upload failed.");
      console.error("Upload error:", err.response?.data || err.message);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleImageUpload(Array.from(e.dataTransfer.files));
  };

  const handleFileInputChange = (e) => {
    handleImageUpload(Array.from(e.target.files));
  };

  const handleThumbnailSelect = (url) => {
    setForm((prev) => ({ ...prev, thumbnail: url }));
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...form.variants];
    updated[index][field] = value;
    setForm((prev) => ({ ...prev, variants: updated }));
  };

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { variantCategory: "", value: "" }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const payload = {
        ...form,
        basePrice: Number(form.basePrice),
        variants: form.variants.map((v) => ({
          variantCategory: v.variantCategory,
          value: v.value.trim(),
        })),
      };

      const res = await secureAxios.post("/admin/products", payload);
      toast.success("✅ Product created successfully!");
      onSuccess?.(res.data.product);
    } catch (err) {
      const validation = err.response?.data?.validationErrors;
      if (validation) {
        console.error("Validation Errors:", validation);
        setErrors(validation);
        toast.error("Please fix validation errors.");
      } else {
        toast.error(err.response?.data?.message || "Failed to create product.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-[#1a1f2b] p-6 rounded-xl shadow-xl border border-gray-700 text-white"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Product Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full bg-[#2a3142] border border-gray-600 rounded px-3 py-2"
            placeholder="Product title"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">Base Price</label>
          <input
            type="number"
            name="basePrice"
            value={form.basePrice}
            onChange={handleChange}
            className="w-full bg-[#2a3142] border border-gray-600 rounded px-3 py-2"
            placeholder="0.00"
          />
          {errors.basePrice && (
            <p className="text-red-500 text-xs mt-1">{errors.basePrice}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="w-full bg-[#2a3142] border border-gray-600 rounded px-3 py-2"
          placeholder="Enter detailed product description"
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Select Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full bg-[#2a3142] border border-gray-600 rounded px-3 py-2"
          >
            <option value="">-- Choose Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">{errors.category}</p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">Select Brand</label>
          <select
            name="brand"
            value={form.brand}
            onChange={handleChange}
            className="w-full bg-[#2a3142] border border-gray-600 rounded px-3 py-2"
          >
            <option value="">-- Choose Brand --</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
          {errors.brand && (
            <p className="text-red-500 text-xs mt-1">{errors.brand}</p>
          )}
        </div>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-600 p-6 rounded-md text-center bg-[#1f2634]"
      >
        <p className="mb-2 text-sm">Drag and drop images here or</p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm cursor-pointer"
        >
          Upload Images
        </label>
        {errors.images && (
          <p className="text-red-500 text-xs mt-1">{errors.images}</p>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {form.images.map((url) => (
          <div
            key={url}
            onClick={() => handleThumbnailSelect(url)}
            className={`border-2 rounded overflow-hidden cursor-pointer ${
              form.thumbnail === url
                ? "border-blue-500 ring-2 ring-blue-400"
                : "border-gray-700"
            }`}
          >
            <img
              src={url}
              alt="Uploaded"
              className="w-full h-24 object-cover"
            />
            {form.thumbnail === url && (
              <p className="text-xs text-center text-blue-300 py-1 bg-gray-800">
                Thumbnail
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-gray-300">Variants</h4>
        {form.variants.map((variant, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <select
              value={variant.variantCategory}
              onChange={(e) =>
                handleVariantChange(index, "variantCategory", e.target.value)
              }
              className="w-full bg-[#2a3142] border border-gray-600 rounded px-3 py-2"
            >
              <option value="">Select Variant Category</option>
              {variantCategories.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={variant.value}
              placeholder="Variant Value"
              onChange={(e) =>
                handleVariantChange(index, "value", e.target.value)
              }
              className="w-full bg-[#2a3142] border border-gray-600 rounded px-3 py-2"
            />
          </div>
        ))}
        {errors.variants && (
          <p className="text-red-500 text-xs mt-1">{errors.variants}</p>
        )}
        <button
          type="button"
          onClick={addVariant}
          className="inline-block px-3 py-1 bg-green-600 hover:bg-green-700 text-sm text-white rounded mt-2"
        >
          + Add Variant
        </button>
      </div>

      <div className="pt-4 text-right">
        <button
          type="submit"
          className="inline-block px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow-md"
        >
          Create Product
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
