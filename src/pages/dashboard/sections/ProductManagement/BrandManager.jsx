import { useEffect, useState } from "react";
import secureAxios from "../../../../utils/secureAxios";
import { Plus } from "lucide-react";

const BrandManager = () => {
  const [brands, setBrands] = useState([]);
  const [newBrand, setNewBrand] = useState("");
  const [editingBrandId, setEditingBrandId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await secureAxios.get("/admin/brands");
      setBrands(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleCreate = async () => {
    if (!newBrand.trim()) return;
    setLoading(true);
    try {
      await secureAxios.post("/admin/brands", { name: newBrand });
      setNewBrand("");
      fetchBrands();
    } catch (err) {
      console.error("Create error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, name) => {
    try {
      await secureAxios.put(`/admin/brands/${id}`, { name });
      setEditingBrandId(null);
      fetchBrands();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this brand?")) return;
    try {
      await secureAxios.delete(`/admin/brands/${id}`);
      fetchBrands();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="bg-[#131a25] p-6 rounded-xl shadow-md space-y-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        🏷️ Manage Brands
      </h2>

      {/* Add Brand */}
      <div className="flex gap-2">
        <input
          value={newBrand}
          onChange={(e) => setNewBrand(e.target.value)}
          placeholder="New brand name"
          className="w-full p-2 rounded-md bg-[#1e2633] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleCreate}
          disabled={loading}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
        >
          <Plus size={16} /> Add
        </button>
      </div>
      {/* Brand List */}
      {brands.map((brand) => (
        <div
          key={brand._id}
          className="bg-[#1b2431] rounded-lg p-4 text-white flex justify-between items-center shadow-sm"
        >
          {editingBrandId === brand._id ? (
            <input
              defaultValue={brand.name}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUpdate(brand._id, e.target.value);
                }
              }}
              className="w-full px-4 py-2 rounded-md bg-[#2a3444] text-white border border-gray-600 focus:outline-none mr-4"
            />
          ) : (
            <span className="font-medium text-lg">{brand.name}</span>
          )}

          <div className="flex gap-3 ml-4">
            {editingBrandId === brand._id ? (
              <button
                onClick={() => setEditingBrandId(null)}
                className="px-3 py-1 rounded-md bg-gray-600 text-white hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            ) : (
              <button
                onClick={() => setEditingBrandId(brand._id)}
                className="px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                Edit
              </button>
            )}
            <button
              onClick={() => handleDelete(brand._id)}
              className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
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
