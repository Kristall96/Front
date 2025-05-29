import { useEffect, useState } from "react";
import secureAxios from "../../../utils/secureAxios";

const BrandManager = () => {
  const [brands, setBrands] = useState([]);
  const [newBrand, setNewBrand] = useState("");
  const [editingBrandId, setEditingBrandId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBrands = async () => {
    try {
      const res = await secureAxios.get("/admin/brands");
      setBrands(res.data);
    } catch (err) {
      console.error("Error fetching brands", err);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleCreate = async () => {
    if (!newBrand.trim()) return;
    setLoading(true);
    try {
      await secureAxios.post("/admin/brands", { name: newBrand });
      setNewBrand("");
      fetchBrands();
    } catch (err) {
      console.error("Error creating brand", err);
    }
    setLoading(false);
  };

  const handleUpdate = async (id, name) => {
    try {
      await secureAxios.put(`/admin/brands/${id}`, { name });
      setEditingBrandId(null);
      fetchBrands();
    } catch (err) {
      console.error("Error updating brand", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;
    try {
      await secureAxios.delete(`/admin/brands/${id}`);
      fetchBrands();
    } catch (err) {
      console.error("Error deleting brand", err);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow space-y-6">
      <h2 className="text-xl font-bold text-gray-700">🏷️ Manage Brands</h2>

      {/* Add New Brand */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newBrand}
          onChange={(e) => setNewBrand(e.target.value)}
          placeholder="New brand name"
          className="input input-bordered w-full"
        />
        <button
          className="btn btn-primary"
          onClick={handleCreate}
          disabled={loading}
        >
          + Add
        </button>
      </div>

      {/* List of Brands */}
      {brands.map((brand) => (
        <div
          key={brand._id}
          className="flex items-center justify-between border p-3 rounded bg-gray-50 mb-2"
        >
          {editingBrandId === brand._id ? (
            <input
              defaultValue={brand.name}
              className="input input-sm input-bordered w-full"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUpdate(brand._id, e.target.value);
                }
              }}
            />
          ) : (
            <span className="font-medium text-gray-800">{brand.name}</span>
          )}

          <div className="flex gap-2">
            {editingBrandId === brand._id ? (
              <button
                className="btn btn-sm"
                onClick={() => setEditingBrandId(null)}
              >
                Cancel
              </button>
            ) : (
              <button
                className="btn btn-sm btn-outline"
                onClick={() => setEditingBrandId(brand._id)}
              >
                Edit
              </button>
            )}
            <button
              className="btn btn-sm btn-error text-white"
              onClick={() => handleDelete(brand._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BrandManager;
