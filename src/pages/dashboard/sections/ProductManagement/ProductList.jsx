import { useEffect, useState } from "react";
import secureAxios from "../../../../utils/secureAxios";
import ProductForm from "./ProductForm";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await secureAxios.get("/admin/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err.response?.data?.message);
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
    try {
      if (editingProduct) {
        await secureAxios.put(`/admin/products/${editingProduct._id}`, data);
      } else {
        await secureAxios.post("/admin/products", data);
      }
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      console.error("Save failed", err.response?.data?.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await secureAxios.delete(`/admin/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Delete failed", err.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="bg-[#131a25] p-6 rounded-xl shadow-md border border-gray-700 text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">🧾 All Products</h2>
        <button
          onClick={handleCreate}
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition"
        >
          + New Product
        </button>
      </div>

      {showForm && (
        <div className="mb-10">
          <ProductForm
            initialData={editingProduct}
            onSubmit={handleFormSubmit}
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-600">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-3 border-b border-gray-600">Title</th>
              <th className="px-4 py-3 border-b border-gray-600">Price</th>
              <th className="px-4 py-3 border-b border-gray-600">Stock</th>
              <th className="px-4 py-3 border-b border-gray-600">Published</th>
              <th className="px-4 py-3 border-b border-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {products.map((prod) => (
              <tr
                key={prod._id}
                className="hover:bg-gray-700 transition duration-150"
              >
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
                      className="px-3 py-1 rounded-md border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(prod._id)}
                      className="px-3 py-1 rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
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
                  colSpan="5"
                  className="text-center text-gray-400 py-8 italic"
                >
                  No products yet.
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
