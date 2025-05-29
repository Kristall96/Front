import { useEffect, useState } from "react";
import secureAxios from "../../../utils/secureAxios";
import ProductCard from "../../../components/ProductCard";
import ManualProductModal from "../../../components/ManualProductModal"; // Make sure this path is correct

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 8;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await secureAxios.get("/products", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery,
          showAll: true,
        },
      });
      setProducts(res.data.products || []);
      setTotalPages(res.data.pages || 1);
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
  }, [currentPage, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-black">Product Management</h2>
        <div className="flex gap-3">
          <button
            onClick={handleSyncPrintful}
            disabled={syncing}
            className={`px-4 py-2 rounded text-white font-medium ${
              syncing ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {syncing ? "Syncing..." : "Sync from Printful"}
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded text-white bg-gray-600 hover:bg-gray-700"
          >
            Upload Manual Product
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-sm text-blue-600 hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      {/* Cards */}
      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

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

      {/* Modal */}
      {showModal && (
        <ManualProductModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={fetchProducts}
        />
      )}
    </div>
  );
};

export default ProductManagement;
