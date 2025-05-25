import { useEffect, useState } from "react";
import secureAxios from "../../../utils/secureAxios";

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
      setError(
        "❌ Failed to fetch products",
        err.response?.data?.message || "Unknown error"
      );
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
      await fetchProducts(); // Refresh after sync
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

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full table-auto border border-gray-300 bg-white">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Variants</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t text-sm">
                <td className="px-4 py-2">{p.title}</td>
                <td className="px-4 py-2">${p.price.toFixed(2)}</td>
                <td className="px-4 py-2">{p.source || "manual"}</td>
                <td className="px-4 py-2">{p.variants?.length || 0}</td>
                <td className="px-4 py-2">
                  <button
                    className="text-xs px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 mr-2"
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductManagement;
