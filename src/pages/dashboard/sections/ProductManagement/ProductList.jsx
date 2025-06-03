import { useEffect, useState } from "react";
import secureAxios from "../../../../utils/secureAxios";
import ProductForm from "./ProductForm";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const fetchProducts = async () => {
    try {
      const res = await secureAxios.get("/admin/products");
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Failed to fetch products", err.response?.data);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleFormSubmit = async (data) => {
    setError("");
    setFieldErrors({});
    try {
      if (editingProduct) {
        await secureAxios.put(`/admin/products/${editingProduct._id}`, data);
      } else {
        await secureAxios.post("/admin/products", data);
      }
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      const res = err.response?.data;
      setError(res?.error || "Failed to save product.");
      setFieldErrors(res?.details || {});
      console.error("Save failed", res);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await secureAxios.delete(`/admin/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Delete failed", err.response?.data);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="bg-[#131a25] text-white p-6 rounded-xl shadow-md border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📟 All Products</h2>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
        >
          + New Product
        </button>
      </div>

      {showForm && (
        <div className="mb-10">
          {error && (
            <div className="mb-4 text-red-400 bg-red-900 p-3 rounded-md">
              {error}
            </div>
          )}
          <ProductForm
            initialData={editingProduct}
            onSubmit={handleFormSubmit}
            fieldErrors={fieldErrors}
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-700 text-white text-sm">
          <thead className="bg-[#1e293b]">
            <tr>
              <th className="px-4 py-3 border-b border-gray-600 text-left">
                Image
              </th>
              <th className="px-4 py-3 border-b border-gray-600 text-left">
                Title
              </th>
              <th className="px-4 py-3 border-b border-gray-600 text-left">
                Price
              </th>
              <th className="px-4 py-3 border-b border-gray-600 text-left">
                Stock
              </th>
              <th className="px-4 py-3 border-b border-gray-600 text-left">
                Published
              </th>
              <th className="px-4 py-3 border-b border-gray-600 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod._id} className="hover:bg-[#1f2a3b] transition">
                <td className="px-4 py-3">
                  {prod.thumbnail ? (
                    <img
                      src={prod.thumbnail}
                      alt={prod.title}
                      className="w-12 h-12 object-cover rounded-md border border-gray-600"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-600 rounded-md flex items-center justify-center text-sm text-white">
                      N/A
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">{prod.title}</td>
                <td className="px-4 py-3">
                  {prod.discountedPrice
                    ? `€${prod.discountedPrice} (−${prod.discountPercentage}%)`
                    : `€${prod.basePrice}`}
                </td>
                <td
                  className={`px-4 py-3 ${
                    prod.stock < 5 ? "text-red-400 font-semibold" : ""
                  }`}
                >
                  {prod.stock}
                </td>
                <td className="px-4 py-3">{prod.isPublished ? "✅" : "❌"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(prod)}
                      className="border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white px-3 py-1 rounded-md transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(prod._id)}
                      className="border border-red-500 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1 rounded-md transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-400 italic"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
