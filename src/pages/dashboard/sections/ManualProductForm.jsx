import { useState } from "react";
import secureAxios from "../../../utils/secureAxios"; // Adjust the path based on your structure
import { useNavigate } from "react-router-dom";

const ManualProductForm = () => {
  const navigate = useNavigate();
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
      navigate("/dashboard/admin?tab=products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Upload Manual Product
      </h2>

      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
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

        {/* Variant Builder */}
        <div className="bg-gray-50 p-4 rounded-md space-y-2">
          <h4 className="font-medium">Add Variant</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <input
              className="border p-2 rounded"
              placeholder="Size"
              value={variant.size}
              onChange={(e) => setVariant({ ...variant, size: e.target.value })}
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
              className="border p-2 rounded"
              type="number"
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
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Add Variant
          </button>
        </div>

        {/* Variant Preview */}
        {form.variants.length > 0 && (
          <div className="space-y-1">
            <h4 className="font-medium mt-4">Variants:</h4>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {form.variants.map((v, i) => (
                <li key={i}>
                  {v.size} • {v.color} • ${v.retail_price}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default ManualProductForm;
