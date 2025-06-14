import { useEffect, useState } from "react";
import secureAxios from "../../../../utils/secureAxios";

const generateSlug = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

const IconButton = ({ label, icon, onClick, color = "gray", disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-2 text-sm px-3 py-1 rounded-md
      ${color === "red" ? "bg-red-600 hover:bg-red-700" : ""}
      ${color === "blue" ? "bg-blue-600 hover:bg-blue-700" : ""}
      ${color === "gray" ? "bg-gray-700 hover:bg-gray-600" : ""}
      ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      text-white transition`}
  >
    {icon} {label}
  </button>
);

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await secureAxios.get("/admin/categories");
      setCategories(res.data.categories || []); // ✅ Fix here
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const handleCreate = async () => {
    if (!newCategory.trim()) return;
    const slug = generateSlug(newCategory);
    setLoading(true);
    setError("");

    try {
      await secureAxios.post("/admin/categories", { name: newCategory, slug });
      setNewCategory("");
      await fetchCategories();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create category.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id, newName) => {
    if (!newName.trim()) return;
    const slug = generateSlug(newName);

    try {
      await secureAxios.put(`/admin/categories/${id}`, {
        name: newName,
        slug,
      });
      setEditingCategory(null);
      await fetchCategories();
    } catch (err) {
      console.error("Failed to edit category", err);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirmed) return;

    try {
      await secureAxios.delete(`/admin/categories/${id}`);
      await fetchCategories();
    } catch (err) {
      console.error("Failed to delete category", err);
    }
  };

  const handleAddSub = async (catId, subName) => {
    if (!subName.trim()) return;
    const slug = generateSlug(subName);

    try {
      await secureAxios.post(`/admin/categories/${catId}/subcategories`, {
        name: subName,
        slug,
      });
      await fetchCategories();
    } catch (err) {
      console.error("Failed to add subcategory", err);
    }
  };

  const handleDeleteSub = async (catId, subSlug) => {
    try {
      await secureAxios.delete(
        `/admin/categories/${catId}/subcategories/${subSlug}`
      );
      await fetchCategories();
    } catch (err) {
      console.error("Failed to delete subcategory", err);
    }
  };

  return (
    <div className="bg-[#131a25] p-6 rounded-xl shadow-md space-y-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        📁 Manage Categories
      </h2>

      {/* Add New Category */}
      <div className="flex gap-2">
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          className="w-full px-4 py-2 rounded-md bg-[#1e2633] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <IconButton
          label={loading ? "Adding..." : "Add"}
          icon={<span className="text-lg">➕</span>}
          onClick={handleCreate}
          color="blue"
          disabled={loading}
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* Category List */}
      {categories.map((cat) => (
        <div
          key={cat._id}
          className="bg-[#1b2431] rounded-lg p-4 text-white space-y-2"
        >
          <div className="flex justify-between items-center">
            {editingCategory === cat._id ? (
              <div className="flex gap-2 w-full">
                <input
                  defaultValue={cat.name}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleEdit(cat._id, e.target.value);
                    }
                  }}
                  className="w-full p-2 rounded-md bg-[#2a3444] text-white border border-gray-600 focus:outline-none"
                />
                <button
                  onClick={() => setEditingCategory(null)}
                  className="text-sm text-gray-400 hover:text-red-400"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <p className="font-medium">{cat.name}</p>
                <div className="flex gap-2">
                  <IconButton
                    label="Edit"
                    icon={<span className="text-sm">✏️</span>}
                    onClick={() => setEditingCategory(cat._id)}
                  />
                  <IconButton
                    label="Delete"
                    icon={<span className="text-sm">🗑️</span>}
                    onClick={() => handleDelete(cat._id)}
                    color="red"
                  />
                </div>
              </>
            )}
          </div>

          {/* Subcategories */}
          <div className="pl-4 mt-2 border-l border-dashed border-gray-500">
            {cat.subcategories.map((sub) => (
              <div
                key={sub._id}
                className="flex justify-between items-center py-1"
              >
                <span className="text-sm text-gray-200">{sub.name}</span>
                <button
                  onClick={() => handleDeleteSub(cat._id, sub.slug)}
                  className="text-xs text-red-500 hover:text-red-300"
                  title="Delete subcategory"
                >
                  🗑️
                </button>
              </div>
            ))}
            <AddSubForm onAdd={(name) => handleAddSub(cat._id, name)} />
          </div>
        </div>
      ))}
    </div>
  );
};

const AddSubForm = ({ onAdd }) => {
  const [name, setName] = useState("");

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name.trim());
      setName("");
    }
  };

  return (
    <div className="flex gap-2 mt-2">
      <input
        type="text"
        value={name}
        placeholder="Add subcategory"
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        className="w-full px-3 py-2 rounded-md bg-[#2a3444] text-white border border-gray-600 focus:outline-none"
      />
      <IconButton
        label="Add"
        icon={<span className="text-sm">➕</span>}
        onClick={handleAdd}
      />
    </div>
  );
};

export default CategoryManager;
