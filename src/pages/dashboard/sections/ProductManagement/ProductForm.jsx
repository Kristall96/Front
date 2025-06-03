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
        toast.error(
          err.response?.data?.message || "Failed to load form metadata."
        );
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
        formData.append("file", file);

        const res = await secureAxios.post("/upload", formData);
        if (res.data?.url) {
          uploadedUrls.push(res.data.url);
        } else {
          throw new Error("No URL returned");
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
      console.error("Upload error:", err);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleImageUpload(files);
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    handleImageUpload(files);
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
    try {
      const payload = { ...form };
      const res = await secureAxios.post("/admin/products", payload);
      toast.success("Product created successfully!");
      onSuccess?.(res.data.product);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating product.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-[#1a1f2b] p-6 rounded-xl shadow-lg border border-gray-700 text-white"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Product Title</label>
          <input
            type="text"
            name="title"
            placeholder="Product Title"
            value={form.title}
            onChange={handleChange}
            required
            className="input input-bordered w-full bg-[#2a3142] border-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Base Price</label>
          <input
            type="number"
            name="basePrice"
            placeholder="Base Price"
            value={form.basePrice}
            onChange={handleChange}
            required
            className="input input-bordered w-full bg-[#2a3142] border-gray-600"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Description</label>
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          className="textarea textarea-bordered w-full bg-[#2a3142] border-gray-600"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Select Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="select select-bordered w-full bg-[#2a3142] border-gray-600"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Select Brand</label>
          <select
            name="brand"
            value={form.brand}
            onChange={handleChange}
            required
            className="select select-bordered w-full bg-[#2a3142] border-gray-600"
          >
            <option value="">Select Brand</option>
            {brands.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-600 p-6 rounded-md text-center bg-[#1f2634]"
      >
        <p className="mb-2 text-sm">Drag and drop images here</p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          id="fileInput"
        />
        <label htmlFor="fileInput" className="btn btn-sm btn-outline">
          Browse Images
        </label>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {form.images.map((url) => (
          <div
            key={url}
            className={`border-2 rounded-md overflow-hidden cursor-pointer transition ${
              form.thumbnail === url ? "border-blue-500" : "border-gray-700"
            }`}
            onClick={() => handleThumbnailSelect(url)}
          >
            <img
              src={url}
              alt="Uploaded"
              className="w-full h-24 object-cover"
            />
            {form.thumbnail === url && (
              <p className="text-xs text-center text-blue-400 py-1 bg-gray-800">
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
              className="select select-sm select-bordered w-full bg-[#2a3142] border-gray-600"
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
              placeholder="Value"
              value={variant.value}
              onChange={(e) =>
                handleVariantChange(index, "value", e.target.value)
              }
              className="input input-sm input-bordered w-full bg-[#2a3142] border-gray-600"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addVariant}
          className="btn btn-outline btn-sm mt-2"
        >
          + Add Variant
        </button>
      </div>

      <div className="pt-4 text-right">
        <button type="submit" className="btn btn-primary">
          Create Product
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
