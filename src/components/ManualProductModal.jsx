import { useState } from "react";
import secureAxios from "../utils/secureAxios";

const ManualProductModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    images: [],
    thumbnail: "",
    variants: [],
  });

  const [variant, setVariant] = useState({
    size: "",
    color: "",
    retail_price: "",
    preview: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await secureAxios.post("/upload/cloudinary", formData);
    return res.data.secure_url;
  };

  const handleProductImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, url],
        thumbnail: prev.images.length === 0 ? url : prev.thumbnail,
      }));
    } catch {
      setError("Failed to upload product image.");
    } finally {
      setUploading(false);
    }
  };

  const handleVariantImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setVariant((prev) => ({ ...prev, preview: url }));
    } catch {
      setError("Failed to upload variant preview.");
    } finally {
      setUploading(false);
    }
  };

  const addVariant = () => {
    if (!variant.size || !variant.color || !variant.retail_price) return;
    setForm((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { ...variant, variantId: crypto.randomUUID() },
      ],
    }));
    setVariant({ size: "", color: "", retail_price: "", preview: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        variants: form.variants.map((v) => ({
          ...v,
          retail_price: parseFloat(v.retail_price),
        })),
        imageUrl: form.thumbnail,
        source: "manual",
      };

      await secureAxios.post("/products", payload);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 w-full max-w-2xl rounded-lg shadow space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl font-bold text-gray-500 hover:text-red-600"
        >
          ×
        </button>

        <h2 className="text-xl font-bold">Upload Manual Product</h2>
        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <input
            className="w-full border p-2 rounded"
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
                slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
              })
            }
          />
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="Base Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          {/* Product Images */}
          <div className="bg-gray-50 p-3 rounded space-y-2">
            <label className="font-medium">Product Images</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProductImageUpload}
              disabled={uploading}
              className="file:bg-blue-600 file:text-white file:px-4 file:py-2 file:rounded hover:file:bg-blue-700 w-full text-sm"
            />
            {uploading && <p className="text-sm text-blue-600">Uploading...</p>}
            {form.images.length > 0 && (
              <ul className="space-y-1">
                {form.images.map((img, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="thumbnail"
                      checked={form.thumbnail === img}
                      onChange={() => setForm({ ...form, thumbnail: img })}
                    />
                    <img
                      src={img}
                      alt={`preview-${i}`}
                      className="w-12 h-12 rounded border object-cover"
                    />
                    <span className="text-xs truncate">{img}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Variants */}
          <div className="bg-gray-50 p-3 rounded space-y-2">
            <h4 className="font-medium">Add Variant</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <input
                className="border p-2 rounded"
                placeholder="Size"
                value={variant.size}
                onChange={(e) =>
                  setVariant({ ...variant, size: e.target.value })
                }
              />
              <input
                className="border p-2 rounded"
                placeholder="Color"
                value={variant.color}
                onChange={(e) =>
                  setVariant({ ...variant, color: e.target.value })
                }
              />
              <input
                type="number"
                className="border p-2 rounded"
                placeholder="Retail Price"
                value={variant.retail_price}
                onChange={(e) =>
                  setVariant({ ...variant, retail_price: e.target.value })
                }
              />
              <div>
                <label className="text-sm">Preview:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleVariantImageUpload}
                  className="block mt-1"
                />
              </div>
            </div>
            {variant.preview && (
              <div className="flex gap-2 items-center mt-1">
                <img
                  src={variant.preview}
                  alt="preview"
                  className="w-12 h-12 rounded border"
                />
                <span className="text-xs text-gray-700">{variant.preview}</span>
              </div>
            )}
            <button
              type="button"
              onClick={addVariant}
              className="px-3 py-1 mt-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Add Variant
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManualProductModal;
