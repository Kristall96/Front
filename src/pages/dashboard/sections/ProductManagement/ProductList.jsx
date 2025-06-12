import { useEffect, useState, Fragment } from "react";
import secureAxios from "../../../../utils/secureAxios";
import ProductForm from "./ProductForm";
import ViewProductModal from "./ViewProductModal";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await secureAxios.get("/admin/products");
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("❌ Failed to fetch products:", err.response?.data);
    }
  };

  // const handleEdit = (product) => {
  //   setEditingProduct(product);
  //   setShowForm(true);
  // };

  const handleCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await secureAxios.delete(`/admin/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("❌ Delete failed:", err.response?.data);
    }
  };
  const handleView = (product) => {
    setViewingProduct(product);
    setIsEditing(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="bg-[#131a25] text-white p-6 rounded-xl shadow-md border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📿 All Products</h2>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
        >
          + New Product
        </button>
      </div>

      {showForm && (
        <div className="mb-10">
          <ProductForm
            initialData={editingProduct}
            onSuccess={() => {
              setShowForm(false);
              setEditingProduct(null);
              fetchProducts();
            }}
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-700 text-white text-sm">
          <thead className="bg-[#1e293b] text-left">
            <tr>
              <th className="px-4 py-3 border-b border-gray-600">Image</th>
              <th className="px-4 py-3 border-b border-gray-600">Title</th>
              <th className="px-4 py-3 border-b border-gray-600">Category</th>
              <th className="px-4 py-3 border-b border-gray-600">
                Subcategory
              </th>
              <th className="px-4 py-3 border-b border-gray-600">Brand</th>
              <th className="px-4 py-3 border-b border-gray-600">
                Current Price
              </th>
              <th className="px-4 py-3 border-b border-gray-600">Base Price</th>
              <th className="px-4 py-3 border-b border-gray-600">Sale Price</th>
              <th className="px-4 py-3 border-b border-gray-600">Discount %</th>

              <th className="px-4 py-3 border-b border-gray-600">Stock</th>
              <th className="px-4 py-3 border-b border-gray-600">Published</th>
              <th className="px-4 py-3 border-b border-gray-600">Featured</th>
              <th className="px-4 py-3 border-b border-gray-600">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length > 0 ? (
              products.map((prod) => (
                <Fragment key={prod._id}>
                  <tr className="hover:bg-[#1f2a3b] transition">
                    <td className="px-4 py-3">
                      {prod.thumbnail ? (
                        <img
                          src={prod.thumbnail}
                          alt={prod.title}
                          className="w-12 h-12 object-cover rounded-md border border-gray-600"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-600 rounded-md flex items-center justify-center text-sm">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">{prod.title}</td>
                    <td className="px-4 py-3">{prod.category?.name || "—"}</td>
                    <td className="px-4 py-3">
                      {typeof prod.subcategory === "string"
                        ? prod.subcategory.charAt(0).toUpperCase() +
                          prod.subcategory.slice(1)
                        : prod.subcategory?.name || "—"}
                    </td>

                    <td className="px-4 py-3">{prod.brand?.name || "—"}</td>
                    <td className="px-4 py-3 text-green-400 font-bold">
                      €{prod.currentPrice?.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-sm">
                      €{prod.basePrice?.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-blue-400 text-sm">
                      {prod.salePrice ? `€${prod.salePrice.toFixed(2)}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-yellow-400 text-sm">
                      {prod.discountPercentage > 0
                        ? `−${prod.discountPercentage}%`
                        : "—"}
                    </td>

                    <td
                      className={`px-4 py-3 ${
                        prod.stock === 0 ? "text-red-500 font-bold" : ""
                      }`}
                    >
                      {prod.stock}
                    </td>
                    <td className="px-4 py-3">
                      {prod.isPublished ? "✅" : "❌"}
                    </td>
                    <td className="px-4 py-3">
                      {prod.isFeatured ? "🌟" : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(prod)}
                          className="border border-gray-500 text-gray-400 hover:bg-gray-700 hover:text-white px-3 py-1 rounded-md"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(prod._id)}
                          className="border border-red-500 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1 rounded-md"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr style={{ height: "8px" }}></tr>
                </Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan="12"
                  className="text-center py-6 text-gray-400 italic"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <ViewProductModal
          viewingProduct={viewingProduct}
          setViewingProduct={setViewingProduct}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          fetchProducts={fetchProducts}
        />
      </div>
    </div>
  );
};

export default ProductList;
