import { useEffect, useState } from "react";
import secureAxios from "../../../utils/secureAxios";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

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

      {/* Search bar */}
      <div className="flex justify-between items-center mb-2">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 border border-gray-300 rounded w-full max-w-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="ml-2 text-sm text-blue-600 hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded border border-gray-200 bg-white shadow">
            <table className="w-full text-sm table-auto">
              <thead className="bg-gray-100 text-left text-gray-700 uppercase">
                <tr>
                  <th className="px-4 py-3">Preview</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3 text-center">Price</th>
                  <th className="px-4 py-3 text-center">Type</th>
                  <th className="px-4 py-3 text-center">Variants</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((p) => (
                  <tr key={p._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <img
                        src={p.imageUrl || "/placeholder.jpg"}
                        alt={p.title}
                        className="w-16 h-16 object-contain border rounded"
                      />
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-900">
                      {p.title}
                    </td>
                    <td className="px-4 py-2 text-center">
                      ${p.price?.toFixed(2) || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-center capitalize">
                      {p.source || "manual"}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {p.variants?.length || 0}
                    </td>
                    <td className="px-4 py-2 text-center space-x-2">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded border text-sm ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductManagement;
