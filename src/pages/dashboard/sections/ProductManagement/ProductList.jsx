import { useEffect, useState } from "react";
import secureAxios from "../../../../utils/secureAxios";
import ProductForm from "./ProductForm"; // 💡 You'll create this next

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
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">All Products</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          + New Product
        </button>
      </div>

      {showForm && (
        <ProductForm initialData={editingProduct} onSubmit={handleFormSubmit} />
      )}

      <div className="overflow-x-auto mt-6">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Published</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod._id}>
                <td>{prod.title}</td>
                <td>
                  {prod.discountedPrice
                    ? `€${prod.discountedPrice} (−${prod.discountPercentage}%)`
                    : `€${prod.basePrice}`}
                </td>
                <td className={prod.stock < 5 ? "text-red-500" : ""}>
                  {prod.stock}
                </td>
                <td>{prod.isPublished ? "✅" : "❌"}</td>
                <td className="flex gap-2">
                  <button
                    onClick={() => handleEdit(prod)}
                    className="btn btn-sm btn-outline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(prod._id)}
                    className="btn btn-sm btn-error text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-6">
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
