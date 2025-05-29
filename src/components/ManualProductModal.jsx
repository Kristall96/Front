import { useEffect, useState } from "react";
import secureAxios from "../utils/secureAxios";

const ManualProductModal = ({ isOpen, onClose, onSuccess, editProduct }) => {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    images: [],
    thumbnail: "",
    variants: [],
    quantity: 0,
    published: false,
    lowStockThreshold: 3,
  });

  const [variant, setVariant] = useState({
    size: "",
    color: "",
    retail_price: "",
    quantity: 0,
    previewFile: null,
    previewUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editProduct) {
      setForm({
        ...editProduct,
        price: editProduct.price || "",
        quantity: editProduct.quantity || 0,
        lowStockThreshold: editProduct.lowStockThreshold || 3,
      });
    }
  }, [editProduct]);

  if (!isOpen) return null;

  const handleProductImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await secureAxios.post("/upload/cloudinary", formData);
      const url = res.data.secure_url;
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, url],
        thumbnail: prev.images.length === 0 ? url : prev.thumbnail,
      }));
    } catch (err) {
      console.error("Image upload failed", err);
      setError("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleVariantImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await secureAxios.post("/upload/cloudinary", formData);
    return res.data.secure_url;
  };

  const addVariant = async () => {
    if (!variant.size || !variant.color || !variant.retail_price) return;
    setUploading(true);
    try {
      let previewUrl = variant.previewUrl;
      if (variant.previewFile) {
        previewUrl = await handleVariantImageUpload(variant.previewFile);
      }
      setForm((prev) => {
        const updatedImages =
          previewUrl && !prev.images.includes(previewUrl)
            ? [...prev.images, previewUrl]
            : [...prev.images];

        return {
          ...prev,
          variants: [
            ...prev.variants,
            {
              size: variant.size,
              color: variant.color,
              retail_price: variant.retail_price,
              quantity: parseInt(variant.quantity) || 0,
              preview: previewUrl,
              variantId: crypto.randomUUID(),
            },
          ],
          images: updatedImages,
        };
      });
      setVariant({
        size: "",
        color: "",
        retail_price: "",
        quantity: 0,
        previewFile: null,
        previewUrl: "",
      });
    } catch (err) {
      console.error("Failed to upload variant image", err);
      setError("Failed to upload variant image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
        lowStockThreshold: parseInt(form.lowStockThreshold),
        variants: form.variants.map((v) => ({
          ...v,
          retail_price: parseFloat(v.retail_price),
          quantity: parseInt(v.quantity) || 0,
        })),
        imageUrl: form.thumbnail,
        source: "manual",
      };

      if (editProduct) {
        await secureAxios.put(`/products/${editProduct._id}`, payload);
      } else {
        await secureAxios.post("/products", payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-[#1a1a1a] text-white p-6 w-full max-w-3xl rounded-xl shadow-lg space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl font-bold text-gray-400 hover:text-red-500"
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold">📦 Upload Manual Product</h2>
        {error && <p className="text-red-400 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="bg-black border border-gray-600 p-2 rounded"
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
            <input
              className="bg-black border border-gray-600 p-2 rounded"
              placeholder="Base Price"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <input
              className="bg-black border border-gray-600 p-2 rounded"
              placeholder="Quantity"
              type="number"
              min={0}
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
            <input
              className="bg-black border border-gray-600 p-2 rounded"
              placeholder="Low Stock Threshold"
              type="number"
              min={1}
              value={form.lowStockThreshold}
              onChange={(e) =>
                setForm({ ...form, lowStockThreshold: e.target.value })
              }
            />
          </div>

          <textarea
            className="w-full bg-black border border-gray-600 p-2 rounded"
            placeholder="Description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) =>
                setForm({ ...form, published: e.target.checked })
              }
            />
            <span className="text-sm">Publish immediately</span>
          </label>

          <div className="bg-[#2a2a2a] p-4 rounded space-y-3">
            <h3 className="font-semibold">🖼️ Product Images</h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleProductImageUpload}
              className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              disabled={uploading}
            />
            {uploading && <p className="text-sm text-blue-400">Uploading...</p>}
            {form.images.length > 0 && (
              <ul className="flex flex-wrap gap-2">
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
                      className="w-14 h-14 object-cover rounded border border-gray-500"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-[#2a2a2a] p-4 rounded space-y-3">
            <h3 className="font-semibold">🎨 Add Variant</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              <input
                className="bg-black border border-gray-600 p-2 rounded"
                placeholder="Size"
                value={variant.size}
                onChange={(e) =>
                  setVariant({ ...variant, size: e.target.value })
                }
              />
              <input
                className="bg-black border border-gray-600 p-2 rounded"
                placeholder="Color"
                value={variant.color}
                onChange={(e) =>
                  setVariant({ ...variant, color: e.target.value })
                }
              />
              <input
                className="bg-black border border-gray-600 p-2 rounded"
                placeholder="Retail Price"
                type="number"
                value={variant.retail_price}
                onChange={(e) =>
                  setVariant({ ...variant, retail_price: e.target.value })
                }
              />
              <input
                className="bg-black border border-gray-600 p-2 rounded"
                placeholder="Variant Quantity"
                type="number"
                value={variant.quantity}
                onChange={(e) =>
                  setVariant({ ...variant, quantity: e.target.value })
                }
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setVariant({ ...variant, previewFile: e.target.files[0] })
                }
                className="text-white text-sm"
              />
              <span className="text-xs text-gray-400 self-center">
                {variant.previewFile?.name || "No file chosen"}
              </span>
            </div>
            <button
              type="button"
              onClick={addVariant}
              className="px-4 py-2 mt-2 bg-blue-700 hover:bg-blue-800 text-white rounded"
              disabled={uploading}
            >
              Add Variant
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : editProduct
              ? "Update Product"
              : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManualProductModal;
