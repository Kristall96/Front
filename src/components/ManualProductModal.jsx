import { useState } from "react";
import secureAxios from "../utils/secureAxios";

const ManualProductModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    imageUrl: "",
    variants: [],
  });

  const [variant, setVariant] = useState({
    size: "",
    color: "",
    retail_price: "",
    preview: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

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
        source: "manual",
      };

      await secureAxios.post("/products", payload);
      onSuccess(); // refetch product list
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 w-full max-w-2xl rounded-lg shadow space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl font-bold text-gray-500 hover:text-red-600"
        >
          ×
        </button>

        <h2 className="text-xl font-bold">Upload Manual Product</h2>

        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
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

          <input
            className="w-full border p-2 rounded"
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
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

          {/* Variant Section */}
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
              <input
                className="border p-2 rounded"
                placeholder="Preview Image URL"
                value={variant.preview}
                onChange={(e) =>
                  setVariant({ ...variant, preview: e.target.value })
                }
              />
            </div>
            <button
              type="button"
              onClick={addVariant}
              className="px-3 py-1 mt-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Add Variant
            </button>
          </div>

          {form.variants.length > 0 && (
            <ul className="list-disc list-inside text-sm text-gray-700">
              {form.variants.map((v, i) => (
                <li key={i}>
                  {v.size} • {v.color} • ${v.retail_price}
                </li>
              ))}
            </ul>
          )}

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
