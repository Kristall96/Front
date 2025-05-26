import { useEffect, useState } from "react";
import secureAxios from "../../../utils/secureAxios";
import { Link } from "react-router-dom";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await secureAxios.get("/products");
      setProducts(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "❌ Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleSyncPrintful = async () => {
    if (!confirm("Syncing will pull all products from Printful. Proceed?"))
      return;
    setSyncing(true);
    try {
      await secureAxios.post("/admin/products/sync");
      await fetchProducts();
      alert("✅ Synced Printful products successfully");
    } catch (err) {
      alert("❌ Sync failed: " + (err.response?.data?.message || err.message));
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-black">Product Management</h2>
        <div className="flex gap-4">
          <button
            onClick={handleSyncPrintful}
            disabled={syncing}
            className={`px-4 py-2 rounded text-white font-medium ${
              syncing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {syncing ? "Syncing..." : "Sync from Printful"}
          </button>
          <button
            disabled
            className="px-4 py-2 rounded text-white bg-gray-500 cursor-not-allowed"
          >
            Upload Manual Product (coming soon)
          </button>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <div
              key={p._id}
              className="border rounded-xl shadow-sm hover:shadow-md bg-white transition"
            >
              <img
                src={p.imageUrl || "/placeholder.jpg"}
                alt={p.title}
                className="w-full h-48 object-contain bg-gray-50 rounded-t-xl"
                loading="lazy"
              />
              <div className="p-4 space-y-1">
                <h3 className="text-md font-semibold text-gray-800">
                  {p.title}
                </h3>
                <p className="text-sm text-gray-600">${p.price?.toFixed(2)}</p>
                <p className="text-xs text-gray-400">
                  {p.variants?.length || 0} variants
                </p>
                <div className="flex items-center justify-between pt-3">
                  <span className="text-xs text-gray-500 capitalize">
                    {p.source || "manual"}
                  </span>
                  <div className="space-x-2">
                    <button
                      className="text-xs px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      disabled
                    >
                      Edit
                    </button>
                    <button
                      className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      disabled={p.source === "printful"}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
